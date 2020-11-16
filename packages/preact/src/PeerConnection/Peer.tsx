import { Component, h } from 'preact'
import { ISignaler, PeerConnection } from './PeerConnection'

interface Props {
  channel: ISignaler
  topic: string
  children?: (context: {
    connection: PeerConnection
    stream?: MediaStream
  }) => preact.JSX.Element
}

interface State {
  readyToSend: boolean
  stream?: MediaStream
}

export class Peer extends Component<Props, State> {
  private connection: PeerConnection
  public state: State = { readyToSend: false }

  public constructor(props: Props) {
    super(props)
    this.connection = new PeerConnection(props.channel, props.topic)
    this.connection.asPromise().then(() => this.setState({ readyToSend: true }))
    this.connection.onRemoteStreamUpdate((stream) => {
      this.setState({ stream })
    })
  }

  public render() {
    if (!this.props.children) {
      return null
    }
    if (!this.state.readyToSend) {
      return <div>Connecting to Peer</div>
    }
    return this.props.children({
      connection: this.connection,
      stream: this.state.stream,
    })
  }
}
