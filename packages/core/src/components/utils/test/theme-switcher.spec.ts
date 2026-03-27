import { newSpecPage } from '@stencil/core/testing';

type ThemeSwitcherModule = typeof import('../theme-switcher');

describe('ThemeSwitcher', () => {
  let mediaChangeListener: ((event: MediaQueryListEvent) => void) | undefined;
  let mutationCallback: MutationCallback | undefined;
  let disconnectMock: jest.Mock;

  const setComputedStyleValues = ({
    colorSchema,
    theme,
  }: {
    colorSchema?: string;
    theme?: string;
  } = {}) => {
    Object.defineProperty(document.documentElement, 'computedStyleMap', {
      configurable: true,
      value: jest.fn(() => ({
        get: jest.fn((propertyName: string) => {
          const values: Record<string, string | undefined> = {
            '--theme-color-schema': colorSchema,
            '--theme-name': theme,
          };

          const value = values[propertyName];

          return value === undefined ? undefined : { toString: () => value };
        }),
      })),
    });
  };

  const loadThemeSwitcher = async (): Promise<ThemeSwitcherModule> =>
    import('../theme-switcher');

  beforeEach(async () => {
    jest.resetModules();

    await newSpecPage({
      html: '<div></div>',
      components: [],
    });

    mediaChangeListener = undefined;
    mutationCallback = undefined;
    disconnectMock = jest.fn();

    document.documentElement.removeAttribute('data-ix-theme');
    document.documentElement.removeAttribute('data-ix-color-schema');

    setComputedStyleValues();

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      writable: true,
      value: jest.fn().mockImplementation((callback: MutationCallback) => {
        mutationCallback = callback;

        return {
          observe: jest.fn(),
          disconnect: disconnectMock,
        };
      }),
    });

    Object.defineProperty(window, 'MutationObserver', {
      configurable: true,
      writable: true,
      value: globalThis.MutationObserver,
    });

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => ({
        matches: false,
        addEventListener: jest.fn(
          (
            eventName: string,
            listener: (event: MediaQueryListEvent) => void
          ) => {
            if (eventName === 'change') {
              mediaChangeListener = listener;
            }
          }
        ),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it('returns the explicit color schema from the dataset', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    document.documentElement.dataset.ixColorSchema = 'dark';

    expect(themeSwitcher.getMode()).toBe('dark');
  });

  it('falls back to the computed style color schema when no dataset value is set', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    setComputedStyleValues({ colorSchema: 'light' });

    expect(themeSwitcher.getMode()).toBe('light');
  });

  it('falls back to the system appearance when no explicit or computed color schema exists', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => ({
        matches: true,
        addEventListener: jest.fn(
          (
            eventName: string,
            listener: (event: MediaQueryListEvent) => void
          ) => {
            if (eventName === 'change') {
              mediaChangeListener = listener;
            }
          }
        ),
        removeEventListener: jest.fn(),
      })),
    });

    const { themeSwitcher } = await loadThemeSwitcher();

    expect(themeSwitcher.getMode()).toBe('dark');
  });

  it('returns the explicit theme from the dataset', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    document.documentElement.dataset.ixTheme = 'classic';

    expect(themeSwitcher.getTheme()).toBe('classic');
  });

  it('falls back to the computed style theme when no dataset value is set', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    setComputedStyleValues({ theme: 'brand' });

    expect(themeSwitcher.getTheme()).toBe('brand');
  });

  it('sets theme and color schema when both values are provided', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    themeSwitcher.setTheme('classic', 'dark');

    expect(document.documentElement.dataset.ixTheme).toBe('classic');
    expect(document.documentElement.dataset.ixColorSchema).toBe('dark');
  });

  it('reuses the current mode when setting a theme without an explicit color schema', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    setComputedStyleValues({ colorSchema: 'light' });

    themeSwitcher.setTheme('classic');

    expect(document.documentElement.dataset.ixTheme).toBe('classic');
    expect(document.documentElement.dataset.ixColorSchema).toBe('light');
  });

  it('toggles between explicit light and dark color schemas', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    document.documentElement.dataset.ixColorSchema = 'dark';
    themeSwitcher.toggleMode();
    expect(document.documentElement.dataset.ixColorSchema).toBe('light');

    themeSwitcher.toggleMode();
    expect(document.documentElement.dataset.ixColorSchema).toBe('dark');
  });

  it('sets dark as the first toggled mode when no color schema is present', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    themeSwitcher.toggleMode();

    expect(document.documentElement.dataset.ixColorSchema).toBe('dark');
  });

  it('sets the system-derived color schema by default', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => ({
        matches: true,
        addEventListener: jest.fn(
          (
            eventName: string,
            listener: (event: MediaQueryListEvent) => void
          ) => {
            if (eventName === 'change') {
              mediaChangeListener = listener;
            }
          }
        ),
        removeEventListener: jest.fn(),
      })),
    });

    const { themeSwitcher } = await loadThemeSwitcher();

    themeSwitcher.setColorSchema();

    expect(document.documentElement.dataset.ixColorSchema).toBe('dark');
  });

  it('emits theme changes for attribute mutations', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();
    const listener = jest.fn();

    themeSwitcher.themeChanged.on(listener);

    document.documentElement.dataset.ixTheme = 'classic';
    document.documentElement.dataset.ixColorSchema = 'dark';

    mutationCallback?.(
      [
        {
          addedNodes: [] as unknown as NodeList,
          type: 'attributes',
          attributeName: 'data-ix-color-schema',
          attributeNamespace: null,
          nextSibling: null,
          oldValue: null,
          previousSibling: null,
          removedNodes: [] as unknown as NodeList,
          target: document.documentElement,
        } as unknown as MutationRecord,
      ],
      {} as MutationObserver
    );

    expect(listener).toHaveBeenLastCalledWith({
      theme: 'classic',
      colorSchema: 'dark',
      isMediaChange: false,
    });
  });

  it('emits theme changes for system appearance updates', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();
    const listener = jest.fn();

    document.documentElement.dataset.ixTheme = 'classic';
    document.documentElement.dataset.ixColorSchema = 'dark';

    themeSwitcher.themeChanged.on(listener);
    mediaChangeListener?.({ matches: true } as MediaQueryListEvent);

    expect(listener).toHaveBeenCalledWith({
      theme: 'classic',
      colorSchema: 'dark',
      isMediaChange: true,
    });
  });

  it('disconnects the mutation observer on destroy', async () => {
    const { themeSwitcher } = await loadThemeSwitcher();

    themeSwitcher.destroy();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
