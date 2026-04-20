/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { iconAbout, iconAdd } from '@siemens/ix-icons/icons';
import { Component, Host, State, h } from '@stencil/core';

@Component({
  tag: 'ix-playground',
  styleUrl: 'ix-playground.scss',
  shadow: false,
})
export class IxPlayground {
  @State() activeTabKey?: string = 'tab-4';

  connectedCallback() {
    // themeSwitcher.setColorSchema('light');
  }

  private onTabChange(event: CustomEvent<string | undefined>) {
    console.log('Tab changed', event.detail);
    this.activeTabKey = event.detail;
  }

  render() {
    return (
      <Host>
        <ix-tab-panels>
          <ix-tabs
            activeTabKey={this.activeTabKey}
            onTabChange={(event) => this.onTabChange(event)}
          >
            <ix-tab-item icon={iconAbout} tabKey="tab-1">
              Tab Item 1
            </ix-tab-item>
            <ix-tab-item icon={iconAdd} tabKey="tab-2">
              Tab Item 2
            </ix-tab-item>
            <ix-tab-item icon={iconAdd} tabKey="tab-3">
              Tab Item 3
            </ix-tab-item>
            <ix-tab-item
              tabKey="tab-4"
              icon="star"
              closable
              counter={12}
              onTabClose={(event) => event.target.remove()}
            >
              Item 4
            </ix-tab-item>
            <ix-tab-item icon={iconAdd} tabKey="tab-5">
              Tab Item 5
            </ix-tab-item>
            <ix-tab-item icon={iconAdd} tabKey="tab-6">
              Tab Item 6
            </ix-tab-item>
          </ix-tabs>

          <ix-tab-panel tabKey="tab-1">Content 1</ix-tab-panel>
          <ix-tab-panel tabKey="tab-2">Content 2</ix-tab-panel>
          <ix-tab-panel tabKey="tab-3">Content 3</ix-tab-panel>
          <ix-tab-panel tabKey="tab-4">Content 4</ix-tab-panel>
          <ix-tab-panel tabKey="tab-5">Content 5</ix-tab-panel>
          <ix-tab-panel tabKey="tab-6">Content 6</ix-tab-panel>
        </ix-tab-panels>
      </Host>
    );
  }
}
