import { test, expect, type Page } from '@playwright/test';

// Tiles lay their content out statically and grow to fit. Nothing inside a
// bento tile may own a scroll gesture, vertical or horizontal. The Ask tile is
// excluded: its conversation log and textarea are deliberate scroll regions.
async function tileScrollContainers(page: Page) {
  return page.evaluate(() => {
    const offenders: string[] = [];
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('#main-content .tile-surface'))
      .filter(tile => !tile.querySelector('textarea'));
    for (const tile of tiles) {
      for (const el of Array.from(tile.querySelectorAll<HTMLElement>('*'))) {
        const style = getComputedStyle(el);
        const scrollable = (value: string) => value === 'auto' || value === 'scroll';
        if (scrollable(style.overflowX) || scrollable(style.overflowY)) {
          offenders.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120));
        }
      }
    }
    return offenders;
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`no scroll container inside any tile and no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await tileScrollContainers(page)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('phone disclosures reveal the rest of each long list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const cases = [
    { button: 'Show earlier roles', hidden: page.locator('a[href="https://www.accenture.com"]') },
    { button: 'Show all 32 tools', hidden: page.getByText('Canva', { exact: true }) },
    { button: 'Show all 11 projects', hidden: page.locator('#projects a[href="/projects/humanizer"]') },
  ];
  // The label flips to "Show fewer ..." once open, so hold each toggle by its
  // DOM position (roles, tools, projects) rather than by its name.
  const toggles = page.locator('#main-content button[aria-controls]');
  for (const [i, { button, hidden }] of cases.entries()) {
    const toggle = toggles.nth(i);
    await expect(toggle).toHaveText(button);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Collapsed items stay in the DOM (server-rendered) but are not shown.
    await expect(hidden).toHaveCount(1);
    await expect(hidden).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(hidden).toBeVisible();
  }
});

test('disclosure buttons are not shown from the sm breakpoint up', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Show earlier roles' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Accenture' })).toBeVisible();
});

test('project filter narrows the grid by type', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const filter = page.getByRole('group', { name: 'Filter projects' });
  const cards = page.locator('#projects li');
  await expect(cards).toHaveCount(11);
  await filter.getByRole('button', { name: /Marketing/ }).click();
  await expect(filter.getByRole('button', { name: /Marketing/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(4);
  await filter.getByRole('button', { name: /Vibe-coded/ }).click();
  await expect(cards).toHaveCount(7);
  await filter.getByRole('button', { name: /All/ }).click();
  await expect(cards).toHaveCount(11);
});
