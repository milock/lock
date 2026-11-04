import assert from "node:assert/strict";
import test from "node:test";
import { ChatInputError, ChatRateLimiter, MAX_BODY_BYTES, clientIp, conversationId, originAllowed, readChatBody, providerDiagnostic, requestHistory, safeInternalHref, validateMessages } from "../lib/chat-security";

const message = (text = "hello", role = "user") => ({ id: "id-1", role, parts: [{ type: "text", text }] });

test("accepts text and reconstructs messages without untrusted metadata", () => {
  assert.deepEqual(validateMessages({ messages: [{ ...message(), metadata: { provider: "untrusted" } }] }), [message()]);
});
test("rejects malformed bodies, roles and non-text parts", () => {
  for (const body of [null, [], {}, { messages: [] }, { messages: [null] }, { messages: [message("hi", "system"), message()] }, { messages: [{ ...message(), parts: null }] }, { messages: [{ ...message(), parts: [null] }] }, { messages: [{ ...message(), parts: [{ type: "file", url: "https://example.com/private" }] }] }, { messages: [{ ...message(), parts: [{ type: "text", text: 3 }] }] }, { messages: [message(" ")] }, { messages: [message("hi", "assistant")] }]) {
    assert.throws(() => validateMessages(body), ChatInputError);
  }
});
test("caps every message, all history, IDs and part count", () => {
  const cases = [
    [message("x".repeat(2001))],
    [message("x".repeat(4001), "assistant"), message()],
    [...Array.from({ length: 13 }, () => message("x".repeat(700))), message()],
    Array.from({ length: 25 }, () => message()),
    [{ ...message(), id: "x".repeat(129) }],
    [{ ...message(), parts: Array.from({ length: 17 }, () => ({ type: "text", text: "x" })) }],
  ];
  for (const messages of cases) assert.throws(() => validateMessages({ messages }), ChatInputError);
});
test("bounds bytes independently of Content-Length", async () => {
  const valid = new Request("http://localhost/api/chat", { method: "POST", body: JSON.stringify({ messages: [message()] }) });
  assert.deepEqual(await readChatBody(valid), { messages: [message()] });
  for (const headers of [new Headers(), new Headers({ "content-length": "2" })]) {
    const req = new Request("http://localhost/api/chat", { method: "POST", headers, body: "x".repeat(MAX_BODY_BYTES + 1) });
    await assert.rejects(readChatBody(req), (error: unknown) => error instanceof ChatInputError && error.status === 413);
  }
});
test("rejects oversized declared lengths before reading the body", async () => {
  const req = new Request("http://localhost/api/chat", { method: "POST", headers: { "content-length": String(MAX_BODY_BYTES + 1) }, body: "{}" });
  await assert.rejects(readChatBody(req), (error: unknown) => error instanceof ChatInputError && error.status === 413);
});
test("allows exact production/preview origins and development loopback only", () => {
  const request = (origin: string) => new Request("https://michael-lock.com/api/chat", { headers: { origin } });
  const env = { NODE_ENV: "production", VERCEL_URL: "lock-current.vercel.app" };
  for (const origin of ["https://michael-lock.com", "https://www.michael-lock.com", "https://lock-current.vercel.app"]) assert.equal(originAllowed(request(origin), env), true);
  for (const origin of ["https://evil.vercel.app", "http://michael-lock.com", "https://michael-lock.com:444", "http://localhost:3000", "https://localhost.evil.com", "null"]) assert.equal(originAllowed(request(origin), env), false);
  assert.equal(originAllowed(request("http://localhost:3000"), { NODE_ENV: "development" }), true);
  assert.equal(originAllowed(request("http://localhost.evil.com"), { NODE_ENV: "development" }), false);
});
test("uses only the platform-overwritten IP header on Vercel", () => {
  const req = new Request("https://michael-lock.com", { headers: { "x-forwarded-for": "attacker", "x-real-ip": "attacker", "x-vercel-forwarded-for": "192.0.2.1" } });
  assert.equal(clientIp(req, true), "192.0.2.1");
  assert.equal(clientIp(req, false), "unknown");
  assert.equal(clientIp(new Request("https://michael-lock.com", { headers: { "x-forwarded-for": "attacker" } }), true), "unknown");
});
test("rate limiter bounds buckets and resets expired windows", () => {
  const limiter = new ChatRateLimiter(2);
  for (let count = 0; count < 10; count++) assert.equal(limiter.check("one", 1000).ok, true);
  assert.deepEqual(limiter.check("one", 1000), { ok: false, retryAfter: 60 });
  assert.equal(limiter.check("one", 61000).ok, true);
  assert.equal(limiter.check("two", 1000).ok, true);
  assert.equal(limiter.check("three", 1000).ok, false);
  assert.equal(limiter.check("three", 3_601_000).ok, true);
});
test("rate limiter enforces the hourly budget across minute resets", () => {
  const limiter = new ChatRateLimiter();
  for (let minute = 0; minute < 8; minute++) for (let count = 0; count < 10; count++) assert.equal(limiter.check("one", minute * 60_000).ok, true);
  assert.equal(limiter.check("one", 8 * 60_000).ok, false);
});
test("transport keeps long conversations within the server budget", () => {
  const history = Array.from({ length: 51 }, (_, i) => message("x".repeat(1000), i % 2 ? "assistant" : "user"));
  const result = requestHistory(history);
  assert.ok(result.length <= 12);
  assert.ok(result.reduce((sum, item) => sum + item.parts[0].text.length, 0) <= 8000);
  assert.doesNotThrow(() => validateMessages({ messages: result }));
});
test("internal links cannot become protocol-relative or backslash external URLs", () => {
  assert.equal(safeInternalHref("/projects/example"), true);
  for (const href of ["//evil.example", "/\\evil.example", "/\nevil.example", "javascript:alert(1)"]) assert.equal(safeInternalHref(href), false);
});

