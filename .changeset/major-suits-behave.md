---
'@siemens/ix-angular': minor
'@siemens/ix-react': minor
'@siemens/ix': minor
'@siemens/ix-vue': minor
---

`ix-dropdown` now checks whether the provided trigger or anchor element is visible in the viewport before opening. If the trigger or anchor element is outside the visible viewport, the dropdown will not open. This prevents the dropdown from rendering in an unexpected screen position. To allow the dropdown to open regardless of trigger or anchor visibility, set `suppressTriggerVisibilityCheck` to `true`.
