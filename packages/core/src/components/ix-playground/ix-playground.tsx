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
        <ix-application>
          <ix-application-header></ix-application-header>
          <ix-menu>
            <ix-menu-item label="About" icon={iconAbout}></ix-menu-item>
            <ix-menu-item label="Add" icon={iconAdd}></ix-menu-item>

            <ix-menu-about>
              <ix-menu-about-item tabKey="content-1" label="Test">
                Content1
                <ix-tab-panels>
                  <ix-tabs activeTabKey="tab-2">
                    <ix-tab-item tabKey="tab-1" label="Tab 1"></ix-tab-item>
                    <ix-tab-item tabKey="tab-2" label="Tab 2"></ix-tab-item>
                    <ix-tab-item tabKey="tab-3" label="Tab 3"></ix-tab-item>
                  </ix-tabs>
                  <ix-tab-panel tabKey="tab-1">Content 1</ix-tab-panel>
                  <ix-tab-panel tabKey="tab-2">Content 2</ix-tab-panel>
                  <ix-tab-panel tabKey="tab-3">Content 3</ix-tab-panel>
                </ix-tab-panels>
              </ix-menu-about-item>
              <ix-menu-about-item tabKey="content-2" label="Test2">
                Content2
              </ix-menu-about-item>
              <ix-menu-about-item tabKey="content-3" label="Test3">
                Content3
              </ix-menu-about-item>
            </ix-menu-about>

            <ix-menu-about-news label="Test" activeAboutTabKey="content-3" show>
              content
            </ix-menu-about-news>
          </ix-menu>
          <ix-content>
            <h2>Testing</h2>
            {/* <ix-tabs
              keyboardNavigation="manual"
              activeTabKey={this.activeTabKey}
              layout="auto"
              onTabChange={(event) => this.onTabChange(event)}
              onSelectedChange={(event) => console.log(event.detail)}
            >
              <ix-tab-item tabKey="tab-1" label="Tab 1"></ix-tab-item>
              <ix-tab-item tabKey="tab-2" label="Tab 2"></ix-tab-item>
              <ix-tab-item tabKey="tab-3" label="Tab 3"></ix-tab-item>
              <ix-tab-item
                tabKey="tab-4"
                label="Tab 4"
                icon="star"
                closable
                counter={12}
                onTabClose={(event) => event.target.remove()}
              ></ix-tab-item>
              <ix-tab-item tabKey="tab-5" label="Tab 5"></ix-tab-item>
              <ix-tab-item tabKey="tab-6" label="Tab 6"></ix-tab-item>
            </ix-tabs>

            <ix-tabs activeTabKey={this.activeTabKey}>
              <ix-tab-item icon={iconAbout} tabKey="tab-1"></ix-tab-item>
              <ix-tab-item icon={iconAdd} tabKey="tab-2"></ix-tab-item>
              <ix-tab-item icon={iconAdd} tabKey="tab-3"></ix-tab-item>
              <ix-tab-item
                tabKey="tab-4"
                icon="star"
                closable
                counter={12}
                onTabClose={(event) => event.target.remove()}
              ></ix-tab-item>
              <ix-tab-item icon={iconAdd} tabKey="tab-5"></ix-tab-item>
              <ix-tab-item icon={iconAdd} tabKey="tab-6"></ix-tab-item>
            </ix-tabs> */}

            {/* <ix-tab-panels>
              <ix-tabs activeTabKey="tab-2">
                <ix-tab-item tabKey="tab-1" label="Tab 1"></ix-tab-item>
                <ix-tab-item tabKey="tab-2" label="Tab 2"></ix-tab-item>
                <ix-tab-item tabKey="tab-3" label="Tab 3"></ix-tab-item>
              </ix-tabs>
              <ix-tab-panel tabKey="tab-1">Content 1</ix-tab-panel>
              <ix-tab-panel tabKey="tab-2">Content 2</ix-tab-panel>
              <ix-tab-panel tabKey="tab-3">Content 3</ix-tab-panel>
            </ix-tab-panels> */}
          </ix-content>
        </ix-application>
      </Host>
    );
  }
}
