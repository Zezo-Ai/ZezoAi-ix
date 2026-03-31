/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { newSpecPage } from '@stencil/core/testing';
import { Modal } from '../modal';

describe('ix-modal', () => {
  it('renders inner dialog with aria-modal true by default', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `<ix-modal></ix-modal>`,
    });
    await page.waitForChanges();

    const dialog = page.root!.shadowRoot!.querySelector('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('renders inner dialog with aria-modal false when isNonBlocking', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `<ix-modal is-non-blocking></ix-modal>`,
    });
    await page.waitForChanges();

    const dialog = page.root!.shadowRoot!.querySelector('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('false');
  });

  it('forwards aria-label from host to inner dialog', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `<ix-modal aria-label="Panel title"></ix-modal>`,
    });
    await page.waitForChanges();

    const dialog = page.root!.shadowRoot!.querySelector('dialog');
    expect(dialog?.getAttribute('aria-label')).toBe('Panel title');
    expect(page.root!.hasAttribute('aria-label')).toBe(false);
  });
});
