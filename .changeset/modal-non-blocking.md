---
'@siemens/ix-angular': minor
'@siemens/ix': minor
'@siemens/ix-react': minor
'@siemens/ix-vue': minor
---

Add **non-blocking** dialog mode to **ix-modal** with **`isNonBlocking`** and **`ModalConfig.isNonBlocking`**: opens with **`dialog.show()`** so the page stays interactive (no lightbox or focus trap; **`aria-modal`** is false). After open, **`showModal()`** schedules initial focus on the first light-DOM match for **`[autofocus]`** or **`[auto-focus]`** (with **`focusVisible: true`**).
