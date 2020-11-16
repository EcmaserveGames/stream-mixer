import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useStreamMixer } from '../src'
import { PeerConnection } from '../src/PeerConnection/PeerConnection'

interface Props {
  connection: PeerConnection
}

export function SendTrack({ connection }: Props) {
  const strmix = useStreamMixer()
  const ref = useRef<HTMLCanvasElement>()
  useEffect(() => {
    if (!ref.current) return
    const input = strmix.createCameraInput({})
    const output = strmix.createOutput(128, 128, ref.current)
    const connector = strmix.createConnector()
    connector.setInput(input)
    connector.setOuput(output)

    const stream: MediaStream = (ref.current as any).captureStream(20)
    stream.getVideoTracks().forEach((t) => connection.addTrack(t))

    return () => {
      input.dispose()
      connector.dispose()
    }
  }, [ref, connection])

  return (
    <div>
      My Tab
      <div>
        <canvas ref={ref}></canvas>
      </div>
    </div>
  )
}
