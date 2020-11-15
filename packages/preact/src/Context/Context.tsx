import {
  CameraInput,
  Output,
  ResizeMixer,
  ScaleMode,
} from '@ecmaservegames/stream-mixer-core'
import { createContext } from 'preact'

export interface StreamMixerContext {
  devicesLoading: boolean
  createOutput(
    width: number,
    height: number,
    canvas: HTMLCanvasElement
  ): Output | undefined
  createCameraInput(
    videoConstraints: MediaTrackConstraints,
    fps?: number
  ): Promise<CameraInput | undefined>
  createResizeMixer(scaleMode?: ScaleMode): ResizeMixer | undefined
}

export const StreamMixerContext = createContext<StreamMixerContext>({
  devicesLoading: true,
  createCameraInput: () => Promise.resolve(undefined),
  createOutput: () => undefined,
  createResizeMixer: () => undefined,
})
