/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iconInfo } from '@siemens/ix-icons/icons';
import './pill-variants.scoped.css';

import { IxCol, IxLayoutGrid, IxPill, IxRow } from '@siemens/ix-react';

const PILL_VARIANTS = [
  { variant: 'primary' as const, label: 'Primary' },
  { variant: 'alarm' as const, label: 'Alarm' },
  { variant: 'critical' as const, label: 'Critical' },
  { variant: 'warning' as const, label: 'Warning' },
  { variant: 'info' as const, label: 'Info' },
  { variant: 'neutral' as const, label: 'Neutral' },
  { variant: 'success' as const, label: 'Success' },
];

const CUSTOM_PILL_PROPS = {
  variant: 'custom' as const,
  pillColor: 'white',
  background: 'purple',
  icon: iconInfo,
};

export default () => {
  return (
    <>
      <IxLayoutGrid>
        {PILL_VARIANTS.map(({ variant, label }) => (
          <IxRow key={variant}>
            <IxCol>
              <IxPill variant={variant} icon={iconInfo}>
                {label}
              </IxPill>
            </IxCol>
            <IxCol>
              <IxPill variant={variant} outline icon={iconInfo}>
                {label}
              </IxPill>
            </IxCol>
          </IxRow>
        ))}

        <IxRow>
          <IxCol>
            <IxPill {...CUSTOM_PILL_PROPS}>Custom</IxPill>
          </IxCol>
          <IxCol>
            <IxPill {...CUSTOM_PILL_PROPS} outline>
              Custom
            </IxPill>
          </IxCol>
        </IxRow>
      </IxLayoutGrid>
    </>
  );
};
