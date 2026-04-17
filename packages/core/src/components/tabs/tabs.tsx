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
  Mixin,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { makeRef } from '../utils/make-ref';
import { TabClickDetail } from '../tab-item/tab-item.types';
import { emitEvent } from '../utils/event';
import { hasKeyboardMode } from '../utils/internal/mixins/setup.mixin';
import { DefaultMixins } from '../utils/internal/component';
import { InheritAriaAttributesMixin } from '../utils/internal/mixins/accessibility/inherit-aria-attributes.mixin';

@Component({
  tag: 'ix-tabs',
  styleUrl: 'tabs.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class Tabs extends Mixin(...DefaultMixins, InheritAriaAttributesMixin) {
  @Element() override hostElement!: HTMLIxTabsElement;

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

  /**
   * Active tab key.
   */
  @Prop({ mutable: true }) activeTabKey?: string;

  /**
   * Keyboard interaction behavior:
   * automation:  A tabs widget where tabs are automatically activated and their panel is displayed when they receive focus.
   * manual: A tabs widget where users activate a tab and display its panel by pressing Space or Enter.
   *
   * @since 5.0.0
   */
  @Prop() keyboardNavigation: 'automatic' | 'manual' = 'automatic';

  /**
   * Tab selection event. Event detail contains the new active tab key.
   *
   * @since 5.0.0
   */
  @Event() tabChange!: EventEmitter<string | undefined>;

  /**
   * Tab close event. Event detail contains the closed tab key.
   *
   * @since 5.0.0
   */
  @Event() tabClose!: EventEmitter<string | undefined>;

  /**
   * Tab selection event. Event detail is the zero-based tab index. Fires when
   * the user selects a tab, or when the tab list changes and the selected index
   * is adjusted. Not emitted when `selected` is set from outside.
   *
   * @deprecated Since 5.0.0 use tabChange event instead which provides the tabKey in the event detail.
   */
  @Event() selectedChange!: EventEmitter<number>;

  @State() private isTabsOverflow = false;
  @State() private activeIndicatorOffset = 0;
  @State() private activeIndicatorWidth = 0;
  @State() private overflowMenuItems: {
    tabKey: string;
    label: string;
    icon?: string;
    disabled?: boolean;
  }[] = [];

  private resizeObserver?: ResizeObserver;
  private itemsObserver?: MutationObserver;
  private measureFrame?: number;

  private readonly tabsContainerRef = makeRef<HTMLDivElement>();
  private readonly tabsRef = makeRef<HTMLDivElement>();

  private get tabs() {
    return Array.from(this.hostElement.querySelectorAll('ix-tab-item'));
  }

  override componentDidLoad() {
    this.itemsObserver = new MutationObserver(() =>
      this.onComponentChildrenChange()
    );
    this.itemsObserver.observe(this.hostElement, {
      childList: true,
      subtree: true,
    });

    this.resizeObserver = new ResizeObserver(() => this.scheduleMeasurements());
    this.resizeObserver.observe(this.hostElement);

    this.scheduleMeasurements();
  }

  override componentWillLoad() {
    this.onComponentChildrenChange();
    if (this.activeTabKey) {
      this.setTabActive(this.activeTabKey);
    }
  }

  override disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.itemsObserver) {
      this.itemsObserver.disconnect();
    }
    if (this.measureFrame !== undefined) {
      cancelAnimationFrame(this.measureFrame);
    }
  }

  @Watch('activeTabKey')
  onActiveTabChange(tabKey: string | undefined) {
    this.emitTabChangeEvent(tabKey);
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
    this.updateActiveIndicator();

    newTab.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    return this.activeTabKey;
  }

  private onComponentChildrenChange() {
    const tabItems = this.tabs;

    tabItems.forEach((tab) => {
      const propertiesToInherit = {
        layout: this.layout,
        small: this.small,
        rounded: this.rounded,
        placement: this.placement,
        iconOnly: tabItems.every((t) => !t.label && !!t.icon),
      };

      Object.assign(tab, propertiesToInherit);
    });

    this.overflowMenuItems = Array.from(tabItems).map((item) => ({
      tabKey: item.tabKey,
      label: item.label || item.textContent || '',
      icon: item.icon,
      disabled: item.disabled,
    }));

    this.scheduleMeasurements();

    const isTabSelected = tabItems.some((tab) => tab.selected);
    if (!isTabSelected && tabItems.length > 0 && hasKeyboardMode()) {
      tabItems[0].focus();
      this.emitTabChangeEvent(tabItems[0].tabKey);
    }
  }

  private onComponentResize() {
    const tabContainer = this.tabsRef.current;
    if (!tabContainer) {
      return;
    }

    const isOverflowing = tabContainer.scrollWidth > tabContainer.clientWidth;
    this.isTabsOverflow = isOverflowing;
  }

  private getActiveTabWidth() {
    const activeTab = this.tabs.find((tab) => tab.selected);
    if (!activeTab) {
      return 0;
    }
    return activeTab.offsetWidth;
  }

  private getActiveTabOffset() {
    const activeTab = this.tabs.find((tab) => tab.selected);
    const tabsContainer = this.tabsContainerRef.current;

    if (!activeTab || !tabsContainer) {
      return 0;
    }

    const activeTabRect = activeTab.getBoundingClientRect();
    const tabsContainerRect = tabsContainer.getBoundingClientRect();

    return activeTabRect.left - tabsContainerRect.left;
  }

  private updateActiveIndicator() {
    this.activeIndicatorWidth = this.getActiveTabWidth();
    this.activeIndicatorOffset = this.getActiveTabOffset();
  }

  private scheduleMeasurements() {
    if (this.measureFrame !== undefined) {
      cancelAnimationFrame(this.measureFrame);
    }

    this.measureFrame = requestAnimationFrame(() => {
      this.measureFrame = undefined;
      this.onComponentResize();
      this.updateActiveIndicator();
    });
  }

  private onTabClick(event: CustomEvent<TabClickDetail>) {
    if (event.defaultPrevented) {
      return;
    }

    if (event.detail.tabKey === undefined) {
      return;
    }

    this.emitTabChangeEvent(event.detail.tabKey);
  }

  private emitTabChangeEvent(tabKey: string | undefined) {
    emitEvent(
      () => {
        const oldKey = this.activeTabKey;
        const newKey = this.setTabActive(tabKey);
        return {
          new: newKey,
          old: oldKey,
        };
      },
      this.tabChange,
      (oldKey) => this.setTabActive(oldKey!)
    );

    const selectedIndex = this.tabs.findIndex((tab) => tab.tabKey === tabKey);
    if (selectedIndex !== -1) {
      this.selectedChange.emit(selectedIndex);
    }
  }

  private onTabsNavigate(event: KeyboardEvent) {
    const tabs = this.tabs.filter((tab) => !tab.disabled);
    let currentIndex = tabs.findIndex((tab) => tab.selected);

    if (this.keyboardNavigation === 'manual') {
      currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    }

    const activeTab = (tab: HTMLIxTabItemElement) => {
      tab.focus();
      if (this.keyboardNavigation === 'automatic') {
        this.emitTabChangeEvent(tab.tabKey);
      }
    };

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();

      if (currentIndex === -1) {
        return;
      }
      const indexOffset = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex =
        (currentIndex + indexOffset + tabs.length) % tabs.length;

      const nextTab = tabs[nextIndex];
      activeTab(nextTab);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      activeTab(tabs[0]);
    }

    if (event.key === 'End') {
      event.preventDefault();
      activeTab(tabs[tabs.length - 1]);
    }
  }

  override render() {
    return (
      <Host
        onTabClick={(event: CustomEvent<TabClickDetail>) =>
          this.onTabClick(event)
        }
        onKeyDown={(event: KeyboardEvent) => this.onTabsNavigate(event)}
        class={{
          small: this.small,
        }}
      >
        <div
          ref={this.tabsContainerRef}
          class={{
            'tabs-container': true,
            top: this.placement === 'top',
            bottom: this.placement === 'bottom',
          }}
          style={{
            '--ix-tab-active-indicator-width': `${this.activeIndicatorWidth}px`,
            '--ix-tab-active-indicator-offset': `${this.activeIndicatorOffset}px`,
          }}
        >
          <div
            class={{
              'overflow-shadow-container': true,
              'overflow-shadow': this.isTabsOverflow,
            }}
          >
            <div
              role="tablist"
              {...this.inheritAriaAttributes}
              ref={this.tabsRef}
              class={{
                tabs: true,
              }}
              onScroll={() => this.scheduleMeasurements()}
            >
              <slot></slot>
            </div>
          </div>
          <ix-dropdown-button
            icon={iconMoreMenu}
            class={{
              'tabs-context-menu': true,
            }}
            variant="subtle-tertiary"
          >
            {this.overflowMenuItems.map((item) => (
              <ix-dropdown-item
                key={item.tabKey}
                checked={item.tabKey === this.activeTabKey}
                icon={item.icon}
                label={item.label}
                disabled={item.disabled}
                onClick={() => (this.activeTabKey = item.tabKey)}
              ></ix-dropdown-item>
            ))}
          </ix-dropdown-button>
        </div>
      </Host>
    );
  }
}
