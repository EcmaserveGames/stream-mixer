import { getId } from '../ids'
import { AssetBucket } from './bucket'
import { IAsset } from './types'

export class VideoAsset implements IAsset {
  public id: string
  public node: HTMLVideoElement
  public width: number = 0
  public height: number = 0
  public bucketId: string
  public playing: boolean

  constructor(bucketId: string, id?: string) {
    this.id = id || getId()
    this.playing = false
    this.bucketId = bucketId

    var video = document.createElement('video')
    video.id = this.id
    video.autoplay = true
    video.controls = true
    video.addEventListener('playing', this.onPlaying)
    video.addEventListener('pause', this.onPause)
    this.node = video
    this.initialize()
  }

  private initialize() {
    const bucket = AssetBucket.getBucketById(this.bucketId)
    bucket?.register(this)
  }

  private onPlaying = () => {
    this.width = this.node.videoWidth
    this.height = this.node.videoHeight
    this.playing = true
  }

  private onPause = () => {
    this.playing = false
  }

  public dispose() {
    this.node.removeEventListener('playing', this.onPlaying)
    this.node.removeEventListener('pause', this.onPause)
    const bucket = AssetBucket.getBucketById(this.bucketId)
    bucket?.unregister(this)
  }
}
