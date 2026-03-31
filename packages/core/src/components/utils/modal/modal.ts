/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { IxModalSize } from '../../modal/modal.types';
import { getCoreDelegate, resolveDelegate } from '../delegate';
import {
  tryFocusElement,
  tryFocusFirstDescendantDeep,
} from '../focus/focus-utilities';
import { TypedEvent } from '../typed-event';

/**
 * Set accessibility attributes on modal element
 */
export function setA11yAttributes(element: HTMLElement, config: ModalConfig) {
  const ariaDescribedby = config.ariaDescribedby;
  const ariaLabelledby = config.ariaLabelledby;

  delete config['ariaDescribedby'];
  delete config['ariaLabelledby'];

  if (ariaDescribedby) {
    element.setAttribute('aria-describedby', ariaDescribedby);
  }

  if (ariaLabelledby) {
    element.setAttribute('aria-labelledby', ariaLabelledby);
  }
}

export interface ModalConfig<TReason = any, CONTENT = any> {
  /**
   * Enable modal animation
   */
  animation?: boolean;
  /**
   * ID of element describing the modal
   */
  ariaDescribedby?: string;
  /**
   * ID of element labeling the modal
   */
  ariaLabelledby?: string;
  /**
   * Show backdrop behind modal
   */
  backdrop?: boolean;
  /**
   * Dismiss modal on backdrop click (ignored when **`isNonBlocking`** is `true`)
   */
  closeOnBackdropClick?: boolean;
  /**
   * Called before modal is dismissed
   */
  beforeDismiss?: (reason?: TReason) => boolean | Promise<boolean>;
  /**
   * Center modal vertically
   */
  centered?: boolean;
  /**
   * Non-modal dialog: page stays interactive, no lightbox or focus trap; `aria-modal` is `false`.
   * Set before calling `showModal()`; changing while open is unsupported.
   *
   * Same semantics as **`HTMLIxModalElement.isNonBlocking`**. Initial focus and Escape are handled
   * by the component; prefer **`aria-labelledby`** / **`aria-describedby`** (or **`aria-label`**) for
   * an accessible name.
   */
  isNonBlocking?: boolean;
  /**
   * Element to attach modal to
   *
   * @deprecated This has no effect anymore and will be removed with 5.0.0
   */
  container?: string | HTMLElement;
  /**
   * Modal content
   */
  content: CONTENT | string;
  /**
   * Allow closing with Escape key
   *
   * @deprecated This has no effect anymore and will be removed with 5.0.0
   */
  keyboard?: boolean;
  /**
   * Modal size
   */
  size?: IxModalSize;
  /**
   * Modal title
   *
   * @deprecated This has no effect anymore and will be removed with 5.0.0
   */
  title?: string;
}

export interface ModalInstance<TReason = any> {
  /**
   * The Modal HTML Element
   */
  htmlElement: HTMLIxModalElement;
  /**
   * Event that fires when closing the modal
   */
  onClose: TypedEvent<TReason>;
  /**
   * Event that fires when dismissing the modal
   */
  onDismiss: TypedEvent<TReason>;
}

function getIxModal(element: Element) {
  return element.closest('ix-modal');
}

/**
 * Focus order for non-modal `ix-modal` after `dialog.subtree` `[autofocus]` (usually only hits if
 * focusables are real descendants of `<dialog>`), then `modalHost` deep `[autofocus]`, header close,
 * first focusable in light/nested shadow DOM, then the `dialog` element.
 * Call after two nested `requestAnimationFrame` ticks from `ix-modal.showModal()` so
 * `:host(.visible)` and framework portals can commit slotted content before focusing.
 */
export const IX_MODAL_NON_BLOCKING_FOCUSABLE_SELECTOR =
  'ix-button, ix-icon-button, ix-toggle, ix-dropdown, ix-select, ix-input, ix-textarea, ix-checkbox, ix-radio, ix-datetime-input, ix-number-input, button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function applyIxModalNonBlockingInitialFocus(
  modalHost: HTMLIxModalElement,
  dialogElement: HTMLDialogElement | null | undefined
): void {
  if (!modalHost.isNonBlocking || !dialogElement?.open) {
    return;
  }

  const noScroll = { preventScroll: true } as const;

  if (
    tryFocusFirstDescendantDeep(
      modalHost,
      '[autofocus], [auto-focus]',
      noScroll
    )
  ) {
    return;
  }

  const closeBtn = modalHost
    .querySelector('ix-modal-header')
    ?.shadowRoot?.querySelector<HTMLElement>('ix-icon-button.modal-close');
  if (tryFocusElement(closeBtn, noScroll)) {
    return;
  }

  if (
    tryFocusFirstDescendantDeep(
      modalHost,
      IX_MODAL_NON_BLOCKING_FOCUSABLE_SELECTOR,
      noScroll
    )
  ) {
    return;
  }

  if (!dialogElement.hasAttribute('tabindex')) {
    dialogElement.setAttribute('tabindex', '-1');
  }
  tryFocusElement(dialogElement, noScroll);
}

/**
 * Close closest ix-modal relative to a provided element
 */
export function closeModal<TClose = any>(
  element: Element,
  closeResult: TClose
) {
  const dialog = getIxModal(element);
  if (dialog) {
    dialog.closeModal(closeResult);
    return;
  }
}

/**
 * Dismiss closest ix-modal relative to a provided element
 */
export function dismissModal(element: Element, dismissResult?: any) {
  const dialog = getIxModal(element);
  if (dialog) {
    dialog.dismissModal(dismissResult);
    return;
  }
}

/**
 * Show modal with given configuration
 */
export async function showModal<T>(
  config: ModalConfig<T>
): Promise<ModalInstance<T>> {
  const delegate = resolveDelegate();
  let dialogRef: HTMLIxModalElement | undefined;
  const onClose = new TypedEvent<T>();
  const onDismiss = new TypedEvent<T>();

  if (typeof config.content === 'string') {
    const dialog = document.createElement('ix-modal');
    dialog.innerText = config.content;
    dialogRef = await getCoreDelegate().attachView(dialog);
  }

  if (
    config.content instanceof HTMLElement &&
    config.content.tagName !== 'IX-MODAL'
  ) {
    const dialog = document.createElement('ix-modal');
    dialog.appendChild(config.content);
    dialogRef = await getCoreDelegate().attachView(dialog);
  }
  if (!dialogRef) {
    dialogRef = await delegate.attachView<HTMLIxModalElement>(config.content);
  }

  setA11yAttributes(dialogRef, config);
  Object.assign(dialogRef, config);

  await dialogRef.showModal();
  dialogRef.addEventListener('dialogClose', async ({ detail }: CustomEvent) => {
    onClose.emit(detail);
    await delegate.removeView(dialogRef);
  });

  dialogRef.addEventListener(
    'dialogDismiss',
    async ({ detail }: CustomEvent) => {
      onDismiss.emit(detail);
      await delegate.removeView(dialogRef);
    }
  );

  // Non-blocking: ix-modal.showModal() defers full focus via applyIxModalNonBlockingInitialFocus.
  requestAnimationFrame(() => {
    if (dialogRef.isNonBlocking) {
      return;
    }

    const autofocusElement = dialogRef.querySelector(
      '[autofocus],[auto-focus]'
    );

    if (autofocusElement) {
      (autofocusElement as HTMLIxButtonElement).focus();
    }
  });

  return {
    htmlElement: dialogRef,
    onClose,
    onDismiss,
  };
}
