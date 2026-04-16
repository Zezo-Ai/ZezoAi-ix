/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-example',
  template: `
    <div class="tabs">
      <ix-tab-panels>
        <ix-tabs
          [activeTabKey]="activeTabKey"
          layout="auto"
          (tabChange)="activeTabKey = $event.detail ?? 'tab-1'"
        >
          <ix-tab-item tabKey="tab-1" label="Tab 1"></ix-tab-item>
          <ix-tab-item tabKey="tab-2" label="Tab 2"></ix-tab-item>
          <ix-tab-item tabKey="tab-3" label="Tab 3"></ix-tab-item>
        </ix-tabs>

        <ix-tab-panel tabKey="tab-1">Content 1</ix-tab-panel>
        <ix-tab-panel tabKey="tab-2">Content 2</ix-tab-panel>
        <ix-tab-panel tabKey="tab-3">Content 3</ix-tab-panel>
      </ix-tab-panels>
    </div>
  `,
  styleUrls: ['./tabs.css'],
})
export default class TabPanels {
  activeTabKey = 'tab-2';
}
