/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createContext } from '../utils/context';

export const panelsContext = createContext<{
  tabs: Record<string, string>;
}>('tab-panels', {
  tabs: {},
});
