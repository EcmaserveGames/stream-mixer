export interface IAsset<T extends HTMLElement = HTMLElement> {
  id: string
  node: T
  width: number
  height: number
  bucketId: string
  dispose(): void
}
