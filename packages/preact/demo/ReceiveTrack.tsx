import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

interface Props {
  stream: MediaStream | undefined
}

export function ReceiveTrack(props: Props) {
  const ref = useRef<HTMLVideoElement>()
  useEffect(() => {
    if (!ref.current || !props.stream) return
    ref.current.srcObject = props.stream
    ref.current.play()
  }, [ref, props])

  return (
    <div>
      Received From Other Tab
      <div>
        <video ref={ref}></video>
      </div>
    </div>
  )
}
