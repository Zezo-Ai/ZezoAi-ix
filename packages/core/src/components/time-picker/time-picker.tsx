/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
  Mixin,
} from '@stencil/core';
import { DateTime } from 'luxon';
import { DefaultMixins } from '../utils/internal/component';
import { OnListener } from '../utils/listener';
import { computeTimeWithRawUnitValue } from './time-picker-compute-time';
import {
  getTimePickerConstraintBounds,
  hasActiveTimePickerConstraints,
  isWithinTimePickerConstraints,
} from './time-picker-constraints';
import { buildTimePickerColumnNumberArrays } from './time-picker-column-values';
import { findNextSelectableRingValue } from './time-picker-step-focus';
import {
  formatTimePickerUnitValue,
  getTimePickerColumnSeparator,
  getTimePickerInitialFocusedValueForUnit,
} from './time-picker-display';
import { isFormat12Hour, LUXON_FORMAT_PATTERNS } from './time-picker-format';
import type {
  TimePickerCorners,
  TimePickerDescriptorUnit,
} from './time-picker.types';
import { hasKeyboardMode } from '../utils/internal/mixins/setup.mixin';
import { closestPassShadow } from '../utils/shadow-dom';

interface TimePickerDescriptor {
  unit: TimePickerDescriptorUnit;
  header: string;
  hidden: boolean;
  numberArray: number[];
  focusedValue: number;
}

interface TimeOutputFormat {
  hour: string;
  minute: string;
  second: string;
  millisecond: string;
}

const HOUR_INTERVAL_DEFAULT = 1;
const MINUTE_INTERVAL_DEFAULT = 1;
const SECOND_INTERVAL_DEFAULT = 1;
const MILLISECOND_INTERVAL_DEFAULT = 100;

const CONFIRM_BUTTON_DEFAULT = 'Confirm';
const HEADER_DEFAULT = 'Time';

const FORMATTED_TIME_EMPTY: TimeOutputFormat = {
  hour: '',
  minute: '',
  second: '',
  millisecond: '',
};

