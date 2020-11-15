import { h, Component } from 'preact'
import { StreamMixerContext } from './Context'
import {
  AssetBucket,
  CameraAsset,
  CameraInput,
  getId,
  Output,
  ScaleMode,
  ResizeMixer,
} from '@ecmaservegames/stream-mixer-core'

interface State {
  loadingDevices: boolean
  devices?: MediaDeviceInfo[]
}

export class StreamMixerProvider extends Component<{}, State> {
  public state: State = {
    loadingDevices: true,
  }

  private bucketId = 'stream-mixer-preact-asset-bucket'
  private bucket: AssetBucket

  constructor(props: {}) {
    super(props)
    this.bucket = new AssetBucket(document.body, this.bucketId)
    this.requestDevices()
  }

  public render() {
    return (
      <StreamMixerContext.Provider
        value={{
          devicesLoading: this.state.loadingDevices,
          createResizeMixer: this.createResizeMixer,
          createOutput: this.createOutput,
          createCameraInput: this.createCameraInput,
        }}
      >
        {this.props.children}
      </StreamMixerContext.Provider>
    )
  }

  private async requestDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    this.setState({ devices, loadingDevices: false }, () =>
      console.log(this.state)
    )
  }

  private createCameraInput = async (
    cameraConstraints: MediaTrackConstraints,
    fps: number = 30
  ) => {
    const cameraAsset = new CameraAsset(this.bucketId)
    const cameraInput = new CameraInput('this-should-change', cameraAsset, fps)
    await cameraAsset.load(cameraConstraints)
    return cameraInput
  }

  private createOutput = (
    width: number,
    height: number,
    canvas: HTMLCanvasElement
  ) => {
    canvas.id = canvas.id || getId()
    return new Output(width, height, canvas.id)
  }

  private createResizeMixer = (scaleMode: ScaleMode = ScaleMode.Fill) => {
    return new ResizeMixer(this.bucketId, getId(), scaleMode)
  }
}
