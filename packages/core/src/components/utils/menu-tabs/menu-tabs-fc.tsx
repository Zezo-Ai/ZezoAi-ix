/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iconClose } from '@siemens/ix-icons/icons';
import { FunctionalComponent, h, Host } from '@stencil/core';
import { MenuSettings } from '../../menu-settings/menu-settings';

interface MenuTabsProps {
  context: MenuSettings;
}

const getTabItems = (context: MenuSettings) => {
  return context.items.map(({ label, tabKey }) => {
    return (
      <ix-tab-item
        tabKey={tabKey}
        selected={label === context.activeTabKey}
        label={label}
      ></ix-tab-item>
    );
  });
};

export const MenuTabs: FunctionalComponent<MenuTabsProps> = ({ context }) => {
  return (
    <Host
      slot="ix-menu-settings"
      class={{
        show: context.show,
      }}
    >
      <div class="settings-header">
        <h2 class="text-h2">{context.label}</h2>
        <ix-icon-button
          variant="tertiary"
          size="24"
          icon={iconClose}
          iconColor="color-soft-text"
          aria-label={context.ariaLabelCloseButton}
          onClick={(e) =>
            context.close.emit({
              name: 'ix-menu-settings',
              nativeEvent: e,
            })
          }
        ></ix-icon-button>
      </div>
      <ix-tabs activeTabKey={context.activeTabKey}>
        {getTabItems(context)}
      </ix-tabs>
      <slot></slot>
    </Host>
  );
};
