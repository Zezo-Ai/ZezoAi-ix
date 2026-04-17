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
import { html } from 'lit';
import { action } from 'storybook/actions';
import { makeArgTypes } from './utils/generic-render';

type Element = Components.IxTabPanels;

const meta = {
  title: 'Example/Tab Panels',
  tags: [],
  render: () => html`
    <ix-tab-panels>
      <ix-tabs active-tab-key="overview" @tabChange=${action('tabChange')}>
        <ix-tab-item tab-key="overview" label="Overview"></ix-tab-item>
        <ix-tab-item tab-key="analytics" label="Analytics"></ix-tab-item>
        <ix-tab-item tab-key="events" label="Events"></ix-tab-item>
      </ix-tabs>
      <ix-tab-panel tab-key="overview">Overview content</ix-tab-panel>
      <ix-tab-panel tab-key="analytics">Analytics content</ix-tab-panel>
      <ix-tab-panel tab-key="events">Events content</ix-tab-panel>
    </ix-tab-panels>
  `,
  argTypes: makeArgTypes<Partial<ArgTypes<Element>>>('ix-tab-panels'),
} satisfies Meta<Element>;

export default meta;
type Story = StoryObj<Element>;

export const Default: Story = {};

export const SecondTabActive: Story = {
  render: () => html`
    <ix-tab-panels>
      <ix-tabs active-tab-key="analytics" @tabChange=${action('tabChange')}>
        <ix-tab-item tab-key="overview" label="Overview"></ix-tab-item>
        <ix-tab-item tab-key="analytics" label="Analytics"></ix-tab-item>
        <ix-tab-item tab-key="events" label="Events"></ix-tab-item>
      </ix-tabs>
      <ix-tab-panel tab-key="overview">Overview content</ix-tab-panel>
      <ix-tab-panel tab-key="analytics">Analytics content</ix-tab-panel>
      <ix-tab-panel tab-key="events">Events content</ix-tab-panel>
    </ix-tab-panels>
  `,
};

export const WithRichContent: Story = {
  render: () => html`
    <ix-tab-panels>
      <ix-tabs active-tab-key="details" @tabChange=${action('tabChange')}>
        <ix-tab-item tab-key="details" label="Details"></ix-tab-item>
        <ix-tab-item tab-key="configuration" label="Configuration"></ix-tab-item>
      </ix-tabs>
      <ix-tab-panel tab-key="details">
        <h3>Device Details</h3>
        <p>This panel shows detailed information about the selected device.</p>
        <ix-button>Edit</ix-button>
      </ix-tab-panel>
      <ix-tab-panel tab-key="configuration">
        <h3>Configuration</h3>
        <ix-input-group>
          <input placeholder="Enter value" />
        </ix-input-group>
      </ix-tab-panel>
    </ix-tab-panels>
  `,
};
