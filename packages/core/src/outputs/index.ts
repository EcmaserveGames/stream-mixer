import { EventCallback, EventHub } from '../events'
import { getId } from '../ids'
import { IOutput } from '../types'

function isCanvasElement(node: HTMLElement | null): node is HTMLCanvasElement {
  return node?.tagName === 'CANVAS'
}

export class Output implements IOutput {
  public id: string
  private events = new EventHub('resize')
  private canvas?: HTMLCanvasElement

  constructor(width: number, height: number, id?: string) {
    this.id = id || getId()
    const element = document.getElementById(this.id)
    if (isCanvasElement(element)) {
      this.canvas = element
      this.resize(width, height)
    }
  }

  get width() {
    return this.canvas?.width || 0
  }

  get height() {
    return this.canvas?.height || 0
  }

  resize(width: number, height: number) {
    if (this.canvas) {
      this.canvas.width = width
      this.canvas.height = height
      this.events.dispatchEvent('resize', this, { width, height })
    }
  }

  on(type: 'resize', callback: EventCallback<'resize'>) {
    this.events.addEventListener(type, callback)
    return () => this.events.removeEventListener(type, callback)
  }

  push(media: CanvasImageSource) {
    if (!media.width || !media.height) {
      console.log('Output > Input has no data')
      return
    }
    var ctx = this.canvas?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, this.width, this.height)
      ctx.drawImage(media, 0, 0)
    }
  }
}
