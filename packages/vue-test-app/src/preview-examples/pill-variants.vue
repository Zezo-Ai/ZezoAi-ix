<!--
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
-->

<script setup lang="ts">
import { iconInfo } from '@siemens/ix-icons/icons';
import { IxCol, IxLayoutGrid, IxPill, IxRow } from '@siemens/ix-vue';

const pillVariants = [
  { variant: 'primary' as const, label: 'Primary' },
  { variant: 'alarm' as const, label: 'Alarm' },
  { variant: 'critical' as const, label: 'Critical' },
  { variant: 'warning' as const, label: 'Warning' },
  { variant: 'info' as const, label: 'Info' },
  { variant: 'neutral' as const, label: 'Neutral' },
  { variant: 'success' as const, label: 'Success' },
];
</script>

<style scoped src="./pill-variants.css"></style>

<template>
  <IxLayoutGrid>
    <IxRow v-for="row in pillVariants" :key="row.variant">
      <IxCol>
        <IxPill :variant="row.variant" :icon="iconInfo">{{ row.label }}</IxPill>
      </IxCol>
      <IxCol>
        <IxPill :variant="row.variant" outline :icon="iconInfo">
          {{ row.label }}
        </IxPill>
      </IxCol>
    </IxRow>

    <IxRow>
      <IxCol>
        <IxPill
          variant="custom"
          pill-color="white"
          background="purple"
          :icon="iconInfo"
        >
          Custom
        </IxPill>
      </IxCol>
      <IxCol>
        <IxPill
          variant="custom"
          outline
          pill-color="white"
          background="purple"
          :icon="iconInfo"
        >
          Custom
        </IxPill>
      </IxCol>
    </IxRow>
  </IxLayoutGrid>
</template>
