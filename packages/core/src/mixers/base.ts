import { EventCallback, EventHub, StreamEvent } from '../events'
import { getId } from '../ids'
import { IInput, IOutput, Mixer, RevokeListener } from '../types'

export class BaseMixer implements Mixer {
  public id: string
  public width: number = 0
  public height: number = 0
  public bucketId?: string

  public events = new EventHub('resize', 'frame')
  public input?: IInput
  public output?: IOutput
  public onInputFrame: EventCallback<'frame'>
  public onOutputResize: EventCallback<'resize'>

  private revokables: RevokeListener[] = []

  constructor(bucketId: string, id?: string) {
    this.id = id || getId()
    this.bucketId = bucketId
    this.onInputFrame = (evt: StreamEvent<any>) => {
      if (evt.source === this) return
      this.events.dispatchEvent('frame', this, evt.data)
    }
    this.onOutputResize = (evt: StreamEvent<any>) => {
      if (evt.source === this) return
      this.events.dispatchEvent('resize', this, evt.data)
    }
  }

  public pull() {
    return this.input?.pull()
  }

  public on(
    type: 'frame' | 'resize',
    callback: EventCallback<'frame' | 'resize'>
  ) {
    this.events.addEventListener(type, callback)
    return () => this.events.removeEventListener(type, callback)
  }

  public dispose() {
    this.revokables.forEach((revoke) => revoke())
  }

  public push(media: CanvasImageSource) {
    this.output?.push(media)
  }

  public setInput(input: IInput) {
    this.input = input
    const revoke = input.on('frame', this.onInputFrame)
    this.revokables.push(revoke)
    return this
  }

  public setOuput(output: IOutput) {
    this.output = output
    const revoke = output.on('resize', this.onOutputResize)
    this.revokables.push(revoke)
    return this
  }
}
