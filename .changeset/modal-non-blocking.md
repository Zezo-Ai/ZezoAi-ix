---
'@siemens/ix-angular': minor
'@siemens/ix': minor
'@siemens/ix-react': minor
'@siemens/ix-vue': minor
---

Add **non-blocking** dialog mode to **ix-modal** with **`isNonBlocking`** and **`ModalConfig.isNonBlocking`**: opens with **`dialog.show()`** so the page stays interactive (no lightbox or focus trap; **`aria-modal`** is false). Because **`show()`** does not move focus like **`showModal()`**, initial focus is applied after open (autofocus on the host, then header close, then the inner dialog as fallback).
