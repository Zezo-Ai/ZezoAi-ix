/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, Inject } from '@angular/core';
import {
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxButton,
  IxActiveModal,
} from '@siemens/ix-angular/standalone';

/** Modal body for `modal-non-blocking` preview only — matches HTML/React copy for shared aria snapshots. */
@Component({
  selector: 'app-modal-non-blocking-content',
  imports: [IxModalHeader, IxModalContent, IxModalFooter, IxButton],
  template: `
    <ix-modal-header> Message headline </ix-modal-header>
    <ix-modal-content> Message text lorem ipsum </ix-modal-content>
    <ix-modal-footer>
      <ix-button
        variant="subtle-primary"
        class="dismiss-modal"
        (click)="activeModal.dismiss('dismiss')"
      >
        Cancel
      </ix-button>
      <ix-button autofocus class="close-modal" (click)="activeModal.close('okay')">
        OK
      </ix-button>
    </ix-modal-footer>
  `,
})
export default class ModalNonBlockingContent {
  constructor(@Inject(IxActiveModal) readonly activeModal: IxActiveModal) {}
}
