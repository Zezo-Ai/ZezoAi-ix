---
'@siemens/ix': major
'@siemens/ix-angular': major
'@siemens/ix-react': major
'@siemens/ix-vue': major
---

**`ix-time-picker` — time bounds:** optional **`minTime`** and **`maxTime`** (same string shape as **`format`** / the current **`time`** value). Ring values outside that inclusive range are disabled in the picker columns.

**`ix-time-picker` — breaking (v5, attribute markup):** the hour column header **attribute** was renamed from **`i18n-column-header`** to **`i18n-hour-column-header`**. The **`i18nHourColumnHeader`** property name is unchanged—update static HTML or templates that still use the old attribute. Details: **`BREAKING_CHANGES/v5.md`**.

**`@siemens/ix-angular`**, **`@siemens/ix-react`**, **`@siemens/ix-vue`:** regenerated bindings expose the same **`ix-time-picker`** API, including **`minTime`** and **`maxTime`**.
