/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import {
  ContextConsumerSubscription,
  useContextConsumer,
} from '../utils/context';
import { panelsContext } from '../tab-panels/tab-panels.context';

/**
 * @internal
 * @since 5.0.0
 * */
@Component({
  tag: 'ix-tab-panel',
  styleUrl: 'tab-panel.scss',
  shadow: true,
})
export class TabPanel {
  @Element() hostElement!: HTMLIxTabPanelElement;

  /**
   * Key of the tab panel, has to be the same as the tabKey of the corresponding ix-tab-item
   */
  @Prop() tabKey!: string;

  @State() tabId?: string;

  private subscriber?: ContextConsumerSubscription;

  componentWillLoad() {
    this.subscriber = useContextConsumer(
      this.hostElement,
      panelsContext,
      (context) => {
        if (context.tabs[this.tabKey]) {
          this.tabId = context.tabs[this.tabKey];
        }
      },
      true
    );
  }

  disconnectedCallback() {
    this.subscriber?.unsubscribe();
  }

  render() {
    return (
      <Host role="tabpanel" aria-labelledby={this.tabId} tabindex={0}>
        <slot></slot>
      </Host>
    );
  }
}
