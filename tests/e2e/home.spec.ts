import { test, expect } from "@playwright/test";

const BLOG_SLUG = "building-my-ai-native-marketing-system";
const BLOG_TITLE = "Building my AI-native marketing system";

test.describe("home page (bento landing)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('hero H1 reads "Let\'s cook"', async ({ page }) => {
    // The headline is rendered by a per-word animation that splits each word
    // into its own span, so innerText can collapse to "Let'scook" with no
    // space. Assert robustly against the level-1 heading: strip whitespace and
    // check it contains both "Let" and "cook".
    const h1 = page.getByRole("heading", { level: 1 }).first();
    await expect(h1).toBeVisible();
    const text = ((await h1.innerText()) || "").replace(/\s+/g, "");
    expect(text.toLowerCase()).toContain("cook");
    expect(text.toLowerCase()).toContain("let");
  });

  test('the string "By the numbers" does not appear', async ({ page }) => {
    await expect(page.getByText("By the numbers", { exact: false })).toHaveCount(
      0,
    );
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("By the numbers");
  });

  test('About tile shows "I build the thing from nothing"', async ({ page }) => {
    await expect(
      page.getByText("I build the thing from nothing", { exact: false }).first(),
    ).toBeVisible();
  });

  test('there are at least 2 "Let\'s talk" links/buttons', async ({ page }) => {
    // Hero CTA + Contact tile CTA both render the shared "Let's talk" action.
    const count = await page.getByText("Let's talk", { exact: false }).count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("résumé link, github link, and linkedin link are present", async ({
    page,
  }) => {
    // Résumé: a link with a download attribute OR an href ending in .pdf.
    const resumeLinks = page.locator(
      'a[download], a[href$=".pdf"], a[href$=".pdf?dl=1"]',
    );
    expect(await resumeLinks.count()).toBeGreaterThanOrEqual(1);

    const githubLinks = page.locator('a[href*="github.com"]');
    expect(await githubLinks.count()).toBeGreaterThanOrEqual(1);

    const linkedinLinks = page.locator('a[href*="linkedin.com"]');
    expect(await linkedinLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("AI-Native Ops beam has an anthropic image and no openai image", async ({
    page,
  }) => {
    // Wait for the page to settle so lazy/async images render.
    await page.waitForLoadState("networkidle");
    const srcs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img")).map(
        (img) => img.getAttribute("src") || img.currentSrc || "",
      ),
    );
    expect(srcs.some((s) => s.toLowerCase().includes("anthropic"))).toBe(true);
    expect(srcs.some((s) => s.toLowerCase().includes("openai"))).toBe(false);
  });

  test("projects include humanizer, polysearch, and lock", async ({ page }) => {
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).toContain("humanizer");
    expect(bodyText).toContain("polysearch");
    // "lock" appears in the name "Michael Lock" too, but the project must exist;
    // assert a github.com/milock/lock link is present to be precise.
    const lockRepoLinks = page.locator('a[href*="milock/lock"]');
    expect(await lockRepoLinks.count()).toBeGreaterThanOrEqual(1);
    expect(bodyText).toContain("lock");
  });

  test("no broken images — every <img> decodes (naturalWidth > 0)", async ({
    page,
  }) => {
    // Many logo chips use loading="lazy" and live below the fold, so they only
    // start fetching once scrolled into view. Scroll the full page first to
    // trigger every lazy load, then force eager decoding and wait for each
    // image to finish. A *broken* image is one that finished loading
    // (complete === true) but failed to decode (naturalWidth === 0) — an image
    // still in flight is not broken, just slow.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");

    const broken = await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        imgs.map(async (img) => {
          img.loading = "eager";
          // Nudge a fetch for any image the browser deferred.
          if (!img.complete) {
            const current = img.getAttribute("src");
            if (current) img.setAttribute("src", current);
          }
          try {
            await img.decode();
          } catch {
            // decode() rejects on failure; the complete/naturalWidth check
            // below is the source of truth.
          }
          if (img.complete) return;
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 8000);
          });
        }),
      );
      // Only count genuine decode failures: finished loading but zero width.
      return imgs
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute("src") || img.currentSrc || "(no src)");
    });
    expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
  });
});

test.describe("blog post route", () => {
  test(`/blog/${BLOG_SLUG} returns 200 and shows its title`, async ({
    page,
  }) => {
    const response = await page.goto(`/blog/${BLOG_SLUG}`);
    expect(response, "navigation produced a response").not.toBeNull();
    expect(response!.status()).toBe(200);

    const heading = page.getByRole("heading", { name: BLOG_TITLE });
    await expect(heading).toBeVisible();
  });
});

test.describe("mobile layout", () => {
  test("no horizontal overflow on the home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return {
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      };
    });
    // Allow a 1px rounding tolerance.
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
