/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import { IxTimeInput } from '@siemens/ix-angular/standalone';

@Component({
  selector: 'app-example',
  imports: [IxTimeInput],
  templateUrl: './time-input-min-max-time.html',
})
export default class TimeInputMinMaxTime {}
