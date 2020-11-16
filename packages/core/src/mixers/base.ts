import { EventCallback, EventHub, StreamEvent } from '../events'
import { getId } from '../ids'
import { IInput, IOutput, Mixer, RevokeListener } from '../types'

export class BaseMixer implements Mixer {
  public id: string
  public width: number = 0
  public height: number = 0
  public bucketId?: string

  public events = new EventHub('resize', 'frame', 'stat')
  public input?: IInput
  public output?: IOutput
  public onInputFrame: EventCallback<'frame'>
  public onOutputResize: EventCallback<'resize'>
  public onInputAttached: (input: IInput) => void
  public onOutputAttached: (output: IOutput) => void

  private revokables: RevokeListener[] = []

  constructor(bucketId: string, id?: string) {
    this.id = id || getId()
    this.bucketId = bucketId
    this.onInputFrame = (evt: StreamEvent<any>) => {
      if (evt.source === this) return
      if (!this.input) return
      this.push(this.input.pull())
    }
    this.onOutputResize = (evt: StreamEvent<any>) => {
      if (evt.source === this) return
      this.events.dispatchEvent('resize', this, evt.data)
    }
    this.onInputAttached = () => {}
    this.onOutputAttached = () => {}
  }

  public pull() {
    return this.input?.pull()
  }

  public on(
    type: 'frame' | 'resize' | 'stat',
    callback: EventCallback<'frame' | 'resize' | 'stat'>
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
    this.onInputAttached(input)
    return this
  }

  public setOuput(output: IOutput) {
    this.output = output
    const revoke = output.on('resize', this.onOutputResize)
    this.revokables.push(revoke)
    this.onOutputAttached(output)
    return this
  }
}
