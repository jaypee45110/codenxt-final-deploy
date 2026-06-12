import { expect, test } from '@playwright/test';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';
const FRONTEND_BASE = 'https://codepod.codenxt.global';

test('production codePod GoldXtra proof and partner handout flow', async ({ page, request }) => {
  const suffix = Date.now().toString(36).toUpperCase();
  const eventCode = `CPODPROD${suffix}`;
  const scanId = `prod-goldxtra-${suffix}`;

  const partnerReward = {
    active: true,
    rewardType: 'partner_reward',
    tier: 'gold',
    displayTier: 'GoldXtra',
    partnerName: 'Production E2E Partner',
    title: 'Production E2E Reward',
    quantity: 1,
    redemptionLocation: 'Production E2E Desk',
    redemptionDeadline: '2026-07-01',
    redemptionInstructions: 'Show this proof to confirm handout.',
  };

  const createResponse = await request.post(`${API_BASE}/event`, {
    data: {
      vertical: 'codepod',
      code: eventCode,
      name: 'codePod production GoldXtra E2E',
      startAt: new Date(Date.now() - 120_000).toISOString(),
      unlockAt: new Date(Date.now() - 60_000).toISOString(),
      endAt: new Date(Date.now() + 86_400_000).toISOString(),
      maxClaims: 300,
      status: 'active',
      partnerReward,
    },
  });
  expect(createResponse.ok()).toBeTruthy();

  console.log(`eventCode=${eventCode}`);

  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    { key: `codenxt_scan_id_${eventCode}`, value: scanId },
  );

  const scanPromise = page.waitForResponse((response) => (
    response.url() === `${API_BASE}/scan` &&
    response.request().method() === 'POST'
  ));

  await page.goto(`${FRONTEND_BASE}/join/${eventCode}?lang=en`);
  const scanResponse = await scanPromise;
  const scanData = await scanResponse.json();

  expect(scanData.displayTier).toBe('GoldXtra');
  expect(scanData.rewardType).toBe('partner_reward');
  expect(scanData.partnerReward?.redemptionToken).toMatch(/^GX-/);

  const token = scanData.partnerReward.redemptionToken as string;
  console.log(`token=${token}`);

  await expect(page.getByRole('heading', { name: 'You won GoldXtra' })).toBeVisible();
  await expect(page.getByText(partnerReward.title)).toBeVisible();
  await expect(page.getByText(partnerReward.partnerName)).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download GoldXtra proof' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`GoldXtra-${token}.pdf`);

  await page.goto(`${FRONTEND_BASE}/redemption/${token}`);
  await expect(page.getByRole('heading', { name: 'Gyldig GoldXtra' })).toBeVisible();
  await expect(page.getByText(partnerReward.title)).toBeVisible();
  await expect(page.getByText(partnerReward.partnerName)).toBeVisible();

  await page.getByRole('button', { name: 'Premie utdelt' }).click();
  await expect(page.getByRole('heading', { name: 'Premie innløst' })).toBeVisible();

  await page.goto(`${FRONTEND_BASE}/redemption/${token}`);
  await expect(page.getByRole('heading', { name: 'Allerede innløst' })).toBeVisible();

  const validationResponse = await request.get(`${API_BASE}/redemption/${token}`);
  expect(validationResponse.ok()).toBeTruthy();
  const validation = await validationResponse.json();
  expect(validation.status).toBe('redeemed');
});
