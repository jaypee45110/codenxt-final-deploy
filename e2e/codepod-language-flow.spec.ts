import { expect, test } from '@playwright/test';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

async function createCodePodEvent(request, prefix = 'CPODLANG') {
  const suffix = Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  const eventCode = `${prefix}${suffix}`;
  const response = await request.post(`${API_BASE}/event`, {
    data: {
      vertical: 'codepod',
      code: eventCode,
      name: `codePod language E2E ${suffix}`,
      startAt: new Date(Date.now() - 120_000).toISOString(),
      unlockAt: new Date(Date.now() - 60_000).toISOString(),
      endAt: new Date(Date.now() + 86_400_000).toISOString(),
      maxClaims: 300,
      status: 'active',
      partnerReward: { active: false },
    },
  });
  expect(response.ok()).toBeTruthy();
  return eventCode;
}

test('Scenario A: operator language propagates from Landing to Checkout to Dashboard', async ({ page }) => {
  await page.goto('/?lang=no');

  await expect(page.getByRole('link', { name: /Bestill ditt Control Center/i })).toBeVisible();
  await page.getByRole('link', { name: /Bestill ditt Control Center/i }).click();

  await expect(page.getByRole('heading', { name: 'Sett opp ditt Control Center' })).toBeVisible();

  await page.locator('input[name="customerName"]').fill('Language Operator');
  await page.locator('input[name="email"]').fill('operator@example.com');
  await page.locator('input[name="phone"]').fill('+4790000000');
  await page.locator('input[name="artistOrEvent"]').fill('Language Flow Podcast');
  await page.locator('input[name="venue"]').fill('Language Studio');
  await page.locator('input[name="city"]').fill('Oslo');
  await page.locator('input[name="audienceSize"]').fill('300');

  await page.getByRole('button', { name: 'Open Terms and Conditions' }).click();
  await page.getByRole('button', { name: 'Accept', exact: true }).click();

  await page.getByRole('button', { name: 'Open dashboard' }).click();
  await expect(page).toHaveURL(/\/dashboard\?/);
  await expect(page.getByText('Lytterlenke')).toBeVisible();
});

test('Scenario B and C: Join listener language is independent and InSide stays phone-only', async ({ browser, page, request }) => {
  const eventCode = await createCodePodEvent(request);

  await page.goto(`/dashboard?event=${eventCode}&lang=no`);
  await expect(page).toHaveURL(/lang=no/);
  await expect(page.getByText('Lytterlenke')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('codepod_lang'))).toBe('no');

  const listenerContext = await browser.newContext();
  const joinPage = await listenerContext.newPage();
  await joinPage.goto(`/join/${eventCode}?lang=en`);

  await expect(joinPage.getByText('YOU LISTENED')).toBeVisible();
  await expect(joinPage.locator('#inside-phone')).toHaveAttribute('placeholder', 'Mobile number');
  await expect(joinPage.locator('input[type="email"]')).toHaveCount(0);

  await joinPage.locator('[data-lang-code="fr"]').click();
  await expect(joinPage.getByText('VOUS AVEZ ÉCOUTÉ')).toBeVisible();
  await expect(joinPage.locator('#inside-phone')).toHaveAttribute('placeholder', 'Numéro mobile');

  await expect(page.getByText('Lytterlenke')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('codepod_lang'))).toBe('no');

  await listenerContext.close();
});

test('Scenario D: Join accepts supported lang URL parameters and unsupported values fall back safely', async ({ browser, request }) => {
  const eventCode = await createCodePodEvent(request);
  const expectedPhonePlaceholder = {
    no: 'Mobilnummer',
    en: 'Mobile number',
    de: 'Mobilnummer',
    fr: 'Numéro mobile',
    es: 'Número móvil',
  };

  for (const [lang, placeholder] of Object.entries(expectedPhonePlaceholder)) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`/join/${eventCode}?lang=${lang}`);
    await expect(page.locator('#inside-phone')).toHaveAttribute('placeholder', placeholder);
    await context.close();
  }

  const unsupportedContext = await browser.newContext();
  const unsupportedPage = await unsupportedContext.newPage();
  await unsupportedPage.goto(`/join/${eventCode}?lang=it`);
  await expect(unsupportedPage.locator('#inside-phone')).toHaveAttribute('placeholder', /Mobile number|Mobilnummer/);
  await unsupportedContext.close();
});