@Component({
  tag: 'ix-time-picker',
  styleUrl: 'time-picker.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class TimePicker extends Mixin(...DefaultMixins) {
  @Element() override hostElement!: HTMLIxTimePickerElement;

  /**
   * Format of time string.
   * See {@link https://moment.github.io/luxon/#/formatting?id=table-of-tokens} for all available tokens.
   * Note: Formats that combine date and time (like f or F) are not supported. Timestamp tokens x and X are not supported either.
   */
  @Prop() format: string = 'TT';
  @Watch('format')
  watchFormatIntervalPropHandler(newValue: string) {
    if (!newValue) {
      return;
    }

    this.initPicker();
    this.updateScrollPositions();
  }

  /**
   * Corner style.
   */
  @Prop() corners: TimePickerCorners = 'rounded';

  /**
   * Embedded style (for use in other components).
   */
  @Prop() embedded = false;

  /**
   * @internal Temporary prop needed until datetime-picker is reworked for new design.
   */
  @Prop() dateTimePickerAppearance: boolean = false;

  /**
   * Hides the header of the picker.
   *
   * @since 3.2.0
   */
  @Prop() hideHeader: boolean = false;

  /**
   * Interval for hour selection.
   *
   * @since 3.2.0
   */
  @Prop({ mutable: true }) hourInterval: number = HOUR_INTERVAL_DEFAULT;
  @Watch('hourInterval')
  watchHourIntervalPropHandler(newValue: number) {
    if (
      Number.isInteger(newValue) &&
      newValue >= 0 &&
      newValue <= (this.timeRef ? 12 : 23)
    ) {
      this.setTimePickerDescriptors();
      return;
    }

    this.printIntervalError('hour', newValue);
    this.hourInterval = HOUR_INTERVAL_DEFAULT;
  }

  /**
   * Interval for minute selection.
   *
   * @since 3.2.0
   */
  @Prop({ mutable: true }) minuteInterval: number = MINUTE_INTERVAL_DEFAULT;
  @Watch('minuteInterval')
  watchMinuteIntervalPropHandler(newValue: number) {
    if (newValue >= 0 && newValue <= 59) {
      this.setTimePickerDescriptors();
      return;
    }

    this.printIntervalError('minute', newValue);
    this.minuteInterval = MINUTE_INTERVAL_DEFAULT;
  }

  /**
   * Interval for second selection.
   *
   * @since 3.2.0
   */
  @Prop({ mutable: true }) secondInterval: number = SECOND_INTERVAL_DEFAULT;
  @Watch('secondInterval')
  watchSecondIntervalPropHandler(newValue: number) {
    if (newValue >= 0 && newValue <= 59) {
      this.setTimePickerDescriptors();
      return;
    }

    this.printIntervalError('second', newValue);
    this.secondInterval = SECOND_INTERVAL_DEFAULT;
  }

  /**
   * Interval for millisecond selection.
   *
   * @since 3.2.0
   */
  @Prop({ mutable: true }) millisecondInterval: number =
    MILLISECOND_INTERVAL_DEFAULT;
  @Watch('millisecondInterval')
  watchMillisecondIntervalPropHandler(newValue: number) {
    if (newValue >= 0 && newValue <= 999) {
      this.setTimePickerDescriptors();
      return;
    }

    this.printIntervalError('millisecond', newValue);
    this.millisecondInterval = MILLISECOND_INTERVAL_DEFAULT;
  }

  private printIntervalError(intervalName: string, value: number) {
    console.error(
      `Value ${value} is not valid for ${intervalName}-interval. Falling back to default.`
    );
  }

  /**
   * Selected time value.
   * Format has to match the `format` property.
   */
  @Prop() time?: string;

  @Watch('time')
  watchTimePropHandler(newValue: string) {
    const timeFormat = DateTime.fromFormat(newValue, this.format);
    if (!timeFormat.isValid) {
      throw new Error('Format is not supported or not correct');
    }

    this._time = timeFormat;
  }

  /**
   * Earliest selectable time of day (string format must match `format`).
   *
   * @since 5.0.0
   */
  @Prop() minTime?: string;

  /**
   * Latest selectable time of day (string format must match `format`).
   *
   * @since 5.0.0
   */
  @Prop() maxTime?: string;

  /**
   * Get default time value
   * @returns DateTime.now() for empty state (no selection)
   */
  private getDefaultTime(): DateTime | undefined {
    return DateTime.now();
  }

  /**
   * Text of the time confirm button.
   */
  @Prop({ attribute: 'i18n-confirm-time' }) i18nConfirmTime =
    CONFIRM_BUTTON_DEFAULT;

  /**
   * Text for the top header.
   */
  @Prop({ attribute: 'i18n-header' }) i18nHeader: string = HEADER_DEFAULT;

  /**
   * Text for the hour column header.
   */
  @Prop({ attribute: 'i18n-hour-column-header' }) i18nHourColumnHeader: string =
    'hr';

  /**
   * Text for the minute column header.
   */
  // eslint-disable-next-line @stencil-community/decorators-style
  @Prop({ attribute: 'i18n-minute-column-header' })
  i18nMinuteColumnHeader: string = 'min';

  /**
   * Text for the second column header.
   */
  // eslint-disable-next-line @stencil-community/decorators-style
  @Prop({ attribute: 'i18n-second-column-header' })
  i18nSecondColumnHeader: string = 'sec';

  /**
   * Text for the millisecond column header.
   */
  // eslint-disable-next-line @stencil-community/decorators-style
  @Prop({ attribute: 'i18n-millisecond-column-header' })
  i18nMillisecondColumnHeader: string = 'ms';

  /**
   * Time event. Emitted when the user confirms the selected time.
   */
  @Event() timeSelect!: EventEmitter<string>;

  /**
   * Time change event. Emitted when the selected time changes while interacting with the picker.
   */
  @Event() timeChange!: EventEmitter<string>;

  /**
   * Get the current time based on the wanted format
   */
  @Method()
  async getCurrentTime(): Promise<string | undefined> {
    return this._time?.toFormat(this.format);
  }

  @State() private _time?: DateTime;
  @Watch('_time')
  onTimeChange() {
    const formattedTimeOld = this.formattedTime;
    this.setTimeRef();
    this.formattedTime = this.getFormattedTime();

    this.updateScrollPositions(formattedTimeOld);
  }

  @State() private timeRef?: 'AM' | 'PM' | undefined;
  @State() private formattedTime: TimeOutputFormat = FORMATTED_TIME_EMPTY;
  @State() private timePickerDescriptors: TimePickerDescriptor[] = [];
  @State() private isUnitFocused: boolean = false;
  @State() private focusedUnit: TimePickerDescriptorUnit = 'hour';
  @State() private focusedValue: number = 0;

  private visibilityObserver?: MutationObserver;
  private focusScrollAlignment: 'start' | 'end' = 'start';

  override componentWillLoad() {
    this.initPicker();
  }

  private initPicker() {
    let parsedTime: DateTime | undefined;

    if (this.time) {
      parsedTime = DateTime.fromFormat(this.time, this.format);

      if (!parsedTime.isValid) {
        console.error(
          `Invalid time format. The configured format does not match the format of the passed time. ${parsedTime.invalidReason}: ${parsedTime.invalidExplanation}`
        );
        parsedTime = this.getDefaultTime();
      }
    } else {
      parsedTime = this.getDefaultTime();
    }

    this._time = parsedTime;

    this.setTimeRef();
    this.setTimePickerDescriptors();
    this.setInitialFocusedValueAndUnit();

    this.watchHourIntervalPropHandler(this.hourInterval);
    this.watchMinuteIntervalPropHandler(this.minuteInterval);
    this.watchSecondIntervalPropHandler(this.secondInterval);
    this.watchMillisecondIntervalPropHandler(this.millisecondInterval);
  }

  override componentDidLoad() {
    super.componentDidLoad?.();
    this.updateScrollPositions();
    this.setupVisibilityObserver();
  }

  override componentDidRender() {
    if (!this.isUnitFocused) {
      return;
    }
    const elementContainer = this.getElementContainer(
      this.focusedUnit,
      this.focusedValue
    );
    const elementList = this.getElementList(this.focusedUnit);

    if (!elementContainer) {
      return;
    }

    if (hasKeyboardMode()) {
      elementContainer.focus({ preventScroll: true });
    }

    if (!this.isElementVisible(elementContainer, elementList)) {
      this.scrollElementIntoView(
        elementContainer,
        elementList,
        this.focusScrollAlignment
      );
    }
  }

  override disconnectedCallback() {
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
    }
  }

  @OnListener<TimePicker>('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isUnitFocused) {
      return;
    }

    let shouldPreventDefault = true;

    switch (event.key) {
      case 'Tab':
        shouldPreventDefault = false;
        this.isUnitFocused = false;
        break;

      case 'ArrowUp':
        this.focusScrollAlignment = 'start';
        this.stepFocusedValue(-1);
        break;

      case 'ArrowDown':
        this.focusScrollAlignment = 'end';
        this.stepFocusedValue(1);
        break;

      case 'Enter':
      case ' ':
        if (this.canSelectUnitValue(this.focusedUnit, this.focusedValue)) {
          this.select(this.focusedUnit, this.focusedValue);
        }
        break;

      default:
        return;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }

  onUnitCellBlur(unit: TimePickerDescriptorUnit, event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const relatedUnit =
      relatedTarget?.dataset?.elementContainerId?.split('-')[0];
    const movingWithinSameColumn = relatedUnit === unit;

    // Check if column lost focus to scroll back to selected value
    if (relatedTarget && !movingWithinSameColumn) {
      if (relatedUnit !== unit) {
        this.elementListScrollToTop(
          unit,
          Number(this.formattedTime[unit]),
          'smooth'
        );
      }
    }

    // Focus may move to another cell in this column (e.g. keyboard navigation)
    if (movingWithinSameColumn) {
      return;
    }

    this.isUnitFocused = false;
    const focusedValue = Number(this.formattedTime[unit]);

    this.updateDescriptorFocusedValue(unit, focusedValue);
  }

  onUnitCellFocus(unit: TimePickerDescriptorUnit, value: number) {
    this.isUnitFocused = true;
    this.focusedUnit = unit;
    this.focusedValue = value;

    this.updateDescriptorFocusedValue(unit, value);
  }

  private getElementList(unit: TimePickerDescriptorUnit): HTMLDivElement {
    return this.hostElement.shadowRoot?.querySelector(
      `[data-element-list-id="${unit}"]`
    ) as HTMLDivElement;
  }

  private getElementContainer(
    unit: TimePickerDescriptorUnit,
    number: number
  ): HTMLDivElement {
    return this.hostElement.shadowRoot?.querySelector(
      `[data-element-container-id="${unit}-${number}"]`
    ) as HTMLDivElement;
  }

  private isElementVisible(
    element: HTMLElement,
    container: HTMLElement
  ): boolean {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom
    );
  }

  private scrollElementIntoView(
    element: HTMLElement,
    container: HTMLElement,
    alignment: 'start' | 'end'
  ) {
    const SCROLL_BUFFER = 1;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (alignment === 'end') {
      container.scrollTop +=
        elementRect.bottom - containerRect.bottom + SCROLL_BUFFER;
    } else {
      container.scrollTop +=
        elementRect.top - containerRect.top - SCROLL_BUFFER;
    }
  }

  private setInitialFocusedValueAndUnit() {
    const firstVisibleDescriptor = this.timePickerDescriptors.find(
      (descriptor) => !descriptor.hidden
    );
    if (!firstVisibleDescriptor) {
      return;
    }

    const selectedValue = Number(
      this.formattedTime[firstVisibleDescriptor.unit]
    );
    const isValidSelection =
      firstVisibleDescriptor.numberArray.includes(selectedValue);

    this.focusedValue = isValidSelection
      ? selectedValue
      : firstVisibleDescriptor.numberArray[0];

    this.focusedUnit = firstVisibleDescriptor.unit;
  }

  private setupVisibilityObserver() {
    const dropdown = closestPassShadow(this.hostElement, 'ix-dropdown');
    if (!dropdown) {
      return;
    }

    this.visibilityObserver = new MutationObserver((mutations) =>
      this.mutationObserverCallback(mutations)
    );

    this.visibilityObserver.observe(dropdown, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }

  private mutationObserverCallback(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes') {
        continue;
      }

      const dropdown = mutation.target as HTMLElement;

      if (!dropdown.classList.contains('show')) {
        // keep picker in sync with input
        if (this.time) {
          const timeFormat = DateTime.fromFormat(this.time, this.format);
          if (timeFormat.isValid) {
            this._time = DateTime.fromFormat(this.time, this.format);
            this.setInitialFocusedValueAndUnit();
          }
        }

        continue;
      }

      const elementsReady = this.areElementsRendered();
      if (!elementsReady) {
        continue;
      }

      this.updateScrollPositions();
    }
  }

  private areElementsRendered(): boolean {
    const elementLists =
      this.hostElement.shadowRoot?.querySelectorAll('.element-list');

    if (!elementLists || elementLists.length === 0) {
      return false;
    }

    return Array.from(elementLists).some(
      (list) => (list as HTMLElement).offsetHeight > 0
    );
  }

  private getFormattedTime(): TimeOutputFormat {
    if (!this._time) {
      return FORMATTED_TIME_EMPTY;
    }

    return {
      hour:
        this.timeRef !== undefined
          ? this._time.toFormat('h')
          : this._time.toFormat('H'),
      minute: this._time.toFormat('m'),
      second: this._time.toFormat('s'),
      millisecond: this._time.toFormat('S'),
    };
  }

  private timeUpdate(unit: TimePickerDescriptorUnit, value: number): number {
    if (!this._time) {
      this._time = DateTime.now().startOf('day');
    }
    const next = computeTimeWithRawUnitValue(
      this._time,
      unit,
      value,
      this.timeRef
    );
    if (next) {
      this._time = next;
    }
    return value;
  }

  private changeTimeReference(newTimeRef: 'AM' | 'PM') {
    if (this.timeRef === newTimeRef) {
      return;
    }

    if (!this._time) {
      this._time = DateTime.now().startOf('day');
    }

    const previousTime = this._time;
    const previousRef = this.timeRef;

    this.timeRef = newTimeRef;
    const currentHour = this._time.hour;

    if (newTimeRef === 'PM' && currentHour < 12) {
      this._time = this._time.plus({ hours: 12 });
    } else if (newTimeRef === 'AM' && currentHour >= 12) {
      this._time = this._time.minus({ hours: 12 });
    }

    if (!this.isWithinTimeConstraints(this._time)) {
      this._time = previousTime;
      this.timeRef = previousRef;
      return;
    }

    this.timeChange.emit(this._time.toFormat(this.format));
  }

  private setTimeRef() {
    const uses12HourFormat = isFormat12Hour(this.format);

    if (!uses12HourFormat) {
      this.timeRef = undefined;
      return;
    }

    const clock = this._time ?? DateTime.now();
    this.timeRef = clock.hour >= 12 ? 'PM' : 'AM';
  }

  private getConstraintBounds(): {
    min: DateTime | null;
    max: DateTime | null;
  } {
    const baseDay = (this._time ?? DateTime.now()).startOf('day');
    return getTimePickerConstraintBounds(
      this.minTime,
      this.maxTime,
      this.format,
      baseDay
    );
  }

  private isWithinTimeConstraints(candidate: DateTime): boolean {
    const { min, max } = this.getConstraintBounds();
    return isWithinTimePickerConstraints(candidate, min, max);
  }

  private canSelectUnitValue(
    unit: TimePickerDescriptorUnit,
    rawValue: number,
    bounds?: { min: DateTime | null; max: DateTime | null }
  ): boolean {
    const base = this._time ?? DateTime.now().startOf('day');
    const candidate = computeTimeWithRawUnitValue(
      base,
      unit,
      rawValue,
      this.timeRef
    );
    if (!candidate) {
      return false;
    }
    if (bounds) {
      return isWithinTimePickerConstraints(candidate, bounds.min, bounds.max);
    }
    return this.isWithinTimeConstraints(candidate);
  }

  private stepFocusedValue(direction: 1 | -1) {
    const unit = this.focusedUnit;
    const arr = this.getNumberArrayForUnit(unit);
    const bounds = this.getConstraintBounds();
    const next = findNextSelectableRingValue(
      arr,
      this.focusedValue,
      direction,
      (candidate) => this.canSelectUnitValue(unit, candidate, bounds)
    );
    if (next === null) {
      return;
    }
    this.focusedValue = next;
    this.updateDescriptorFocusedValue(unit, next);
  }

  private isConfirmDisabled(): boolean {
    const { min, max } = this.getConstraintBounds();
    if (!hasActiveTimePickerConstraints(min, max)) {
      return false;
    }
    const t = this._time ?? DateTime.now();
    return !isWithinTimePickerConstraints(t, min, max);
  }

  private getInitialFocusedValueForUnit(
    unit: TimePickerDescriptorUnit,
    numberArray: number[]
  ): number {
    return getTimePickerInitialFocusedValueForUnit(
      Number(this.formattedTime[unit]),
      numberArray
    );
  }

  private setTimePickerDescriptors() {
    const { hourNumbers, minuteNumbers, secondNumbers, millisecondsNumbers } =
      buildTimePickerColumnNumberArrays(
        {
          hourInterval: this.hourInterval,
          minuteInterval: this.minuteInterval,
          secondInterval: this.secondInterval,
          millisecondInterval: this.millisecondInterval,
        },
        this.timeRef
      );

    this.timePickerDescriptors = [
      {
        unit: 'hour',
        header: this.i18nHourColumnHeader,
        hidden: !LUXON_FORMAT_PATTERNS.hours.test(this.format),
        numberArray: hourNumbers,
        focusedValue: this.getInitialFocusedValueForUnit('hour', hourNumbers),
      },
      {
        unit: 'minute',
        header: this.i18nMinuteColumnHeader,
        hidden: !LUXON_FORMAT_PATTERNS.minutes.test(this.format),
        numberArray: minuteNumbers,
        focusedValue: this.getInitialFocusedValueForUnit(
          'minute',
          minuteNumbers
        ),
      },
      {
        unit: 'second',
        header: this.i18nSecondColumnHeader,
        hidden: !LUXON_FORMAT_PATTERNS.seconds.test(this.format),
        numberArray: secondNumbers,
        focusedValue: this.getInitialFocusedValueForUnit(
          'second',
          secondNumbers
        ),
      },
      {
        unit: 'millisecond',
        header: this.i18nMillisecondColumnHeader,
        hidden: !LUXON_FORMAT_PATTERNS.milliseconds.test(this.format),
        numberArray: millisecondsNumbers,
        focusedValue: this.getInitialFocusedValueForUnit(
          'millisecond',
          millisecondsNumbers
        ),
      },
    ];

    this.timePickerDescriptors = this.timePickerDescriptors.filter(
      (item) => !item.hidden
    );
  }

  private getNumberArrayForUnit(unit: TimePickerDescriptorUnit): number[] {
    const descriptor = this.timePickerDescriptors.find(
      (descriptor) => descriptor.unit === unit
    );
    return descriptor ? descriptor.numberArray : [];
  }

  private isSelected(unit: TimePickerDescriptorUnit, number: number): boolean {
    return this.formattedTime![unit] === String(number);
  }

  /**
   * Roving tabindex: while a column has keyboard focus, only the focused cell
   * participates in sequential navigation so Tab/Shift+Tab move between
   * columns instead of between cells inside the same column.
   */
  private getUnitCellTabIndex(
    unit: TimePickerDescriptorUnit,
    number: number
  ): number {
    if (this.isUnitFocused && this.focusedUnit === unit) {
      return this.focusedValue === number ? 0 : -1;
    }
    if (this.isSelected(unit, number)) {
      return 0;
    }
    return -1;
  }

  private select(unit: TimePickerDescriptorUnit, number: number) {
    if (this.isSelected(unit, number)) {
      return;
    }

    if (!this.canSelectUnitValue(unit, number)) {
      return;
    }

    this.formattedTime = {
      ...this.formattedTime!,
      [unit]: String(number),
    };

    this.timeUpdate(unit, number);
    this.elementListScrollToTop(unit, number, 'smooth');
    this.timeChange.emit(this._time!.toFormat(this.format));
  }

  private updateDescriptorFocusedValue(
    unit: TimePickerDescriptorUnit,
    value: number
  ) {
    const descriptorIndex = this.timePickerDescriptors.findIndex(
      (d) => d.unit === unit
    );
    if (descriptorIndex !== -1) {
      this.timePickerDescriptors = [
        ...this.timePickerDescriptors.slice(0, descriptorIndex),
        {
          ...this.timePickerDescriptors[descriptorIndex],
          focusedValue: value,
        },
        ...this.timePickerDescriptors.slice(descriptorIndex + 1),
      ];
    }
  }

  private elementListScrollToTop(
    unit: TimePickerDescriptorUnit,
    number: number,
    scrollBehaviour: 'smooth' | 'instant'
  ) {
    const elementList = this.getElementList(unit);
    const elementContainer = this.getElementContainer(unit, number);

    if (elementList && elementContainer) {
      const elementListHeight = elementList.clientHeight;
      const elementContainerHeight = elementContainer.clientHeight;

      // Offset which is used to adjust the scroll position to account for margins, elements being hidden, etc.
      let scrollPositionOffset = 11;
      if (this.hideHeader) {
        // 56 + 1 --> height of the header container and separator
        scrollPositionOffset -= 57;
      }

      const scrollPosition =
        elementContainer.offsetTop -
        elementListHeight / 2 +
        elementContainerHeight -
        scrollPositionOffset;

      elementList.scrollTo({
        top: scrollPosition,
        behavior: scrollBehaviour,
      });
    }
  }

  /**
   * Updates all scroll positions of the time picker elements
   * Updates only the elements that have changed if `formattedTimeOld` is provided
   */
  private updateScrollPositions(
    formattedTimeOld: TimeOutputFormat | undefined = undefined
  ) {
    for (const key in this.formattedTime) {
      const unitKey = key as keyof TimeOutputFormat;

      if (
        !formattedTimeOld ||
        this.formattedTime[unitKey] !== formattedTimeOld[unitKey]
      ) {
        this.elementListScrollToTop(
          unitKey as TimePickerDescriptorUnit,
          Number(this.formattedTime[unitKey]),
          'instant'
        );
      }
    }
  }

  private formatUnitValue(
    unit: TimePickerDescriptorUnit,
    value: number
  ): string {
    return formatTimePickerUnitValue(unit, value);
  }

  private getColumnSeparator(currentIndex: number): string {
    return getTimePickerColumnSeparator(
      currentIndex,
      this.timePickerDescriptors
    );
  }

  override render() {
    const constraintBounds = this.getConstraintBounds();

    return (
      <Host>
        <ix-date-time-card
          embedded={this.embedded}
          timePickerAppearance={true}
          corners={this.corners}
          hasFooter={!this.dateTimePickerAppearance}
          hideHeader={this.hideHeader}
        >
          <div class="header" slot="header">
            <ix-typography format="body">{this.i18nHeader}</ix-typography>
          </div>
          <div class="clock">
            {this.timePickerDescriptors.map((descriptor, index: number) => {
              return (
                <div class="flex">
                  <div
                    class={{ columns: true, hidden: descriptor.hidden }}
                    hidden={descriptor.hidden}
                  >
                    <div class="column-header" title={descriptor.header}>
                      {descriptor.header}
                    </div>
                    <div
                      data-element-list-id={descriptor.unit}
                      class="element-list"
                    >
                      {descriptor.numberArray.map((number) => {
                        const tabIndex = this.getUnitCellTabIndex(
                          descriptor.unit,
                          number
                        );

                        const disabled = !this.canSelectUnitValue(
                          descriptor.unit,
                          number,
                          constraintBounds
                        );

                        return (
                          <button
                            data-element-container-id={`${descriptor.unit}-${number}`}
                            class={{
                              selected: this.isSelected(
                                descriptor.unit,
                                number
                              ),
                              'element-container': true,
                              disabled,
                            }}
                            disabled={disabled}
                            onClick={() => {
                              this.select(descriptor.unit, number);
                            }}
                            onFocus={() =>
                              this.onUnitCellFocus(descriptor.unit, number)
                            }
                            onBlur={(e) =>
                              this.onUnitCellBlur(descriptor.unit, e)
                            }
                            aria-label={`${descriptor.header}: ${number}`}
                            tabindex={tabIndex}
                            autofocus={tabIndex === 0 && !this.isUnitFocused}
                          >
                            {this.formatUnitValue(descriptor.unit, number)}
                          </button>
                        );
                      })}
                      <div class="element-list-padding"></div>
                    </div>
                  </div>

                  {index !== this.timePickerDescriptors.length - 1 && (
                    <div
                      class={{
                        'column-separator': true,
                        hidden: descriptor.hidden,
                      }}
                    >
                      {this.getColumnSeparator(index)}
                    </div>
                  )}
                </div>
              );
            })}

            {this.timeRef && (
              <div class="flex">
                <div class="column-separator"></div>
                <div class="columns">
                  <div class="column-header" title="AM/PM" />
                  <div class="element-list" tabIndex={-1}>
                    <button
                      data-am-pm-id="AM"
                      class={{
                        selected: this.timeRef === 'AM',
                        'element-container': true,
                      }}
                      onClick={() => this.changeTimeReference('AM')}
                      tabindex="0"
                      aria-label="AM"
                    >
                      AM
                    </button>
                    <button
                      data-am-pm-id="PM"
                      class={{
                        selected: this.timeRef === 'PM',
                        'element-container': true,
                      }}
                      onClick={() => this.changeTimeReference('PM')}
                      tabindex="0"
                      aria-label="PM"
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            class={{
              footer: true,
              'footer--compact': this.timePickerDescriptors.length <= 2,
            }}
            slot="footer"
          >
            <ix-button
              class="confirm-button"
              disabled={this.isConfirmDisabled()}
              onClick={() => {
                this.timeSelect.emit(this._time?.toFormat(this.format));
              }}
            >
              {this.i18nConfirmTime}
            </ix-button>
          </div>
        </ix-date-time-card>
      </Host>
    );
  }
}
