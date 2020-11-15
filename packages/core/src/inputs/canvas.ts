import { CanvasAsset } from 'core/src/assets/canvas'
import { EventCallback, EventHub } from '../events'
import { getId } from '../ids'
import { IInput } from '../types'

export class CanvasInput implements IInput {
  public id: string
  private asset: CanvasAsset
  private events = new EventHub('frame')

  constructor(canvasAsset: CanvasAsset, id?: string) {
    this.id = id || getId()
    this.asset = canvasAsset
  }

  public pull() {
    return this.asset.node
  }

  public on = (type: 'frame', callback: EventCallback<'frame'>) => {
    this.events.addEventListener(type, callback)
    return () => this.events.removeEventListener(type, callback)
  }

  get width() {
    return this.asset.width
  }

  get height() {
    return this.asset.width
  }

  public dispose() {
    this.asset.dispose()
  }
}
