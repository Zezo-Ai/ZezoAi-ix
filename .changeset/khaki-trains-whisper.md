---
'@siemens/ix': minor
---

**Siemens IX v5:** extend time bounds to **`ix-time-input`**, **`ix-datetime-picker`**, and **`ix-datetime-input`** with optional **`minTime`** / **`maxTime`** (same string shape as the nested time picker’s **`format`** / time tokens). Validation and the picker stay aligned: with **`minDate`** / **`maxDate`**, **`minTime`** applies on the minimum day, **`maxTime`** on the maximum day, and days in between are not time-clamped by those props; with no date bounds, **`minTime`** / **`maxTime`** act as a daily time window.

**`ix-time-picker`:** constraint checks use the full span of each hour, minute, and second candidate so disabled states match inclusive bounds (for example, an hour remains selectable when **`minTime`** falls mid-hour).
