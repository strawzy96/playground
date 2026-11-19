import { test, expect, type Page } from '@playwright/test';

async function scene(page: Page, id: string) {
  await page.evaluate(section => document.getElementById(section)?.scrollIntoView({ block: 'start', behavior: 'instant' }), id);
}

const phase = (page: Page) => page.locator('#experience');

async function installAudioCounter(page: Page) {
  await page.addInitScript(() => {
    const scope = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext; __audioStarts: number };
    scope.__audioStarts = 0;
    for (const name of ['AudioContext', 'webkitAudioContext'] as const) {
      const Native = scope[name];
      if (!Native) continue;
      scope[name] = new Proxy(Native, {
        construct(target, args) {
          scope.__audioStarts++;
          return Reflect.construct(target, args);
        },
      });
    }
  });
}

test('opening viewport is a credible career portfolio with no automatic sound or external requests', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) && !['data:', 'blob:'].includes(url.protocol)) external.push(request.url());
  });
  await installAudioCounter(page);
  await page.goto('/');
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect(page.getByRole('heading', { name: /Good systems.*Better outcomes/s })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Michael McStraw, home', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enable sound', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'YOU WERE NEVER THE ADMINISTRATOR.', exact: true })).not.toBeInViewport();
  expect(await page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBe(0);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  await page.screenshot({ path: '.local/opening-desktop.png', fullPage: false });
});

test('scrolling escalates from normal to uneasy, breach and the horror finale; reverse scrolling restores daylight', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'about');
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await scene(page, 'work');
  await expect(phase(page)).toHaveAttribute('data-phase', 'uneasy');
  await scene(page, 'continuity');
  await expect(phase(page)).toHaveAttribute('data-phase', 'breach');
  await scene(page, 'contact');
  await expect(phase(page)).toHaveAttribute('data-phase', 'dark');
  await expect(page.getByRole('heading', { name: 'YOU WERE NEVER THE ADMINISTRATOR.', exact: true })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Verify identity', exact: true })).toBeVisible();
  await page.screenshot({ path: '.local/finale-desktop.png', fullPage: false });
  await scene(page, 'home');
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect(page.getByRole('heading', { name: /Good systems.*Better outcomes/s })).toBeInViewport();
});

test('the final verification has a clear working return to daylight', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'contact');
  await expect(phase(page)).toHaveAttribute('data-phase', 'dark');
  await page.getByRole('button', { name: 'Verify identity', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Identity verification', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Return to daylight', exact: true })).toBeVisible();
  await page.screenshot({ path: '.local/identity-horror.png', fullPage: false });
  await dialog.getByRole('button', { name: 'Return to daylight', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test('ambient sound remains opt-in and can always be muted', async ({ page }) => {
  await installAudioCounter(page);
  await page.goto('/');
  await scene(page, 'handover');
  await expect(phase(page)).toHaveAttribute('data-phase', 'breach');
  expect(await page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBe(0);
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mute sound', exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Enable sound', exact: true })).toBeVisible();
});

for (const width of [375, 390]) {
  test(`all story stages fit a ${width}px mobile viewport with an accessible exit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
    await expect(menu).toBeVisible();
    await menu.click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toHaveAttribute('aria-expanded', 'false');
    for (const id of ['home', 'about', 'work', 'beyond', 'continuity', 'handover', 'contact']) {
      await scene(page, id);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${id} must not overflow`).toBeLessThanOrEqual(1);
    }
    await expect(phase(page)).toHaveAttribute('data-phase', 'dark');
    await page.screenshot({ path: `.local/finale-mobile-${width}.png`, fullPage: false });
    await page.getByRole('button', { name: 'Verify identity', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Identity verification', exact: true });
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'the close encounter must fit').toBeLessThanOrEqual(1);
    await dialog.getByRole('button', { name: 'Return to daylight', exact: true }).click();
    await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });
}

test('selected-work case notes open and dismiss normally before the story turns dark', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'work');
  await page.getByRole('button', { name: 'Read the case notes', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Making renewal routine.', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Verify what is actually being served.');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(phase(page)).toHaveAttribute('data-phase', 'uneasy');
});
