/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Prop } from '@stencil/core';

export class BaseTab {
  /**
   * Key of the tab, used for identifying the tab in events
   *
   * @since 5.0.0
   */
  @Prop() tabKey!: string;
}
