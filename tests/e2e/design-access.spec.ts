import { test, expect } from '@playwright/test';

test('reduced-motion visitors can see and navigate the page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.group\\/tile').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('a button')).toHaveCount(0);
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Filter projects' })).toBeVisible();
  await expect(page.locator('a[href="/projects/thriftly"]')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('chat respects the server input limit and recovers after failure', async ({ page }) => {
  await page.route('**/api/chat', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Ask me anything…' });
  await expect(input).toHaveAttribute('maxlength', '2000');
  await input.fill('A question about your work');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('log', { name: 'Conversation' }).getByRole('alert')).toContainText('trouble responding');
  await expect(input).toBeEnabled();
  await input.fill('Try again');
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  await page.getByRole('button', { name: 'New conversation' }).click();
  await expect(page.getByRole('button', { name: 'How do you use AI?' })).toBeVisible();
});

test('self-hosted game loads without weakening other page framing rules', async ({ page, request }) => {
  const home = await request.get('/');
  expect(home.headers()['x-frame-options']).toBe('DENY');
  const game = await request.get('/t-rex/index.html');
  expect(game.headers()['x-frame-options']).toBe('SAMEORIGIN');
  expect(game.headers()['content-security-policy']).toContain("frame-ancestors 'self'");
  await page.goto('/');
  await page.locator('iframe[title="Chrome T-Rex runner game"]').scrollIntoViewIfNeeded();
  await expect(page.frameLocator('iframe[title="Chrome T-REx runner game" i]').locator('canvas')).toBeVisible();
});

test('a long streamed reply stays inside the chat and can be reset', async ({ page }) => {
  const answer = 'A long answer about the work. '.repeat(35) + ' https://example.com/' + 'a'.repeat(250);
  await page.route('**/api/chat', route => route.fulfill({
    status: 200,
    headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
    body: [
      { type: 'start', messageId: 'reply-1' },
      { type: 'text-start', id: 'text-1' },
      { type: 'text-delta', id: 'text-1', delta: answer },
      { type: 'text-end', id: 'text-1' },
      { type: 'finish' },
    ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n',
  }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('textbox').fill('Tell me about the work');
  await page.getByRole('button', { name: 'Send message' }).click();
  const conversation = page.getByRole('log', { name: 'Conversation' });
  await expect(conversation).toContainText('A long answer about the work.');
  expect(await conversation.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await page.getByRole('button', { name: 'New conversation' }).click();
  await expect(conversation).not.toContainText('A long answer about the work.');
});

test('narrow layout grows with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '20px'; });
  const hero = page.locator('#hero');
  const heading = page.getByRole('heading', { level: 1 });
  const heroBox = (await hero.boundingBox())!;
  const headingBox = (await heading.boundingBox())!;
  expect(headingBox.y).toBeGreaterThanOrEqual(heroBox.y);
  expect(headingBox.y + headingBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height);
  const resume = page.locator('#contact a[download]');
  expect(await resume.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  const stackAction = page.getByRole('link', { name: 'See the open-source tools' });
  expect(await stackAction.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
