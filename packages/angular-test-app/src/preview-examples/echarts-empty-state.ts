/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, OnInit } from '@angular/core';
import { registerTheme } from '@siemens/ix-echarts';
import { themeSwitcher } from '@siemens/ix';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-example',
  templateUrl: './echarts-empty-state.html',
  styleUrls: ['./echarts-empty-state.css'],
})
export default class EchartsLineSimple implements OnInit {
  theme = themeSwitcher.getCurrentTheme();
  data = {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    value: [],
  };

  options: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.data.weekdays,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.data.value,
        type: 'line',
      },
    ],
  };

  ngOnInit() {
    registerTheme(echarts);

    themeSwitcher.themeChanged.on((theme: string) => {
      this.theme = theme;
    });
  }
}
