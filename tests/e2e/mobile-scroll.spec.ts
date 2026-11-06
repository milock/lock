import { test, expect, type Page } from '@playwright/test';

async function settleScrolling(page: Page) {
  let previous = '';
  let stable = 0;
  for (let sample = 0; sample < 50; sample++) {
    const position = await page.evaluate(() => JSON.stringify([
      scrollY, ...Array.from(document.querySelectorAll('.horizontal-rail')).map(el => el.scrollLeft),
    ]));
    stable = position === previous ? stable + 1 : 0;
    if (stable >= 3) return;
    previous = position;
    await page.waitForTimeout(100);
  }
  throw new Error('Page or rail still moving after five seconds');
}

async function swipe(page: Page, start: { x: number; y: number }, end: { x: number; y: number }) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  for (let step = 1; step <= 10; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
      x: start.x + (end.x - start.x) * step / 10,
      y: start.y + (end.y - start.y) * step / 10,
    }] });
    await page.waitForTimeout(40);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await settleScrolling(page);
  await page.waitForTimeout(1200);
  await session.detach();
}

for (const name of ['Experience', 'Projects', 'Tool stack']) {
  test(`${name}: sideways browsing leaves vertical page swipes free`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Chromium touch-input coverage runs in the mobile project.');
    await page.goto('/');
    const rail = page.getByRole('region', { name, exact: true });
    await rail.evaluate(el => {
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 220, behavior: 'instant' });
    });
    let bounds = (await rail.boundingBox())!;
    const y = bounds.y + Math.min(bounds.height / 2, 90);
    const initialY = await page.evaluate(() => window.scrollY);
    await swipe(page, { x: bounds.x + bounds.width * .8, y }, { x: bounds.x + bounds.width * .2, y });
    expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(30);
    expect(Math.abs(await page.evaluate(() => window.scrollY) - initialY)).toBeLessThan(20);

    // Both the start and end of the horizontal collection must hand vertical
    // gestures to the document, rather than swallowing them in a nested pane.
    for (const end of [false, true]) {
      // Independent boundary scenarios start fresh; programmatic resets during
      // a compositor fling are not a physical user gesture.
      await page.reload();
      await rail.evaluate((el, end) => {
        el.scrollLeft = end ? el.scrollWidth : 0;
        window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 220, behavior: 'instant' });
      }, end);
      await settleScrolling(page);
      bounds = (await rail.boundingBox())!;
      const startY = bounds.y + Math.min(bounds.height - 15, 130);
      const documentY = await page.evaluate(() => window.scrollY);
      await swipe(page, { x: bounds.x + bounds.width / 2, y: startY }, { x: bounds.x + bounds.width / 2, y: startY - 120 });
      expect(await page.evaluate(() => window.scrollY) - documentY).toBeGreaterThan(40);
      expect(await rail.evaluate(el => el.scrollTop)).toBe(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('horizontal collections retain keyboard access', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Experience', 'Projects', 'Tool stack']) {
    const rail = page.getByRole('region', { name, exact: true });
    await rail.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  }
});
