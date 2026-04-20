/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IxTimeInput } from '@siemens/ix-react';

export default () => {
  return (
    <IxTimeInput
      label="Time"
      format="HH:mm:ss"
      value="12:00:00"
      minTime="09:00:00"
      maxTime="17:30:00"
    />
  );
};
