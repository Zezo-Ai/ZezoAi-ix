/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from '@playwright/test';
import {
  getFormValue,
  preventFormSubmission,
  regressionTest,
} from '@utils/test';

regressionTest('renders', async ({ mount, page }) => {
  await mount(`<ix-toggle></ix-toggle>`);
  const drawer = page.locator('ix-toggle');
  await expect(drawer).toHaveClass(/hydrated/);
  await expect(drawer).toBeVisible();
});

regressionTest('should toggle', async ({ mount, page }) => {
  await mount(`<ix-toggle></ix-toggle>`);
  const toggle = page.locator('ix-toggle');
  await expect(toggle).toHaveClass(/hydrated/);
  await toggle.click();

  await expect(toggle).toHaveJSProperty('checked', true);
});

regressionTest(
  'should not toggle - default prevented',
  async ({ mount, page }) => {
    await mount(`<ix-toggle></ix-toggle>`);
    const toggle = page.locator('ix-toggle');

    await toggle.evaluate((t) => {
      t.addEventListener('checkedChange', (e) => {
        e.preventDefault();
      });
    });

    await expect(toggle).toHaveClass(/hydrated/);

    await toggle.click();

    await expect(toggle).toHaveJSProperty('checked', false);
  }
);

regressionTest('should not toggle if disabled', async ({ mount, page }) => {
  await mount(`<ix-toggle disabled></ix-toggle>`);
  const toggle = page.locator('ix-toggle');
  await expect(toggle).toHaveClass(/hydrated/);
  await toggle.click({
    force: true,
  });

  await expect(toggle).toHaveJSProperty('checked', false);
});

regressionTest(
  'should be toggled ON after indeterminate',
  async ({ mount, page }) => {
    await mount(`<ix-toggle indeterminate></ix-toggle>`);
    const toggle = page.locator('ix-toggle');
    await expect(toggle).toHaveClass(/hydrated/);
    await expect(toggle).toHaveJSProperty('checked', false);

    await toggle.click();

    await expect(toggle).toHaveJSProperty('checked', true);
  }
);

regressionTest(`form-ready`, async ({ mount, page }) => {
  await mount(`<form><ix-toggle name="my-field-name"></ix-toggle></form>`);

  const formElement = page.locator('form');
  preventFormSubmission(formElement);
  await page.locator('ix-toggle').click();

  const formData = await getFormValue(formElement, 'my-field-name', page);
  expect(formData).toBe('on');
});

regressionTest(`form-ready with value`, async ({ mount, page }) => {
  await mount(
    `<form><ix-toggle name="my-field-name" value="custom-value"></ix-toggle></form>`
  );

  const formElement = page.locator('form');
  preventFormSubmission(formElement);
  await page.locator('ix-toggle').click();

  const formData = await getFormValue(formElement, 'my-field-name', page);
  expect(formData).toBe('custom-value');
});

regressionTest(`form-ready default active`, async ({ mount, page }) => {
  await mount(
    `<form><ix-toggle name="my-field-name" checked></ix-toggle></form>`
  );

  const toggle = page.locator('ix-toggle');
  await expect(toggle).toHaveClass(/hydrated/);
  await expect(toggle).toHaveJSProperty('checked', true);

  const formElement = page.locator('form');
  preventFormSubmission(formElement);
  const formData = await getFormValue(formElement, 'my-field-name', page);
  expect(formData).toBe('on');
});

regressionTest(
  'should expose label via aria-label for accessible queries',
  async ({ mount, page }) => {
    await mount(
      `<ix-toggle text-on="Enabled" text-off="Disabled"></ix-toggle>`
    );
    const toggleByRole = page.getByRole('switch', { name: 'Disabled' });
    await expect(toggleByRole).toBeVisible();
  }
);

regressionTest(
  'should be directly clickable via host element with accessible query',
  async ({ mount, page }) => {
    await mount(`<ix-toggle text-on="On" text-off="Off"></ix-toggle>`);
    const host = page.locator('ix-toggle');
    const switchOff = page.getByRole('switch', { name: 'Off' });
    await expect(switchOff).toBeVisible();
    await expect(host).toHaveJSProperty('checked', false);
    await switchOff.click();
    await expect(host).toHaveJSProperty('checked', true);
    await expect(page.getByRole('switch', { name: 'On' })).toBeVisible();
  }
);

regressionTest(
  'should keep aria-label in sync with checked state for default labels',
  async ({ mount, page }) => {
    await mount(`<ix-toggle></ix-toggle>`);
    const host = page.locator('ix-toggle');
    await expect(host).toHaveAttribute('aria-label', 'Off');
    await expect(host).toHaveAttribute('aria-checked', 'false');

    await host.click();

    await expect(host).toHaveAttribute('aria-checked', 'true');
    await expect(host).toHaveAttribute('aria-label', 'On');
  }
);

regressionTest(
  'should respect disabled state when clicking via accessible query',
  async ({ mount, page }) => {
    await mount(`<ix-toggle text-on="On" text-off="Off" disabled></ix-toggle>`);
    const toggle = page.getByRole('switch', { name: 'Off' });
    await toggle.click({ force: true });
    await expect(toggle).toHaveJSProperty('checked', false);
  }
);
