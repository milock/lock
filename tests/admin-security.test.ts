import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/chat/logs/route';
import { getProjectBySlug } from '../lib/projects';

test('admin logs require a bearer credential and never cache responses', async () => {
  const oldToken = process.env.LOGS_TOKEN;
  const oldDb = process.env.DATABASE_URL;
  process.env.LOGS_TOKEN = 'test-only-not-a-real-secret';
  delete process.env.DATABASE_URL;
  try {
    for (const req of [
      new Request('https://example.com/api/chat/logs'),
      new Request('https://example.com/api/chat/logs?key=test-only-not-a-real-secret'),
      new Request('https://example.com/api/chat/logs', {headers:{authorization:'Bearer wrong'}}),
    ]) {
      const res = await GET(req);
      assert.equal(res.status, 401);
      assert.equal(res.headers.get('cache-control'), 'no-store');
    }
    const res = await GET(new Request('https://example.com/api/chat/logs', {headers:{authorization:'Bearer test-only-not-a-real-secret'}}));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
    assert.match(await res.text(), /No conversations logged yet/);
    delete process.env.LOGS_TOKEN;
    assert.equal((await GET(new Request('https://example.com/api/chat/logs'))).status, 401);
  } finally {
    if(oldToken === undefined) delete process.env.LOGS_TOKEN; else process.env.LOGS_TOKEN = oldToken;
    if(oldDb === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = oldDb;
  }
});
test('project reader rejects traversal slugs', () => {
  for(const slug of ['../secret', '/tmp/secret', '..', 'nested/path', 'a\\b']) assert.equal(getProjectBySlug(slug), null);
});
