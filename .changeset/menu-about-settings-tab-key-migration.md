---
'@siemens/ix': major
---

**Migrate `ix-menu-about` and `ix-menu-settings` to key-based tab identification**

Both `ix-menu-about` and `ix-menu-settings` now use `ix-tab-panels` with `ix-tabs` internally, aligning with the new key-based tab model. Tab panel content is lazy-rendered — only the active panel is mounted in the DOM.

### Breaking Changes

#### ix-menu-about

- Renamed `activeTabLabel` prop to `activeTabKey`.

#### ix-menu-about-item / ix-menu-settings-item

- New required `tabKey` prop to uniquely identify each tab item.
- Items now render `ix-tab-panel` internally for lazy panel rendering.
- `ix-menu-about-item` changed from `shadow: true` to `shadow: false`.

#### ix-menu-about-news

- New `activeAboutTabKey` prop replaces `aboutItemLabel` as the condition for showing the "Show more" footer button.
- The `aboutItemLabel` prop is no longer used to control footer visibility. Use `activeAboutTabKey` instead.

### Migration

```html
<!-- Before -->
<ix-menu-about active-tab-label="Tab 1">
  <ix-menu-about-item label="Tab 1">Content 1</ix-menu-about-item>
  <ix-menu-about-item label="Tab 2">Content 2</ix-menu-about-item>
</ix-menu-about>

<!-- After -->
<ix-menu-about active-tab-key="tab-1">
  <ix-menu-about-item tab-key="tab-1" label="Tab 1">Content 1</ix-menu-about-item>
  <ix-menu-about-item tab-key="tab-2" label="Tab 2">Content 2</ix-menu-about-item>
</ix-menu-about>
```

```html
<!-- Before -->
<ix-menu-settings>
  <ix-menu-settings-item label="Tab 1">Content 1</ix-menu-settings-item>
</ix-menu-settings>

<!-- After -->
<ix-menu-settings>
  <ix-menu-settings-item tab-key="tab-1" label="Tab 1">Content 1</ix-menu-settings-item>
</ix-menu-settings>
```

```html
<!-- Before -->
<ix-menu-about-news about-item-label="Tab 1">
  News content
</ix-menu-about-news>

<!-- After -->
<ix-menu-about-news active-about-tab-key="tab-1">
  News content
</ix-menu-about-news>
```
