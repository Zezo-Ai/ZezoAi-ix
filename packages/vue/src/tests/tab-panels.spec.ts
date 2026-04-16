/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { IxTabItem, IxTabs } from '../components';
import { IxTabPanel, IxTabPanels } from '../tab-panels';

describe('IxTabPanels', () => {
  it('renders only the active tab panel content', async () => {
    const onMount = vi.fn();
    const onUnmount = vi.fn();

    const TabContent = defineComponent({
      name: 'TabContent',
      props: {
        label: {
          type: String,
          required: true,
        },
      },
      setup(props) {
        onMounted(() => onMount(props.label));
        onUnmounted(() => onUnmount(props.label));

        return () => h('div', props.label);
      },
    });

    const Example = defineComponent({
      name: 'TabPanelsExample',
      setup() {
        const activeTabKey = ref('tab-2');

        return { activeTabKey };
      },
      components: {
        IxTabItem,
        IxTabPanel,
        IxTabPanels,
        IxTabs,
        TabContent,
      },
      template: `
        <button @click="activeTabKey = 'tab-1'">Open Tab 1</button>
        <IxTabPanels>
          <IxTabs :activeTabKey="activeTabKey">
            <IxTabItem tabKey="tab-1" label="Tab 1"></IxTabItem>
            <IxTabItem tabKey="tab-2" label="Tab 2"></IxTabItem>
            <IxTabItem tabKey="tab-3" label="Tab 3"></IxTabItem>
          </IxTabs>

          <IxTabPanel tabKey="tab-1">
            <TabContent label="Content 1" />
          </IxTabPanel>
          <IxTabPanel tabKey="tab-2">
            <TabContent label="Content 2" />
          </IxTabPanel>
          <IxTabPanel tabKey="tab-3">
            <TabContent label="Content 3" />
          </IxTabPanel>
        </IxTabPanels>
      `,
    });

    const screen = render(Example);

    expect(onMount).toHaveBeenCalledWith('Content 2');
    expect(screen.queryByText('Content 1')).toBeNull();
    expect(screen.getByText('Content 2')).not.toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();

    await fireEvent.click(screen.getByText('Open Tab 1'));

    expect(onUnmount).toHaveBeenCalledWith('Content 2');
    expect(onMount).toHaveBeenCalledWith('Content 1');
    expect(screen.getByText('Content 1')).not.toBeNull();
    expect(screen.queryByText('Content 2')).toBeNull();
  });
});
