import { EventCallback } from './events'

export type RevokeListener = () => void

export interface Renderable {
  id: string
  width: number
  height: number
}

export interface Disposable {
  dispose(): void
}

export interface IInput extends Renderable, Disposable {
  pull(): CanvasImageSource
  on(type: 'frame', callback: EventCallback<'frame'>): RevokeListener
}

export interface IOutput extends Renderable {
  push(media: CanvasImageSource): void
  on(type: 'resize', callback: EventCallback<'resize'>): RevokeListener
}

export type Mixer = {
  bucketId?: string
  on(
    type: 'resize' | 'frame' | 'stat',
    callback: EventCallback<'resize' | 'frame' | 'stat'>
  ): RevokeListener
  pull(): CanvasImageSource | null | undefined
  push(media: CanvasImageSource): void
  setInput(input: IInput): Mixer
  setOuput(output: IOutput): Mixer
}
