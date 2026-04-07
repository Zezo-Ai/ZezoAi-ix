/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, h, Host, Method, Prop, Watch } from '@stencil/core';
import { TypedEvent } from '../utils/typed-event';
import { ToastConfig } from './toast-utils';
import type { ShowToastResult } from './toast-container.types';

@Component({
  tag: 'ix-toast-container',
  styleUrl: './styles/toast-container.scss',
  shadow: true,
})
export class ToastContainer {
  /**
   */
  @Prop() containerId = 'toast-container';

  /**
   */
  @Prop() containerClass = 'toast-container';

  /**
   */
  @Prop() position: 'bottom-right' | 'top-right' = 'bottom-right';

  private readonly PREFIX_POSITION_CLASS = 'toast-container--';

  private get announcerId() {
    return `${this.containerId}-announcer`;
  }

  private getScreenReaderAnnouncement(config: ToastConfig): string | undefined {
    const messageText =
      typeof config.message === 'string'
        ? config.message
        : (config.message?.textContent ?? '');

    const announcement = [config.title ?? '', messageText]
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join('. ');

    return announcement.length > 0 ? announcement : undefined;
  }

  private createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.id = this.announcerId;
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');

    // Keep announcer in light DOM so VoiceOver reliably picks updates.
    announcer.style.position = 'fixed';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';

    document.body.appendChild(announcer);
    return announcer;
  }

  private announceForScreenReader(message?: string) {
    if (!message) {
      return;
    }

    const existingAnnouncer = document.getElementById(this.announcerId);
    if (existingAnnouncer) {
      existingAnnouncer.remove();
    }

    const announcer = this.createAnnouncer();

    window.setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }

  get hostContainer() {
    return new Promise<HTMLElement>((resolve) => {
      const interval = setInterval(() => {
        const containerElement = document.getElementById(this.containerId);
        if (containerElement) {
          clearInterval(interval);
          resolve(containerElement);
        }
      });
    });
  }

  componentDidLoad() {
    if (!document.getElementById(this.containerId)) {
      const toastContainer = document.createElement('div');
      toastContainer.id = this.containerId;
      toastContainer.classList.add(this.containerClass);
      toastContainer.classList.add(
        `${this.PREFIX_POSITION_CLASS}${this.position}`
      );
      document.body.appendChild(toastContainer);
    }
  }

  @Watch('position')
  onPositionChange(newPosition: string, oldPosition: string) {
    const toastContainer = document.getElementById(this.containerId);
    if (!toastContainer) {
      console.warn('No toast container found, cannot configure toast position');
      return;
    }
    toastContainer.classList.remove(
      `${this.PREFIX_POSITION_CLASS}${oldPosition}`
    );
    toastContainer.classList.add(`${this.PREFIX_POSITION_CLASS}${newPosition}`);
  }

  /**
   * Display a toast message
   * @param config
   */
  @Method()
  async showToast(config: ToastConfig): Promise<ShowToastResult> {
    const toast = document.createElement('ix-toast');
    const onClose = new TypedEvent<any | undefined>();

    function removeToast(result?: any) {
      toast.remove();
      onClose.emit(result);
    }

    toast.toastTitle = config.title;
    toast.type = config.type ?? 'info';
    toast.preventAutoClose = config.autoClose === false;
    toast.autoCloseDelay = config.autoCloseDelay ?? 5000;
    toast.icon = config.icon;
    toast.iconColor = config.iconColor;
    toast.hideIcon = config.hideIcon ?? false;

    const screenReaderAnnouncement = this.getScreenReaderAnnouncement(config);

    toast.addEventListener(
      'closeToast',
      (event: CustomEvent<any | undefined>) => {
        const { detail } = event;
        removeToast(detail);
      }
    );

    if (config.message) {
      if (typeof config.message === 'string') {
        toast.innerText = config.message;
      } else {
        toast.appendChild(config.message);
      }
    }

    if (config.action && config.action instanceof HTMLElement) {
      config.action.slot = 'action';
      toast.appendChild(config.action);
    }

    (await this.hostContainer).appendChild(toast);
    this.announceForScreenReader(screenReaderAnnouncement);

    return {
      onClose,
      close: (result?: any) => {
        removeToast(result);
      },
      pause: () => {
        toast.pause();
      },
      resume: () => {
        toast.resume();
      },
      isPaused: () => {
        return toast.isPaused();
      },
    };
  }

  render() {
    return (
      <Host
        class={{
          'toast-container--bottom-right': this.position === 'bottom-right',
          'toast-container--top-right': this.position === 'top-right',
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
