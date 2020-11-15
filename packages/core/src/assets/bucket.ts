import { IAsset } from './types'
import { getId } from '../ids'

interface HTMLBucket extends HTMLDivElement {
  bucket?: AssetBucket
}

function isHTMLBucket(element: HTMLElement | null): element is HTMLBucket {
  return !!(element as any).bucket
}

export class AssetBucket {
  private assetRegistryIndex: string[] = []
  private assetRegistry: Record<string, IAsset> = {}
  private host: HTMLBucket

  public constructor(mountPoint: HTMLElement, id?: string) {
    const bucket: HTMLBucket = document.createElement('div')
    bucket.id = id || getId()
    bucket.style.position = 'absolute'
    bucket.style.overflow = 'hidden'
    bucket.style.zIndex = '1'
    bucket.style.width = '1px'
    bucket.style.height = '1px'
    this.host = bucket
    this.host.bucket = this
    mountPoint.appendChild(this.host)
  }

  register(asset: IAsset) {
    this.unregister(asset)
    this.assetRegistryIndex.push(asset.id)
    this.assetRegistry[asset.id] = asset
    this.host.appendChild(asset.node)
  }

  unregister(asset: IAsset) {
    var currentIndex = this.assetRegistryIndex.indexOf(asset.id)
    if (currentIndex > -1) {
      this.assetRegistryIndex.splice(currentIndex, 1)
      this.host.removeChild(this.assetRegistry[asset.id].node)
    }
  }

  static getBucketById(id: string) {
    const html = document.getElementById(id)
    if (isHTMLBucket(html)) {
      return html.bucket
    }
    return null
  }
}
