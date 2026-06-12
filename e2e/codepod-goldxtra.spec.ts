import { expect, test } from '@playwright/test';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

test('codePod GoldXtra assignment, proof download, validation, and exhaustion', async ({ page, request }) => {
  const suffix = Date.now().toString(36).toUpperCase();
  const eventCode = `CPODGX${suffix}`;
  const scanId = `e2e-goldxtra-${suffix}`;

  const partnerReward = {
    active: true,
    rewardType: 'partner_reward',
    tier: 'gold',
    displayTier: 'GoldXtra',
    partnerName: 'E2E Partner',
    title: 'E2E Reward',
    quantity: 1,
    redemptionLocation: 'E2E Desk',
    redemptionDeadline: '2026-07-01',
    redemptionInstructions: 'Show this proof at the E2E desk.',
  };

  const createResponse = await request.post(`${API_BASE}/event`, {
    data: {
      vertical: 'codepod',
      code: eventCode,
      name: 'codePod GoldXtra E2E',
      startAt: new Date().toISOString(),
      unlockAt: new Date(Date.now() - 60_000).toISOString(),
      endAt: new Date(Date.now() + 86_400_000).toISOString(),
      maxClaims: 300,
      status: 'active',
      partnerReward,
    },
  });
  expect(createResponse.ok()).toBeTruthy();

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

  await page.goto(`/join/${eventCode}?lang=en`);
  const scanResponse = await scanPromise;
  const scanData = await scanResponse.json();

  expect(scanData.tier).toBe('gold');
  expect(scanData.displayTier).toBe('GoldXtra');
  expect(scanData.rewardType).toBe('partner_reward');
  expect(scanData.partnerReward?.redemptionToken).toMatch(/^GX-/);

  const token = scanData.partnerReward.redemptionToken as string;

  await expect(page.getByRole('heading', { name: 'You won GoldXtra' })).toBeVisible();
  await expect(page.getByText('E2E Reward')).toBeVisible();
  await expect(page.getByText('E2E Partner')).toBeVisible();
  await expect(page.getByText('E2E Desk', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download GoldXtra proof' })).toBeEnabled();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download GoldXtra proof' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`GoldXtra-${token}.pdf`);

  await page.goto(`/redemption/${token}`);
  await expect(page.getByRole('heading', { name: 'Gyldig GoldXtra' })).toBeVisible();
  await expect(page.getByText('E2E Reward')).toBeVisible();
  await expect(page.getByText('E2E Partner')).toBeVisible();
  await page.getByRole('button', { name: 'Premie utdelt' }).click();
  await expect(page.getByRole('heading', { name: 'Premie innløst' })).toBeVisible();

  await page.goto(`/redemption/${token}`);
  await expect(page.getByRole('heading', { name: 'Allerede innløst' })).toBeVisible();

  const secondScanResponse = await request.post(`${API_BASE}/scan`, {
    data: {
      vertical: 'codepod',
      eventCode,
      scanId: `${scanId}-second`,
    },
  });
  expect(secondScanResponse.ok()).toBeTruthy();
  const secondScan = await secondScanResponse.json();
  expect(secondScan.tier).toBe('gold');
  expect(secondScan.displayTier).not.toBe('GoldXtra');
  expect(secondScan.rewardType).not.toBe('partner_reward');
  expect(secondScan.partnerReward?.redemptionToken).toBeFalsy();
});
