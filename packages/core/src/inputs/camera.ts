import { CameraAsset } from 'core/src/assets/camera'
import { EventCallback, EventHub } from '../events'
import { getId } from '../ids'
import { IInput } from '../types'

export class CameraInput implements IInput {
  public id: string
  private frameRate: number = 0
  private asset: CameraAsset
  private events = new EventHub('frame')

  public constructor(
    id: string,
    cameraAsset: CameraAsset,
    frameRate: number = 0
  ) {
    this.id = id || getId()
    this.asset = cameraAsset
    this.frameRate = frameRate
  }

  get width() {
    return this.asset.width
  }

  get height() {
    return this.asset.width
  }

  private run = () => {
    if (!this.asset.node.paused) {
      this.events.dispatchEvent('frame', this)
    }
    setTimeout(this.run, this.frameRate)
  }

  public on(type: 'frame', callback: EventCallback<'frame'>) {
    this.events.addEventListener(type, callback)
    return () => this.events.removeEventListener(type, callback)
  }

  public pull() {
    return this.asset.node
  }

  public dispose() {
    this.asset.dispose()
  }
}
