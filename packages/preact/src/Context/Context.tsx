import {
  CameraInput,
  Output,
  ResizeMixer,
  ScaleMode,
  Connector,
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
  ): CameraInput | undefined
  createConnector(): Connector | undefined
  createResizeMixer(scaleMode?: ScaleMode): ResizeMixer | undefined
}

export const StreamMixerContext = createContext<StreamMixerContext>({
  devicesLoading: true,
  createCameraInput: () => undefined,
  createOutput: () => undefined,
  createConnector: () => undefined,
  createResizeMixer: () => undefined,
})
