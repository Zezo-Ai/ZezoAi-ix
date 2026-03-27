/*
 * SPDX-FileCopyrightText: 2025 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypedEvent } from './typed-event';

export type ThemeVariant = 'light' | 'dark' | 'system';

class ThemeSwitcher {
  private mutationObserver?: MutationObserver;
  readonly themeChanged = new TypedEvent<{
    theme?: string;
    colorSchema: ThemeVariant;
    isMediaChange?: boolean;
  }>();

  /**
   * Use `getMode` instead of this method to get the current color schema, as it also considers the system appearance if no explicit color schema is set.
   * @internal
   */
  public getComputedStyleColorSchema() {
    return document.documentElement
      .computedStyleMap()
      .get('--theme-color-schema');
  }

  public getComputedStyleTheme() {
    return document.documentElement.computedStyleMap().get('--theme-name');
  }

  public getMode(): ThemeVariant {
    const colorSchema = document.documentElement.dataset.ixColorSchema;

    if (!colorSchema) {
      const fallbackColorSchema = this.getComputedStyleColorSchema();
      if (fallbackColorSchema) {
        return fallbackColorSchema.toString() as ThemeVariant;
      }
    }

    if (colorSchema === 'dark' || colorSchema === 'light') {
      return colorSchema;
    }

    return getCurrentSystemAppearance();
  }

  public setTheme(themeName: string, colorSchema?: ThemeVariant) {
    document.documentElement.dataset.ixTheme = themeName;
    if (!colorSchema) {
      this.setColorSchema(this.getMode());
      return;
    }

    this.setColorSchema(colorSchema);
  }

  public toggleMode() {
    const currentColorSchema = document.documentElement.dataset.ixColorSchema;
    if (currentColorSchema) {
      document.documentElement.dataset.ixColorSchema =
        currentColorSchema === 'dark' ? 'light' : 'dark';
      return;
    }

    const newMode: ThemeVariant =
      currentColorSchema === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.ixColorSchema = newMode;
  }

  public getTheme() {
    const currentTheme = document.documentElement.dataset.ixTheme;

    if (!currentTheme) {
      const fallbackTheme = this.getComputedStyleTheme();
      if (fallbackTheme) {
        return fallbackTheme.toString();
      }
    }

    return currentTheme;
  }

  public setColorSchema(variant: ThemeVariant = getCurrentSystemAppearance()) {
    document.documentElement.dataset.ixColorSchema = variant;
  }

  public constructor() {
    if (typeof window === 'undefined' || !window.MutationObserver) {
      // SSR or unsupported environment, do nothing
      return;
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement;
          if (
            mutation.attributeName === 'data-ix-theme' ||
            mutation.attributeName === 'data-ix-color-schema'
          ) {
            this.themeChanged.emit({
              theme: target.dataset.ixTheme || '',
              colorSchema:
                (target.dataset.ixColorSchema as ThemeVariant) || 'system',
              isMediaChange: false,
            });
          }
        }
      });
    });

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        this.themeChanged.emit({
          theme: this.getTheme(),
          colorSchema: this.getMode(),
          isMediaChange: true,
        });
      });

    this.mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ix-theme', 'data-ix-color-schema'],
    });
  }

  public destroy() {
    this.mutationObserver?.disconnect();
  }
}

export const getCurrentSystemAppearance = (): ThemeVariant =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const themeSwitcher = new ThemeSwitcher();
