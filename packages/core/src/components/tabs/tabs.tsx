/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iconMoreMenu } from '@siemens/ix-icons/icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { makeRef } from '../utils/make-ref';
import { TabClickDetail } from '../tab-item/tab-item.types';
import { emitEvent } from '../utils/event';

@Component({
  tag: 'ix-tabs',
  styleUrl: 'tabs.scss',
  shadow: true,
})
export class Tabs {
  @Element() hostElement!: HTMLIxTabsElement;

  /**
   * Set tab items to small size
   */
  @Prop() small = false;

  /**
   * Set rounded tabs
   */
  @Prop() rounded = false;

  /**
   * Set layout width style
   */
  @Prop() layout: 'auto' | 'stretched' = 'auto';

  /**
   * Set placement style
   */
  @Prop() placement: 'bottom' | 'top' = 'bottom';

  @Prop({ mutable: true }) activeTabKey?: string;

  @Event() tabChange!: EventEmitter<string | undefined>;

  /**
   * Tab selection event. Event detail is the zero-based tab index. Fires when
   * the user selects a tab, or when the tab list changes and the selected index
   * is adjusted. Not emitted when `selected` is set from outside.
   *
   * @deprecated Since 5.0.0
   */
  @Event() selectedChange!: EventEmitter<number>;

  @State() private isTabsOverflow = false;
  @State() private overflowMenuItems: {
    tabKey: string;
    label: string;
    icon?: string;
  }[] = [];

  private resizeObserver?: ResizeObserver;
  private itemsObserver?: MutationObserver;

  private readonly tabsRef = makeRef<HTMLDivElement>();

  private get tabs() {
    return Array.from(this.hostElement.querySelectorAll('ix-tab-item'));
  }

  componentDidLoad() {
    this.itemsObserver = new MutationObserver(() =>
      this.onComponentChildrenChange()
    );
    this.itemsObserver.observe(this.hostElement, {
      childList: true,
      subtree: true,
    });

    this.resizeObserver = new ResizeObserver(() => this.onComponentResize());
    this.resizeObserver.observe(this.hostElement);
  }

  componentWillLoad() {
    this.onComponentChildrenChange();
    if (this.activeTabKey) {
      this.setTabActive(this.activeTabKey);
    }
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.itemsObserver) {
      this.itemsObserver.disconnect();
    }
  }

  @Watch('activeTabKey')
  onActiveTabChange(tabKey: string | undefined) {
    this.setTabActive(tabKey);
  }

  private setTabActive(tabKey: string | undefined) {
    const tabs = this.tabs;

    if (tabKey === undefined) {
      tabs.forEach((tab) => (tab.selected = false));
      this.onComponentChildrenChange();
      this.activeTabKey = undefined;
      return;
    }

    const newTab = tabs.find((tab) => tab.tabKey === tabKey);
    if (!newTab) {
      return;
    }

    tabs.forEach((tab) => (tab.selected = false));
    newTab.selected = true;

    this.onComponentChildrenChange();
    this.activeTabKey = newTab.tabKey;

    newTab.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    return this.activeTabKey;
  }

  private onComponentChildrenChange() {
    const tabItems = this.hostElement.querySelectorAll('ix-tab-item');
    this.overflowMenuItems = Array.from(tabItems).map((item) => ({
      tabKey: item.tabKey,
      label: item.label || item.textContent || '',
      icon: item.icon,
    }));
  }

  private onComponentResize() {
    const tabContainer = this.tabsRef.current;
    if (!tabContainer) {
      return;
    }

    const isOverflowing = tabContainer.scrollWidth > tabContainer.clientWidth;
    this.isTabsOverflow = isOverflowing;
  }

  render() {
    return (
      <Host
        onTabClick={(event: CustomEvent<TabClickDetail>) => {
          if (event.defaultPrevented) {
            return;
          }

          if (event.detail.tabKey === undefined) {
            return;
          }

          emitEvent(
            () => {
              const oldKey = this.activeTabKey;
              const newKey = this.setTabActive(event.detail.tabKey!);
              return {
                new: newKey,
                old: oldKey,
              };
            },
            this.tabChange,
            (oldKey) => this.setTabActive(oldKey!)
          );
        }}
      >
        <div
          class={{
            'overflow-shadow-container': true,
            'overflow-shadow': this.isTabsOverflow,
          }}
        >
          <div role="tablist" class={'tabs'} ref={this.tabsRef}>
            <slot></slot>
          </div>
        </div>
        <ix-dropdown-button
          icon={iconMoreMenu}
          class="tabs-context-menu"
          variant="subtle-tertiary"
        >
          {this.overflowMenuItems.map((item) => (
            <ix-dropdown-item
              key={item.tabKey}
              checked={item.tabKey === this.activeTabKey}
              icon={item.icon}
              label={item.label}
              onClick={() => (this.activeTabKey = item.tabKey)}
            ></ix-dropdown-item>
          ))}
        </ix-dropdown-button>
      </Host>
    );
  }
}
