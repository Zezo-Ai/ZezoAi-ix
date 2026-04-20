---
'@siemens/ix': major
'@siemens/ix-angular': major
'@siemens/ix-react': major
'@siemens/ix-vue': major
---

**`ix-time-picker`**, **`ix-time-input`**, **`ix-datetime-picker`**, and **`ix-datetime-input`**: add optional **`minTime`** and **`maxTime`** (same string shape as the control’s time format). The time picker disables out-of-range column values; time and date-time inputs surface range validation for typed values.

**`ix-datetime-picker`** / **`ix-datetime-input`**: optional pass-through props for time column headers (**`i18nHourColumnHeader`**, **`i18nMinuteColumnHeader`**, **`i18nSecondColumnHeader`**, **`i18nMillisecondColumnHeader`**) on the embedded time picker.

**Breaking (HTML only):** on **`ix-time-picker`**, the hour column header attribute was renamed from **`i18n-column-header`** to **`i18n-hour-column-header`**. See `BREAKING_CHANGES/v5.md`. Update static markup accordingly; the property name `i18nHourColumnHeader` is unchanged.
