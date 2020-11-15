import { VideoAsset } from './video'
import { getId } from '../ids'
import { IAsset } from './types'

export class CameraAsset implements IAsset<HTMLVideoElement> {
  public id: string
  public width: number = 0
  public height: number = 0
  public bucketId: string

  public node: HTMLVideoElement
  private video: VideoAsset
  private mediaStream?: MediaStream

  constructor(bucketId: string, id?: string) {
    this.id = id || getId()
    this.bucketId = bucketId
    this.video = new VideoAsset(this.bucketId, this.id + '_output')
    this.node = this.video.node
  }

  async load(constraints: MediaTrackConstraints) {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: constraints,
    })
    this.node.addEventListener('playing', this.onPlaying)
    this.node.srcObject = this.mediaStream
  }

  onPlaying = () => {
    this.width = this.node.videoWidth
    this.height = this.node.videoHeight
  }

  dispose() {
    this.node.removeEventListener('playing', this.onPlaying)
    this.video.dispose()
    this.mediaStream?.getTracks().forEach((t) => t.stop())
  }
}
