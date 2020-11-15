import { CanvasAsset } from '../assets/canvas'
import { StreamEvent } from '../events'
import { BaseMixer } from './base'

interface Dimensions {
  w: number
  h: number
}

export enum ScaleMode {
  Fill = 'fill',
  Fit = 'Fit',
}

export function isResizeStat(
  evt: StreamEvent<'stat' | 'frame' | 'resize'>
): evt is StreamEvent<'stat', ResizeStats> {
  if (evt.source instanceof ResizeMixer && evt.type === 'stat') {
    return true
  }
  return false
}

export interface ResizeStats {
  mode: ScaleMode
  source: Dimensions
  destination: Dimensions
  scaling: [number, number, number, number]
}

export class ResizeMixer extends BaseMixer {
  private scaleMode: ScaleMode
  private canvas: CanvasAsset
  private lastStats?: ResizeStats

  constructor(
    bucketId: string,
    id?: string,
    scaleMode: ScaleMode = ScaleMode.Fit
  ) {
    super(bucketId, id)
    this.canvas = new CanvasAsset(bucketId)
    this.scaleMode = scaleMode
    this.onInputFrame = (evt) => {
      if (evt.source === this) return
      const inputMedia = this.input?.pull()
      if (!inputMedia) return
      const result = this.draw(inputMedia)
      if (result) {
        this.output?.push(this.canvas.node)
      }
    }
    this.onOutputResize = (evt) => {
      const inputMedia = this.input?.pull()
      if (!inputMedia) return
      const result = this.draw(inputMedia)
      if (result) {
        this.output?.push(this.canvas.node)
      }
    }
    this.onInputAttached = this.attachment
    this.onOutputAttached = (output) => {
      this.width = output.width
      this.height = output.height
      this.attachment()
    }
  }

  private attachment = () => {
    if (!this.input || !this.output) return

    this.canvas.load(this.output.width, this.output.height)
    const result = this.draw(this.input.pull())
    if (result) {
      this.output.push(this.canvas.node)
    }
  }

  public pull() {
    return this.canvas.node
  }

  public push(inputMedia: CanvasImageSource) {
    const result = this.draw(inputMedia)
    if (result) {
      this.output?.push(this.canvas.node)
    }
  }

  private draw(inputMedia: CanvasImageSource) {
    if (!this.input) return false
    if (!this.output) return false
    const cannotDrawYet =
      !this.input.height ||
      !this.input.width ||
      !this.output.height ||
      !this.output.width
    if (cannotDrawYet) return false
    var ctx = this.canvas.node.getContext('2d')
    if (!ctx) return false

    // Run scaling
    var source = {
      w: this.input.width,
      h: this.input.height,
    }
    var destination = {
      w: this.output.width,
      h: this.output.height,
    }
    var scaling =
      this.scaleMode === ScaleMode.Fill
        ? this.fill(source, destination)
        : this.fit(source, destination)

    ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(
      inputMedia,
      0,
      0,
      this.input.width,
      this.input.height,
      ...scaling
    )
    this.lastStats = {
      mode: this.scaleMode,
      source,
      destination,
      scaling,
    }
    this.events.dispatchEvent('stat', this, this.lastStats)
    return true
  }

  private fill(
    source: Dimensions,
    destination: Dimensions
  ): [number, number, number, number] {
    let delta = 1
    let axis: 'x' | 'y' = 'x'
    let offsetX = 0
    let offsetY = 0

    var xGapScale = (source.w - destination.w) / source.w
    var yGapScale = (source.h - destination.h) / source.h

    if (yGapScale < xGapScale) {
      axis = 'y'
      delta = destination.h / source.h
    } else {
      axis = 'x'
      delta = destination.w / source.w
    }

    var scaled = {
      width: source.w * delta,
      height: source.h * delta,
    }

    if (axis === 'y') {
      offsetX = (destination.w - scaled.width) / 2
    } else {
      offsetY = (destination.h - scaled.height) / 2
    }

    return [offsetX, offsetY, scaled.width, scaled.height]
  }

  private fit(
    source: Dimensions,
    destination: Dimensions
  ): [number, number, number, number] {
    const inputAspect = source.w / source.h
    const frameAspect = destination.w / destination.h
    let delta = 1
    let axis: 'x' | 'y' = 'x'
    let offsetX = 0
    let offsetY = 0

    if (frameAspect > inputAspect) {
      axis = 'y'
      delta = destination.h / source.h
    } else {
      axis = 'x'
      delta = destination.w / source.w
    }

    var scaled = {
      width: source.w * delta,
      height: source.h * delta,
    }

    if (axis === 'y') {
      offsetX = (destination.w - scaled.width) / 2
    } else {
      offsetY = (destination.h - scaled.height) / 2
    }

    return [offsetX, offsetY, scaled.width, scaled.height]
  }
}
