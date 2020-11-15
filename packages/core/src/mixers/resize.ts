import { CanvasAsset } from 'core/src/assets/canvas'
import { BaseMixer } from './base'

interface Dimensions {
  w: number
  h: number
}

export enum ScaleMode {
  Fill = 'fill',
  Fit = 'Fit',
}

export class ResizeMixer extends BaseMixer {
  private scaleMode: ScaleMode
  private canvas: CanvasAsset
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
      this.draw(inputMedia)
      const result = this.draw(inputMedia)
      if (result) {
        this.output?.push(this.canvas.node)
      }
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
    return true
  }

  private fill(
    source: Dimensions,
    destination: Dimensions
  ): [number, number, number, number] {
    var widthGap = destination.w - source.w
    var heightGap = destination.h - source.h

    var scaledW = source.w
    var scaledH = source.h

    if (widthGap > 0 || heightGap > 0) {
      // Scale Up;
      if (widthGap > heightGap) {
        scaledW = destination.w
        scaledH = (destination.w / source.w) * source.h
      }
      if (widthGap < heightGap) {
        scaledW = (destination.h / source.h) * source.w
        scaledH = destination.h
      }
    }

    if (widthGap < 0 && heightGap < 0) {
      // Scale Down;
      if (widthGap < heightGap) {
        scaledW = destination.w
        scaledH = (destination.w / source.w) * source.h
      }
      if (widthGap > heightGap) {
        scaledW = (destination.h / source.h) * source.w
        scaledH = destination.h
      }
    }

    var sourceX = (destination.w - scaledW) / 2
    var sourceY = (destination.h - scaledH) / 2

    return [sourceX, sourceY, scaledW, scaledH]
  }

  private fit(
    source: Dimensions,
    destination: Dimensions
  ): [number, number, number, number] {
    var widthGap = destination.w - source.w
    var heightGap = destination.h - source.h

    var scaledW = source.w
    var scaledH = source.h

    if (widthGap > 0 || heightGap > 0) {
      // Scale Up;
      if (widthGap < heightGap) {
        scaledW = destination.w
        scaledH = (destination.w / source.w) * source.h
      }
      if (widthGap > heightGap) {
        scaledW = (destination.h / source.h) * source.w
        scaledH = destination.h
      }
    }

    if (widthGap < 0 && heightGap < 0) {
      // Scale Down;
      if (widthGap < heightGap) {
        scaledW = destination.w
        scaledH = (destination.w / source.w) * source.h
      }
      if (widthGap > heightGap) {
        scaledW = (destination.h / source.h) * source.w
        scaledH = destination.h
      }
    }

    var sourceX = (destination.w - scaledW) / 2
    var sourceY = (destination.h - scaledH) / 2

    return [sourceX, sourceY, scaledW, scaledH]
  }
}
