import { CameraAsset } from '../assets/camera'
import { EventCallback, EventHub } from '../events'
import { getId } from '../ids'
import { IInput } from '../types'

export class CameraInput implements IInput {
  public id: string
  private fps: number = 0
  private asset: CameraAsset
  private events = new EventHub('frame')

  public constructor(id: string, cameraAsset: CameraAsset, fps: number = 30) {
    this.id = id || getId()
    this.asset = cameraAsset
    this.fps = fps
    this.run()
  }

  get width() {
    return this.asset.width
  }

  get height() {
    return this.asset.height
  }

  private run = () => {
    if (!this.asset.node.paused) {
      this.events.dispatchEvent('frame', this)
    }
    setTimeout(this.run, 1000 / this.fps)
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
