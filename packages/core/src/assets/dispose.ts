import { IAsset } from './types'
import { AssetBucket } from './bucket'

export function dispose(asset: IAsset) {
  if (asset.bucketId) {
    const bucket = AssetBucket.getBucketById(asset.bucketId)
    bucket?.unregister(asset)
  }
}
