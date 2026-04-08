/*
 * SPDX-FileCopyrightText: 2025 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import {
  IxLayoutGrid,
  IxRow,
  IxCol,
  IxPill,
} from '@siemens/ix-angular/standalone';

@Component({
  selector: 'app-example',
  imports: [IxLayoutGrid, IxRow, IxCol, IxPill],
  styleUrls: ['./pill-variants.css'],
  template: `
    <ix-layout-grid>
      @for (row of pillVariants; track row.variant) {
        <ix-row>
          <ix-col>
            <ix-pill [attr.variant]="row.variant" icon="info">{{
              row.label
            }}</ix-pill>
          </ix-col>
          <ix-col>
            <ix-pill
              [attr.variant]="row.variant"
              outline
              icon="info"
            >{{ row.label }}</ix-pill>
          </ix-col>
        </ix-row>
      }
      <ix-row>
        <ix-col>
          <ix-pill
            variant="custom"
            pill-color="white"
            background="purple"
            icon="info"
          >Custom</ix-pill>
        </ix-col>
        <ix-col>
          <ix-pill
            variant="custom"
            outline
            pill-color="white"
            background="purple"
            icon="info"
          >Custom</ix-pill>
        </ix-col>
      </ix-row>
    </ix-layout-grid>
  `,
})
export default class Pill {
  protected readonly pillVariants = [
    { variant: 'primary', label: 'Primary' },
    { variant: 'alarm', label: 'Alarm' },
    { variant: 'critical', label: 'Critical' },
    { variant: 'warning', label: 'Warning' },
    { variant: 'info', label: 'Info' },
    { variant: 'neutral', label: 'Neutral' },
    { variant: 'success', label: 'Success' },
  ] as const;
}
