/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IxTabItem, IxTabPanel, IxTabPanels, IxTabs } from '@siemens/ix-react';
import { useLayoutEffect, useState } from 'react';

function TabContent(prop: { label: string }) {
  useLayoutEffect(() => {
    console.log('TabContent mounted with label:', prop.label);

    return () => {
      console.log('TabContent unmounted with label:', prop.label);
    };
  }, [prop.label]);

  return <div>{prop.label}</div>;
}

export default function TabPanels() {
  const [activeTabKey, setActiveTabKey] = useState('tab-2');

  return (
    <IxTabPanels>
      <IxTabs
        activeTabKey={activeTabKey}
        layout="auto"
        onTabChange={({ detail }) => setActiveTabKey(detail ?? 'tab-1')}
      >
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
  );
}
