/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DateTime } from 'luxon';
import {
  getTimePickerConstraintBounds,
  hasActiveTimePickerConstraints,
  isWithinTimePickerConstraints,
  parseTimeOnDay,
} from '../time-picker-constraints';

const baseDay = DateTime.fromObject(
  { year: 2024, month: 6, day: 15 },
  { zone: 'utc' }
).startOf('day');

describe('parseTimeOnDay', () => {
  it('returns null for undefined or blank', () => {
    expect(parseTimeOnDay(undefined, 'HH:mm', baseDay)).toBeNull();
    expect(parseTimeOnDay('   ', 'HH:mm', baseDay)).toBeNull();
  });

  it('returns null for invalid format match', () => {
    expect(parseTimeOnDay('not-a-time', 'HH:mm', baseDay)).toBeNull();
  });

  it('applies parsed clock to base day', () => {
    const t = parseTimeOnDay('14:30', 'HH:mm', baseDay);
    expect(t).not.toBeNull();
    expect(t!.toUTC().toObject()).toMatchObject({
      year: 2024,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30,
    });
  });
});

describe('getTimePickerConstraintBounds', () => {
  it('drops both bounds when min > max', () => {
    const { min, max } = getTimePickerConstraintBounds(
      '18:00',
      '09:00',
      'HH:mm',
      baseDay
    );
    expect(min).toBeNull();
    expect(max).toBeNull();
  });

  it('returns min and max when ordered', () => {
    const { min, max } = getTimePickerConstraintBounds(
      '09:00',
      '18:00',
      'HH:mm',
      baseDay
    );
    expect(min!.hour).toBe(9);
    expect(max!.hour).toBe(18);
  });
});

describe('isWithinTimePickerConstraints', () => {
  it('returns false for invalid candidate', () => {
    const invalid = DateTime.fromMillis(Number.NaN);
    expect(
      isWithinTimePickerConstraints(invalid, baseDay.set({ hour: 9 }), null)
    ).toBe(false);
  });

  it('respects min and max', () => {
    const min = baseDay.set({ hour: 9, minute: 0 });
    const max = baseDay.set({ hour: 17, minute: 0 });
    expect(
      isWithinTimePickerConstraints(baseDay.set({ hour: 12 }), min, max)
    ).toBe(true);
    expect(
      isWithinTimePickerConstraints(baseDay.set({ hour: 8 }), min, max)
    ).toBe(false);
    expect(
      isWithinTimePickerConstraints(baseDay.set({ hour: 18 }), min, max)
    ).toBe(false);
  });
});

describe('hasActiveTimePickerConstraints', () => {
  it('is false when both null', () => {
    expect(hasActiveTimePickerConstraints(null, null)).toBe(false);
  });

  it('is true when either bound set', () => {
    expect(hasActiveTimePickerConstraints(baseDay, null)).toBe(true);
    expect(hasActiveTimePickerConstraints(null, baseDay)).toBe(true);
  });
});
