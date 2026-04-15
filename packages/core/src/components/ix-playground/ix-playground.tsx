/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Component, Host, State, h } from '@stencil/core';
import { themeSwitcher } from '../utils/theme-switcher';

@Component({
  tag: 'ix-playground',
  styleUrl: 'ix-playground.scss',
  shadow: false,
})
export class IxPlayground {
  @State() activeTabKey?: string = 'tab-4';

  connectedCallback() {
    themeSwitcher.setColorSchema('light');
  }

  private onTabChange(event: CustomEvent<string | undefined>) {
    console.log('Tab changed', event.detail);
    this.activeTabKey = event.detail;
  }

  render() {
    return (
      <Host>
        <ix-tabs
          activeTabKey={this.activeTabKey}
          onTabChange={(event) => this.onTabChange(event)}
        >
          <ix-tab-item tabKey="tab-1">Tab 1</ix-tab-item>
          <ix-tab-item tabKey="tab-2">Tab 2</ix-tab-item>
          <ix-tab-item tabKey="tab-3">Tab 3</ix-tab-item>
          <ix-tab-item tabKey="tab-4" icon="star" closable counter={12}>
            Tab 4
          </ix-tab-item>
          <ix-tab-item tabKey="tab-5">Tab 5</ix-tab-item>
          <ix-tab-item tabKey="tab-6">Tab 6</ix-tab-item>
        </ix-tabs>
        <ix-button
          onClick={() => {
            const randomTab = `tab-${Math.floor(Math.random() * 6) + 1}`;
            this.activeTabKey = randomTab;
          }}
        >
          Random tab
        </ix-button>
      </Host>
    );
  }
}
