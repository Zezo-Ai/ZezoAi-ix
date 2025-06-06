/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';
import {
  ToastService as BaseToastService,
  ToastConfig,
} from '@siemens/ix-angular/common';
import { ShowToastResult } from '@siemens/ix';
import { defineCustomElement } from '@siemens/ix/components/ix-toast.js';
import { defineCustomElement as defineCustomElementToastContainer } from '@siemens/ix/components/ix-toast-container.js';

@Injectable()
export class ToastService extends BaseToastService {
  constructor() {
    super();
  }

  public getPosition(): 'bottom-right' | 'top-right' {
    return super.getPosition();
  }

  public setPosition(position: 'bottom-right' | 'top-right'): void {
    super.setPosition(position);
  }

  public show(config: ToastConfig): Promise<ShowToastResult> {
    defineCustomElement();
    defineCustomElementToastContainer();
    return super.show(config);
  }
}
