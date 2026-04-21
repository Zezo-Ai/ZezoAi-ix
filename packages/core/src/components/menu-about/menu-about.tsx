/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iconClose } from '@siemens/ix-icons/icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core';
import { CustomCloseEvent } from '../utils/menu-tabs/menu-tabs-utils';

@Component({
  tag: 'ix-menu-about',
  styleUrl: 'menu-about.scss',
  shadow: true,
})
export class MenuAbout {
  @Element() hostElement!: HTMLIxMenuAboutElement;

  /**
   * Active tab
   *
   * @since 5.0.0
   */
  @Prop({ mutable: true }) activeTabKey?: string;

  /**
   * Content of the header
   */
  @Prop() label = 'About & legal information';

  /**
   * Aria label for close button
   */
  @Prop() ariaLabelCloseButton = 'Close About';

  /** @internal */
  @Prop() show = false;

  /**
   * Active tab changed
   * @since 3.0.0
   */
  @Event() tabChange!: EventEmitter<string>;

  /**
   * About and Legal closed
   */
  @Event() close!: EventEmitter<CustomCloseEvent>;

  private itemsObserver?: MutationObserver;

  private get items() {
    return Array.from(this.hostElement.querySelectorAll('ix-menu-about-item'));
  }

  componentWillLoad() {
    this.itemsObserver = new MutationObserver(() => this.onItemsChange());

    this.itemsObserver.observe(this.hostElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['label'],
    });
    this.onItemsChange();
  }

  disconnectedCallback() {
    this.itemsObserver?.disconnect();
  }

  private onItemsChange() {
    if (this.activeTabKey === undefined && this.items.length > 0) {
      this.activeTabKey = this.items[0].tabKey;
    }
  }

  @Listen('labelChange')
  handleLabelChange() {
    forceUpdate(this);
  }

  render() {
    return (
      <Host
        slot={'ix-menu-about'}
        class={{
          show: this.show,
        }}
      >
        <div class={'about-header'}>
          <h2 class="text-h2">{this.label}</h2>
          <ix-icon-button
            variant="tertiary"
            size="24"
            icon={iconClose}
            iconColor="color-soft-text"
            aria-label={this.ariaLabelCloseButton}
            onClick={(e) =>
              this.close.emit({
                name: 'ix-menu-about',
                nativeEvent: e,
              })
            }
          ></ix-icon-button>
        </div>
        <ix-tab-panels>
          <ix-tabs activeTabKey={this.activeTabKey}>
            {this.items.map(({ label, tabKey }) => (
              <ix-tab-item
                tabKey={tabKey}
                selected={tabKey === this.activeTabKey}
                label={label}
              ></ix-tab-item>
            ))}
          </ix-tabs>
          <slot></slot>
        </ix-tab-panels>
      </Host>
    );
  }
}
