/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DateTime } from 'luxon';
import type { TimePickerDescriptorUnit } from './time-picker.types';

/**
 * Applies a raw column value to a base time (including 12h rules).
 */
export function computeTimeWithRawUnitValue(
  baseTime: DateTime,
  unit: TimePickerDescriptorUnit,
  rawValue: number,
  timeRef: 'AM' | 'PM' | undefined
): DateTime | null {
  let value = rawValue;
  let maxValue =
    unit === 'hour'
      ? 23
      : unit === 'minute'
        ? 59
        : unit === 'second'
          ? 59
          : 999;

  if (unit === 'hour') {
    if (timeRef === 'PM') {
      value = value === 12 ? 12 : value + 12;
    } else if (timeRef === 'AM') {
      value = value === 12 ? 0 : value;
      maxValue = 12;
    }
  }

  if (value > maxValue) {
    value = maxValue;
  } else if (value < 0) {
    value = 0;
  }

  try {
    return baseTime.set({
      [unit]: value,
    } as {
      hour?: number;
      minute?: number;
      second?: number;
      millisecond?: number;
    });
  } catch {
    return null;
  }
}
