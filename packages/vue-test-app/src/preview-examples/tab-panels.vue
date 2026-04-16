<!--
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
-->

<script setup lang="ts">
import { IxTabItem, IxTabPanel, IxTabPanels, IxTabs } from '@siemens/ix-vue';
import { ref } from 'vue';

const activeTabKey = ref('tab-2');

const setActiveTabKey = (event: CustomEvent<string | undefined>) => {
  activeTabKey.value = event.detail ?? 'tab-1';
};
</script>

<template>
  <IxTabPanels>
    <IxTabs
      :activeTabKey="activeTabKey"
      layout="auto"
      @tabChange="setActiveTabKey"
    >
      <IxTabItem tabKey="tab-1" label="Tab 1"></IxTabItem>
      <IxTabItem tabKey="tab-2" label="Tab 2"></IxTabItem>
      <IxTabItem tabKey="tab-3" label="Tab 3"></IxTabItem>
    </IxTabs>

    <IxTabPanel tabKey="tab-1">
      <div>Content 1</div>
    </IxTabPanel>
    <IxTabPanel tabKey="tab-2">
      <div>Content 2</div>
    </IxTabPanel>
    <IxTabPanel tabKey="tab-3">
      <div>Content 3</div>
    </IxTabPanel>
  </IxTabPanels>
</template>
