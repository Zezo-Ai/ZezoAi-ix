/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  IxTabPanels as NativeIxTabPanels,
  IxTabItem,
  IxTabPanel,
  IxTabs,
} from '@siemens/ix-react';
import { useLayoutEffect } from 'react';

function TabContent(prop: { label: string }) {
  useLayoutEffect(() => {
    console.log('TabContent mounted with label:', prop.label);
  }, [prop.label]);

  return <div>{prop.label}</div>;
}

function App() {
  return (
    <div>
      <NativeIxTabPanels>
        <IxTabs activeTabKey="tab-2" layout="auto">
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
      </NativeIxTabPanels>
    </div>
  );
}

export default App;
