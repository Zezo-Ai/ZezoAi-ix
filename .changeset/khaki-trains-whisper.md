---
'@siemens/ix': patch
---

Align `ix-datetime-picker` time constraints with boundary-date semantics. `minTime` is enforced only on `minDate`, `maxTime` only on `maxDate`, and intermediate dates remain selectable; when no date bounds are configured, `minTime`/`maxTime` continue to act as a daily time window.
