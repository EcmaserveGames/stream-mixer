import { getId } from '@ecmaservegames/stream-mixer-core'
import { ISignaler } from '../src/PeerConnection/PeerConnection'

export class BroadcastSignaler implements ISignaler {
  private channel: BroadcastChannel
  constructor() {
    this.channel = new BroadcastChannel(getId())
  }
  send(data: string): void {
    this.channel.postMessage(data)
  }
  addEventListener(
    type: 'message',
    handler: (event: MessageEvent<any>) => void
  ): void {
    this.channel.addEventListener(type, handler)
  }
  removeEventListener(
    type: 'message',
    handler: (event: MessageEvent<any>) => void
  ): void {
    this.channel.removeEventListener(type, handler)
  }
}
