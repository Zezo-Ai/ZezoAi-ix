import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ix-playground',
  styleUrl: 'ix-playground.scss',
  shadow: true,
})
export class IxPlayground {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
