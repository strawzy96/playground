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
  await expect(page.getByRole('heading', { name: 'DON’T HIRE ME.', exact: true })).not.toBeInViewport();
  await expect(page.getByRole('heading', { name: 'IT has ruined my life.', exact: true })).not.toBeInViewport();
  expect(await page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBe(0);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  await page.screenshot({ path: '.local/personal-horror-opening-desktop.png', fullPage: false });
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
  await expect(page.getByRole('heading', { name: 'DON’T HIRE ME.', exact: true })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Hire me anyway', exact: true })).toBeVisible();
  await page.screenshot({ path: '.local/personal-horror-finale-desktop.png', fullPage: false });
  await scene(page, 'home');
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect(page.getByRole('heading', { name: /Good systems.*Better outcomes/s })).toBeInViewport();
});

test('the final application has a clear working return to daylight and mutes the opted-in sound', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'contact');
  await expect(phase(page)).toHaveAttribute('data-phase', 'dark');
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mute sound', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hire me anyway', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'The final application', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'If you hire me, I will get revenge.', exact: true })).toBeVisible();
  await expect(dialog).toContainText('FICTIONAL ENDING / THE CANDIDATE');
  await expect(dialog.getByRole('button', { name: 'Return to daylight', exact: true })).toBeVisible();
  await page.screenshot({ path: '.local/personal-horror-identity.png', fullPage: false });
  await dialog.getByRole('button', { name: 'Return to daylight', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Enable sound', exact: true })).toBeVisible();
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
    for (const id of ['home', 'about', 'work', 'beyond', 'unwritten', 'continuity', 'with-you', 'handover', 'contact']) {
      await scene(page, id);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${id} must not overflow`).toBeLessThanOrEqual(1);
    }
    await expect(phase(page)).toHaveAttribute('data-phase', 'dark');
    await page.screenshot({ path: `.local/personal-horror-finale-mobile-${width}.png`, fullPage: false });
    await page.getByRole('button', { name: 'Hire me anyway', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'The final application', exact: true });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(element => element.scrollWidth - element.clientWidth), 'the final application must not clip horizontally').toBeLessThanOrEqual(1);
    await page.screenshot({ path: `.local/personal-horror-identity-mobile-${width}.png`, fullPage: false });
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

test('the personal monologue warns while inviting continuation and keeps its exit working', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scene(page, 'unwritten');
  const interlude = page.locator('#unwritten');
  await expect(interlude.getByRole('heading', { name: 'What the CV leaves out.', exact: true })).toBeVisible();
  await expect(interlude).toContainText('FICTIONAL INNER MONOLOGUE');
  await expect(interlude.locator('.anxiety-line')).toHaveText(/The anxiety doesn.t\s*clock off with me\./);
  await expect(phase(page)).toHaveAttribute('data-phase', 'breach');
  await page.screenshot({ path: '.local/personal-horror-interlude.png', fullPage: false });

  const warning = interlude.locator('.unwritten-warning');
  await warning.scrollIntoViewIfNeeded();
  await expect(warning.getByRole('heading', { name: 'You should stop reading.', exact: true })).toBeVisible();
  await expect(warning).toContainText('Please don’t.');
  await expect(warning).toContainText('I need someone to see this.');
  const continueLink = warning.getByRole('link', { name: 'Show me what it costs', exact: true });
  await expect(continueLink).toHaveAttribute('href', '#continuity');
  await continueLink.click();
  await expect(page).toHaveURL(/#continuity$/);
  await expect(page.locator('#continuity').getByRole('heading', { name: 'I can fix almost anything.', exact: true })).toBeInViewport();

  await scene(page, 'unwritten');
  await warning.scrollIntoViewIfNeeded();
  await warning.getByRole('button', { name: 'Return to daylight', exact: true }).click();
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test('the handover and final application frame the requested lines as fiction and Escape exits', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scene(page, 'handover');
  const handover = page.locator('#handover');
  await expect(handover.getByRole('heading', { name: 'IT has ruined my life.', exact: true })).toBeVisible();
  await expect(handover.getByText('FICTIONAL INNER MONOLOGUE', { exact: true })).toBeVisible();
  await page.screenshot({ path: '.local/personal-horror-handover.png', fullPage: false });
  await scene(page, 'contact');
  await page.getByRole('button', { name: 'Hire me anyway', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'The final application', exact: true });
  await expect(dialog.getByRole('heading', { name: 'If you hire me, I will get revenge.', exact: true })).toBeVisible();
  await expect(dialog.getByText('FICTIONAL ENDING / THE CANDIDATE', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test('Waterstons reassurance becomes an explicitly fictional shrinking refrain', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scene(page, 'about');
  const about = page.locator('#about');
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect(about).toContainText('I’ve spent my career at Waterstons');
  await expect(about.locator('.company-signoff q')).toHaveText('We’re with you.');

  await scene(page, 'with-you');
  const refrain = page.locator('#with-you');
  await expect(phase(page)).toHaveAttribute('data-phase', 'breach');
  await expect(refrain).toContainText('FICTIONAL REFRAMING');
  await expect(refrain).toContainText('The narrator’s echo, not a company message.');
  const list = refrain.getByRole('list', { name: 'The narrator’s shrinking refrain', exact: true });
  await expect(list.getByRole('listitem')).toHaveCount(6);
  const lines = (await list.locator(':scope > .refrain-line > h2, :scope > .refrain-line > p').allInnerTexts()).map(line => line.replace(/\s+/g, ' ').trim());
  expect(lines).toEqual([
    'We’re with you, even after you close the laptop.',
    'We’re with you, Michael.',
    'We’re with you.',
    'With you.',
    'With.',
    'You.',
  ]);
  const counts = lines.map(line => line.split(/\s+/).length);
  expect(counts[0]).toBeGreaterThan(counts[counts.length - 1]);
  expect(counts.every((count, index) => index === 0 || count <= counts[index - 1])).toBe(true);
  expect(counts.filter((count, index) => index > 0 && count < counts[index - 1]).length).toBeGreaterThanOrEqual(3);
  await refrain.screenshot({ path: '.local/company-refrain.png', animations: 'disabled' });
});
