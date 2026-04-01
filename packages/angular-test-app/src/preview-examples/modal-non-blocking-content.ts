/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import { IxActiveModal } from '@siemens/ix-angular';

@Component({
  standalone: false,
  selector: 'app-modal-non-blocking-content',
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
      <ix-button
        autofocus
        class="close-modal"
        (click)="activeModal.close('okay')"
      >
        OK
      </ix-button>
    </ix-modal-footer>
  `,
})
export default class ModalNonBlockingContent {
  constructor(readonly activeModal: IxActiveModal) {}
}
