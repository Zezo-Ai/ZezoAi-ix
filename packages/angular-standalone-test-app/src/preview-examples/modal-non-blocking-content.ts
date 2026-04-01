/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, inject } from '@angular/core';
import {
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxButton,
  IxActiveModal,
} from '@siemens/ix-angular/standalone';

@Component({
  selector: 'app-modal-non-blocking-content',
  imports: [IxModalHeader, IxModalContent, IxModalFooter, IxButton],
  template: `
    <ix-modal-header (closeClick)="activeModal.dismiss('dismiss payload')">
      Message headline
    </ix-modal-header>
    <ix-modal-content>Message text lorem ipsum</ix-modal-content>
    <ix-modal-footer>
      <ix-button
        variant="subtle-primary"
        (click)="activeModal.dismiss('dismiss payload')"
      >
        Cancel
      </ix-button>
      <ix-button autofocus (click)="activeModal.close('close payload!')">
        OK
      </ix-button>
    </ix-modal-footer>
  `,
})
export default class ModalNonBlockingContent {
  readonly activeModal: IxActiveModal = inject(IxActiveModal);
}
