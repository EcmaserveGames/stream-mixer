import { h, Component } from 'preact'
import { useStreamMixer } from '../src'
import { StreamMixerContext } from '../src/Context/Context'
import { Peer } from '../src/PeerConnection/Peer'
import { BroadcastSignaler } from './BroadcastSignaler'
import { ReceiveTrack } from './ReceiveTrack'
import { SendTrack } from './SendTrack'

interface Props {
  context: StreamMixerContext
}

interface State {}

export class InnerWebRtc extends Component<Props, State> {
  public state: State = {}

  public constructor(props: Props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <h1>Peer Connection Test</h1>
        <p>Open page in a new tab to connect.</p>
        <Peer channel={new BroadcastSignaler()} topic="a-to-b">
          {({ connection, stream }) => (
            <div>
              <h3>Connection Open</h3>
              <div style={{ display: 'flex' }}>
                <SendTrack connection={connection} />
                <ReceiveTrack stream={stream} />
              </div>
            </div>
          )}
        </Peer>
        <Peer channel={new BroadcastSignaler()} topic="a1-to-b1">
          {() => <h3>Can have multiple Peers</h3>}
        </Peer>
      </div>
    )
  }
}

export const WebRtc = () => {
  const strmix = useStreamMixer()
  return <InnerWebRtc context={strmix} />
}
