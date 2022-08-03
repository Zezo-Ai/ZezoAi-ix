/*
 * COPYRIGHT (c) Siemens AG 2018-2022 ALL RIGHTS RESERVED.
 */
import { expect } from '@playwright/test';
import { regressionTest } from '@utils/test';

regressionTest.describe('application header: basic', () => {
  regressionTest('should not have visual regressions', async ({ page }) => {
    await page.goto(`application-header/test/basic`);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot();
  });
});
