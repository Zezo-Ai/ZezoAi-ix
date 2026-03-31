/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import { ModalService } from '@siemens/ix-angular';
import ModalNonBlockingContent from './modal-non-blocking-content';

@Component({
  standalone: false,
  selector: 'app-example',
  template: `
    <div style="padding: 1rem">
      <ix-typography format="body" text-color="std">
        Content behind the dialog
      </ix-typography>
      <ix-button>Behind control</ix-button>
    </div>
    <ix-button (click)="openModal()">Show non-blocking modal</ix-button>
  `,
})
export default class ModalNonBlocking {
  constructor(private readonly modalService: ModalService) {}

  async openModal() {
    await this.modalService.open({
      content: ModalNonBlockingContent,
      isNonBlocking: true,
    });
  }
}
