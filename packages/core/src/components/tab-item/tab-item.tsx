/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iconClose } from '@siemens/ix-icons/icons';
import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import type { TabClickDetail } from './tab-item.types';

@Component({
  tag: 'ix-tab-item',
  styleUrl: 'tab-item.scss',
  shadow: true,
})
export class TabItem {
  /**
   * Set selected tab
   */
  @Prop() selected = false;

  /**
   * Set disabled tab
   */
  @Prop() disabled = false;

  /**
   * Set small size tab
   */
  @Prop() small = false;

  /**
   * Set icon of the tab
   *
   * @since 5.0.0
   */
  @Prop() icon?: string;

  /**
   * Set rounded tab
   */
  @Prop() rounded = false;

  /**
   * Set counter value
   */
  @Prop() counter?: number;

  /**
   * Set selected placement
   */
  @Prop() placement: 'bottom' | 'top' = 'bottom';

  /**
   * If the tab can be closed
   *
   * @since 5.0.0
   */
  @Prop() closable = false;

  /**
   * Tab label
   *
   * @since 5.0.0
   */
  @Prop() label?: string;

  /**
   * Key of the tab, used for identifying the tab in events
   *
   * @since 5.0.0
   */
  @Prop({ reflect: true }) tabKey!: string;

  /**
   * Emitted when the tab is clicked.
   */
  @Event() tabClick!: EventEmitter<TabClickDetail>;

  private tabItemClasses(props: {
    selected: boolean;
    disabled: boolean;
    small: boolean;
    icon: boolean;
    circle: boolean;
    placement: 'bottom' | 'top';
  }) {
    return {
      selected: props.selected,
      disabled: props.disabled,
      'small-tab': props.small,
      icon: props.small,
      bottom: props.placement === 'bottom',
      top: props.placement === 'top',
      circle: props.circle,
    };
  }

  render() {
    return (
      <Host
        role="tab"
        class={this.tabItemClasses({
          selected: this.selected,
          disabled: this.disabled,
          small: this.small,
          icon: false,
          placement: this.placement,
          circle: this.rounded,
        })}
        tabIndex={0}
        onClick={(event: MouseEvent) => {
          if (event.defaultPrevented) return;

          const clientEvent = this.tabClick.emit({
            tabKey: this.tabKey,
            nativeEvent: event,
          });

          if (clientEvent.defaultPrevented) {
            event.stopPropagation();
          }
        }}
      >
        {this.icon && !this.rounded && (
          <ix-icon name={this.icon} size="16" class={'tab-icon'}></ix-icon>
        )}
        <div
          class={{
            circle: this.rounded,
            text: !this.rounded,
            selected: this.selected,
            disabled: this.disabled,
          }}
        >
          {this.icon && this.rounded && (
            <ix-icon name={this.icon} size="16"></ix-icon>
          )}
          {this.label}

          <slot></slot>
        </div>
        <div
          class={{
            counter: true,
            selected: this.selected,
            hidden: !(this.rounded && this.counter !== undefined),
            disabled: this.disabled,
          }}
        >
          {this.counter}
        </div>
        {this.counter && (
          <ix-pill variant="primary" outline class={'tab-counter'}>
            {this.counter}
          </ix-pill>
        )}
        {this.closable && (
          <ix-icon-button
            class={'close-tab'}
            size="12"
            variant="subtle-tertiary"
            icon={iconClose}
          ></ix-icon-button>
        )}
      </Host>
    );
  }
}
