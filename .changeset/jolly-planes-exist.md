---
'@siemens/ix-angular': major
'@siemens/ix-react': major
'@siemens/ix': major
'@siemens/ix-vue': major
---

- The `toast` function now appends directly to the host element, which also receives the `toast-container` class instead of using a separate container.

## Removed properties

- `containerClass` - The class name for the toast container is now fixed as `toast-container`.
- `containerId` - Just use `id` on the `ix-toast-container` element if needed.
