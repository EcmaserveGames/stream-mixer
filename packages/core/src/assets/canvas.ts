import { getId } from '../ids'
import { AssetBucket } from './bucket'
import { IAsset } from './types'

export class CanvasAsset implements IAsset {
  public id: string
  public node: HTMLCanvasElement
  public bucketId: string

  get width() {
    return this.node.width
  }

  get height() {
    return this.node.height
  }

  public constructor(bucketId: string, id?: string) {
    this.id = id || getId()
    var canvas = document.createElement('canvas')
    canvas.id = this.id
    this.node = canvas
    this.bucketId = bucketId
  }

  async load(width: number, height: number) {
    const bucket = AssetBucket.getBucketById(this.bucketId)
    this.node.height = height
    this.node.width = width
    bucket?.register(this)
    return this
  }

  dispose() {
    const bucket = AssetBucket.getBucketById(this.bucketId)
    bucket?.unregister(this)
  }
}
