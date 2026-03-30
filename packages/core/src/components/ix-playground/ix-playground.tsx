import { Component, Host, h } from '@stencil/core';
import { toast } from 'src/public-api';

@Component({
  tag: 'ix-playground',
  styleUrl: 'ix-playground.scss',
  shadow: true,
})
export class IxPlayground {
  showToast() {
    toast({
      message: 'This is a toast message',
      autoClose: false,
    });
  }
  render() {
    return (
      <Host>
        <button onClick={() => this.showToast()}>Show Toast</button>
      </Host>
    );
  }
}
