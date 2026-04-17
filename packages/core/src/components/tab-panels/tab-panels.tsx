/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, Element, Host, h } from '@stencil/core';
import { Context, ContextProvider, useContextProvider } from '../utils/context';
import { panelsContext } from './tab-panels.context';
import { queryElements } from '../utils/focus/focus-utilities';

/**
 * @internal
 * @since 5.0.0
 * */
@Component({
  tag: 'ix-tab-panels',
  styleUrl: 'tab-panels.scss',
  shadow: true,
})
export class TabPanels {
  @Element() hostElement!: HTMLIxTabPanelsElement;

  private get tabPanels() {
    return Array.from(
      queryElements(this.hostElement, 'ix-tab-panel')
    ) as HTMLIxTabPanelElement[];
  }

  private get tabList() {
    return this.hostElement?.querySelector('ix-tabs');
  }

  private get tabListItems() {
    return this.tabList?.querySelectorAll('ix-tab-item');
  }

  private panelsObserver?: MutationObserver;
  private contextProvider?: ContextProvider<
    Readonly<Context<{ tabs: Record<string, string> }>>
  >;

  /**
   * Will be used to map <ix-tab-item> ids to the corresponding <ix-tab-panel> for aria-controls and aria-labelledby attributes
   */
  private ariaControlIdMapping: Record<string, string> = {};

  componentWillLoad() {
    this.panelsObserver = new MutationObserver(() =>
      this.onPanelComponentsChange()
    );

    this.panelsObserver.observe(this.hostElement, {
      childList: true,
      subtree: true,
    });

    this.onPanelComponentsChange();

    this.contextProvider = useContextProvider(this.hostElement, panelsContext, {
      tabs: this.ariaControlIdMapping,
    });
  }

  componentDidLoad() {
    this.onPanelComponentsChange();
  }

  disconnectedCallback() {
    this.panelsObserver?.disconnect();
  }

  private onPanelComponentsChange() {
    this.checkPanelsVisibility();

    this.ariaControlIdMapping = {};
    this.tabListItems?.forEach((tabItem) => {
      this.ariaControlIdMapping[tabItem.tabKey] = tabItem.id;
    });
    this.contextProvider?.emit({ tabs: this.ariaControlIdMapping });
  }

  private checkPanelsVisibility() {
    const tabs = this.tabList?.querySelectorAll('ix-tab-item');
    const panels = this.tabPanels;

    if (!tabs || !panels) {
      return;
    }

    panels.forEach((panel) => {
      panel.hidden = panel.tabKey === this.tabList?.activeTabKey ? false : true;
    });
  }

  render() {
    return (
      <Host onTabChange={() => this.checkPanelsVisibility()}>
        <slot></slot>
      </Host>
    );
  }
}
