---
'@siemens/ix-angular': major
'@siemens/ix-react': major
'@siemens/ix': major
'@siemens/ix-vue': major
---

**Migrate `ix-menu-about` and `ix-menu-settings` to slotted `ix-tabs`, with `enableLegacyTabs` as a temporary compatibility flag**

`ix-menu-about` and `ix-menu-settings` now use slotted `ix-tabs` / `ix-tab-item` markup as the public migration path. The deprecated `enableLegacyTabs` prop temporarily keeps `ix-menu-about-item` and `ix-menu-settings-item` working while consumers migrate, and `ix-menu-about-news` now uses `activeAboutTabKey` instead of `aboutItemLabel`.

### Breaking Changes

#### ix-menu-about / ix-menu-settings

- The recommended integration path is now slotted `ix-tabs` plus consumer-managed content in the default slot.
- `ix-menu-about` renamed `activeTabLabel` to `activeTabKey` for legacy item-based integrations.
- New deprecated `enableLegacyTabs` prop temporarily restores `ix-menu-about-item` / `ix-menu-settings-item` behavior during migration.

#### ix-menu-about-item / ix-menu-settings-item

- `tabKey` is now required when using legacy item-based integrations with `enableLegacyTabs`.
- `ix-menu-about-item` changed from `shadow: true` to `shadow: false`.

#### ix-menu-about-news

- New `activeAboutTabKey` prop replaces `aboutItemLabel` as the condition for showing the "Show more" footer button.
- The `aboutItemLabel` prop no longer controls footer visibility. Use `activeAboutTabKey` instead.

### Migration

Use the existing `ix-tabs` pattern in your framework app inside `ix-menu-about` / `ix-menu-settings`, and show the matching slotted content based on the active tab key. In the recommended path, set `active-tab-key` on the nested `ix-tabs`, not on `ix-menu-about` or `ix-menu-settings`.

```html
<!-- Recommended public path -->
<ix-menu-about>
  <ix-tabs active-tab-key="tab-1">
    <ix-tab-item tab-key="tab-1">Tab 1</ix-tab-item>
    <ix-tab-item tab-key="tab-2">Tab 2</ix-tab-item>
  </ix-tabs>
  <!-- render the matching content in the slot using the active tab key -->
</ix-menu-about>
```

```html
<!-- Temporary compatibility path -->
<ix-menu-about enable-legacy-tabs active-tab-key="tab-1">
  <ix-menu-about-item tab-key="tab-1" label="Tab 1">Content 1</ix-menu-about-item>
  <ix-menu-about-item tab-key="tab-2" label="Tab 2">Content 2</ix-menu-about-item>
</ix-menu-about>
```

```html
<!-- Temporary compatibility path -->
<ix-menu-settings enable-legacy-tabs active-tab-key="tab-1">
  <ix-menu-settings-item tab-key="tab-1" label="Tab 1">Content 1</ix-menu-settings-item>
</ix-menu-settings>
```
