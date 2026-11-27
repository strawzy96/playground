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
    for (const id of ['home', 'about', 'work', 'beyond', 'unwritten', 'continuity', 'with-you', 'united', 'handover', 'contact']) {
      await scene(page, id);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${id} must not overflow`).toBeLessThanOrEqual(1);
      if (id === 'united') {
        await page.locator('#united .united-evidence').screenshot({ path: `.local/united-facts-mobile-${width}.png`, animations: 'disabled' });
        const dalot = page.locator('#united [data-player="Diogo Dalot"]');
        expect(await dalot.evaluate(element => element.scrollWidth - element.clientWidth), 'the featured Dalot note must fit').toBeLessThanOrEqual(1);
      }
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

test('United fandom develops into a dated factual snapshot with distinct Dalot-first certificate satire', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scene(page, 'beyond');
  await expect(page.locator('#beyond .interest-grid')).toContainText('Manchester United. A bit of darts.');

  await scene(page, 'united');
  const united = page.locator('#united');
  await expect(phase(page)).toHaveAttribute('data-phase', 'breach');
  await expect(united.getByRole('heading', { name: 'The final straw wore red.', exact: true })).toBeVisible();
  await expect(united).toContainText('FICTIONAL PERSONAL HORROR');
  const evidence = united.locator('.united-evidence');
  await expect(evidence).toContainText('FACTUAL SNAPSHOT / 2026/27 Premier League');
  await expect(evidence.locator('.united-coverage')).toContainText('Snapshot: 27 November 2026');
  await expect(evidence.locator('.united-coverage')).toContainText('Gameweek 11 complete · league results through 23 November');
  const facts = await evidence.locator('.united-stat-grid > div').evaluateAll(rows => Object.fromEntries(rows.map(row => [row.querySelector('dt')?.textContent, row.querySelector('dd')?.textContent])));
  expect(facts).toEqual({
    'LEAGUE POSITION': '19th',
    'WINS / MATCHES': '1 / 11',
    'POINTS / POSSIBLE': '8 / 33',
    'GOALS CONCEDED': '23',
    'CLEAN SHEETS': '0',
    'GAMES WITHOUT A WIN': '9',
  });
  const results = evidence.getByRole('region', { name: 'Verified match results', exact: true }).getByRole('listitem');
  await expect(results).toHaveCount(4);
  await expect(results.last()).toContainText('22 Nov 2026');
  await expect(results.last()).toContainText('Liverpool – Manchester United');
  await expect(results.last()).toContainText('4–0');
  await expect(evidence.locator('.united-source-note')).toContainText('assists use FPL’s definition');
  await expect(evidence.locator('.united-source-note')).toContainText('fixed snapshot, not a live table');
  await expect(evidence.getByRole('link', { name: 'Results snapshot', exact: true })).toHaveAttribute('href', 'https://raw.githubusercontent.com/nr-jp/fpl-mirror/b81b2e0819357c1b4f8f5a879f221881a9701e16/data/latest/fixtures.json');
  await expect(evidence.getByRole('link', { name: 'Player & team snapshot', exact: true })).toHaveAttribute('href', 'https://raw.githubusercontent.com/nr-jp/fpl-mirror/b81b2e0819357c1b4f8f5a879f221881a9701e16/data/latest/bootstrap-static.json');
  await expect(evidence.getByRole('link', { name: 'Independent dated FPL cache', exact: true })).toHaveAttribute('href', /\/cache\/2026\/11\/27\/0755\.json\.xz$/);
  for (const link of await evidence.getByRole('link').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await evidence.screenshot({ path: '.local/united-facts.png', animations: 'disabled' });

  await expect(united.locator('.united-margin-note')).toContainText('The following match notes belong to the fictional narrator.');
  await expect(united.locator('.united-notes-title')).toContainText('FICTIONAL MATCH NOTES / FOOTBALL SATIRE');
  const firstPlayer = united.locator('.united-player-note').first();
  await expect(firstPlayer).toHaveAttribute('data-player', 'Diogo Dalot');
  await expect(firstPlayer.getByRole('heading', { name: 'Diogo Dalot', exact: true })).toBeVisible();
  await expect(firstPlayer.locator('.united-certificate')).toHaveText('HOSTNAME MISMATCH / DALOT.EXPIRED');
  await expect(firstPlayer.locator('.united-player-stat')).toHaveText('Recorded: 802 league minutes · 9 starts · 0 goals · 0 FPL assists');
  await expect(firstPlayer.locator('.united-player-monologue')).toContainText('OCSP responder');
  await expect(firstPlayer.locator('.united-player-monologue')).toContainText('change request against a right-back');
  await firstPlayer.screenshot({ path: '.local/united-dalot.png', animations: 'disabled' });
});

test('the United spiral warns, continues to the handover and offers a working way out', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scene(page, 'united');
  const warning = page.locator('#united .united-warning');
  await warning.scrollIntoViewIfNeeded();
  await expect(warning).toContainText('DO NOT REFRESH THE TABLE.');
  await expect(warning).toContainText('Just check it once more.');
  const continuation = warning.getByRole('link', { name: 'Just check the score once more', exact: true });
  await expect(continuation).toHaveAttribute('href', '#handover');
  await continuation.click();
  await expect(page).toHaveURL(/#handover$/);
  await expect(page.locator('#handover').getByRole('heading', { name: 'IT has ruined my life.', exact: true })).toBeInViewport();
  await scene(page, 'united');
  await warning.getByRole('button', { name: 'Return to daylight', exact: true }).click();
  await expect(phase(page)).toHaveAttribute('data-phase', 'normal');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});
