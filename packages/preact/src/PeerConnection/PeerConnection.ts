interface CandidateMessage {
  topic: string
  candidate: RTCIceCandidate
}

interface AnswerMessage {
  topic: string
  description: RTCSessionDescription
}
interface OfferMessage {
  topic: string
  description: RTCSessionDescription
}

interface IPeerConnection {}

export interface ISignaler {
  send(data: string): void
  addEventListener(
    type: 'message',
    handler: (event: MessageEvent<any>) => void
  ): void
  removeEventListener(
    type: 'message',
    handler: (event: MessageEvent<any>) => void
  ): void
}

export class PeerConnection implements IPeerConnection {
  private topic: string
  private remoteMedia: MediaStream = new MediaStream()
  private connection: RTCPeerConnection
  private hub: ISignaler
  private awaitable: Promise<PeerConnection>
  private onStreamUpdate?: (stream: MediaStream) => void

  constructor(hub: ISignaler, topic: string, configuration?: RTCConfiguration) {
    this.hub = hub
    this.topic = topic
    configuration = configuration || {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    }
    console.log(
      'Establishing peer connection with configuration',
      configuration
    )
    this.connection = new RTCPeerConnection(configuration)
    this.connection.onicecandidate = ({ candidate }) => {
      if (!candidate) return
      const message: CandidateMessage = {
        topic: this.topic,
        candidate,
      }
      this.hub.send(JSON.stringify(message))
    }
    this.connection.ontrack = this.onTrack
    this.connection.onnegotiationneeded = this.sendANewOffer
    this.hub.addEventListener('message', this.onMessage)
    this.awaitable = new Promise((resolve, reject) => {
      const onSignalingStateChange = () => {
        switch (this.connection.signalingState) {
          case 'stable':
            resolve(this)
            this.connection.removeEventListener(
              'signalingstatechange',
              onSignalingStateChange
            )
            return
          case 'closed':
            reject(new Error('could not connect'))
            this.connection.removeEventListener(
              'signalingstatechange',
              onSignalingStateChange
            )
            return
        }
      }
      this.connection.addEventListener(
        'signalingstatechange',
        onSignalingStateChange
      )
    })
    this.sendANewOffer()
  }

  public async asPromise() {
    return await this.awaitable
  }

  public dispose() {
    this.hub.removeEventListener('message', this.onMessage)
    this.connection.close()
  }

  public async addTrack(track: MediaStreamTrack) {
    await this.asPromise()
    this.connection.addTrack(track)
  }

  private onTrack = (event: RTCTrackEvent) => {
    const { streams, track } = event
    if (streams && streams.length) {
      // Do nothing
    } else {
      this.remoteMedia.addTrack(track)
      this.onStreamUpdate && this.onStreamUpdate(this.remoteMedia)
    }
  }

  public getRemoteStream() {
    return this.remoteMedia
  }

  public onRemoteStreamUpdate(callback: (stream: MediaStream) => void) {
    this.onStreamUpdate = callback
  }

  private sendANewOffer = async () => {
    const offer = await this.connection.createOffer()
    await this.connection.setLocalDescription(offer)
    if (!this.connection.localDescription) return
    const message: OfferMessage = {
      topic: this.topic,
      description: this.connection.localDescription,
    }
    this.hub.send(JSON.stringify(message))
  }

  private onMessage = (evt: MessageEvent<string>) => {
    const data = JSON.parse(evt.data)
    if (this.isCandidateMessageEvent(data)) {
      return this.onRemoteCadidateReceived(data)
    }
    if (this.isOfferMessageEvent(data)) {
      return this.onOfferReceived(data)
    }
    if (this.isAnswerMessageEvent(data)) {
      return this.onAnswerReceived(data)
    }
  }

  private isCandidateMessageEvent(data: any): data is CandidateMessage {
    return data?.topic === this.topic && !!data.candidate
  }

  private async onRemoteCadidateReceived(message: CandidateMessage) {
    await this.connection.addIceCandidate(message.candidate)
  }

  private isOfferMessageEvent(data: any): data is OfferMessage {
    return data?.topic === this.topic && data?.description?.type === 'offer'
  }

  private async onOfferReceived(offer: OfferMessage) {
    await this.connection.setRemoteDescription(offer.description)
    const answer = await this.connection.createAnswer()
    await this.connection.setLocalDescription(answer)
    if (!this.connection.localDescription) return
    const message: AnswerMessage = {
      topic: this.topic,
      description: this.connection.localDescription,
    }
    this.hub.send(JSON.stringify(message))
  }

  private isAnswerMessageEvent(data: any): data is OfferMessage {
    return data?.topic === this.topic && data?.description?.type === 'answer'
  }

  private async onAnswerReceived(answer: OfferMessage) {
    await this.connection.setRemoteDescription(answer.description)
  }
}
