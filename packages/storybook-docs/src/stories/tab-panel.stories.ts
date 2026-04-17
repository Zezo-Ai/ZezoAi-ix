/*
 * SPDX-FileCopyrightText: 2026 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Components } from '@siemens/ix/components';
import type { ArgTypes, Meta, StoryObj } from '@storybook/web-components-vite';
import {
  GenericRenderComponent,
  genericRender,
  makeArgTypes,
} from './utils/generic-render';

type Element = Components.IxTabPanel;
type Args = GenericRenderComponent<Element, {}>;

const meta = {
  title: 'Example/Tab Panel',
  tags: [],
  render: (args) =>
    genericRender('ix-tab-panel', args, [], (element) => {
      element.setAttribute('tab-key', args.tabKey ?? 'panel-1');
      return element;
    }),
  argTypes: makeArgTypes<Partial<ArgTypes<Element>>>('ix-tab-panel'),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    tabKey: 'panel-1',
    defaultSlot: 'Panel content goes here',
  },
};
