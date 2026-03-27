/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { themeSwitcher, ThemeVariant } from '@siemens/ix';

export function resolveEChartThemeName() {
  const theme = themeSwitcher.getTheme();
  let mode: ThemeVariant | undefined = themeSwitcher.getMode();

  if (mode === 'system') {
    const fallbackMode = themeSwitcher.getComputedStyleColorSchema();
    if (fallbackMode === undefined) {
      mode = 'dark';
      console.warn(
        'Unable to determine system color scheme, falling back to dark mode.'
      );
    } else {
      mode = fallbackMode.toString() as ThemeVariant;
    }
  }

  return `theme-${theme}-${mode}`;
}