test("conversation identity survives trimmed history but is bounded", () => {
  assert.equal(conversationId({ conversationId: "original" }, "new-first"), "original");
  assert.equal(conversationId({}, "first"), "first");
  for (const value of [null, {}, "", "x".repeat(129), "bad\nkey"]) assert.throws(() => conversationId({ conversationId: value }, "first"), ChatInputError);
});

test("retry after a failed stream omits empty assistant placeholders", () => {
  for (const parts of [[], [{ type: "step-start" }], [{ type: "text", text: "" }], [{ type: "text", text: "  " }]]) {
    const history = [message("first question"), { id: "failed", role: "assistant", parts }, { ...message("retry question"), id: "retry" }];
    // This is also the shape restored from sessionStorage after a failed stream.
    const result = requestHistory(JSON.parse(JSON.stringify(history)));
    assert.equal(result.length, 2);
    assert.equal(result[result.length - 1].id, "retry");
    assert.doesNotThrow(() => validateMessages({ messages: result }));
  }
});

test("provider diagnostics return only approved categories and numeric status", () => {
  const secret = "sk-ant-test-secret-never-log";
  const cases = [
    { statusCode: 401, message: `invalid x-api-key ${secret}`, category: "authentication" },
    { statusCode: 400, responseBody: `Your credit balance is too low ${secret}`, category: "billing" },
    { statusCode: 403, responseBody: secret, category: "forbidden" },
    { statusCode: 429, responseBody: secret, category: "rate_limit" },
    { statusCode: 404, responseBody: secret, category: "model_unavailable" },
    { statusCode: 529, responseBody: secret, category: "overloaded" },
    { statusCode: 500, message: secret, responseBody: secret, category: "unknown" },
  ];
  for (const sample of cases) {
    const diagnostic = providerDiagnostic(sample);
    assert.deepEqual(diagnostic, { statusCode: sample.statusCode, category: sample.category });
    assert.equal(JSON.stringify(diagnostic).includes(secret), false);
    assert.deepEqual(Object.keys(diagnostic).sort(), ["category", "statusCode"]);
  }
  assert.deepEqual(providerDiagnostic(), { statusCode: null, category: "unknown" });
  assert.deepEqual(providerDiagnostic({ statusCode: Number.NaN, message: secret }), { statusCode: null, category: "unknown" });
});
