import {
  ResizeStats,
  ScaleMode,
  isResizeStat,
} from '@ecmaservegames/stream-mixer-core'
import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useStreamMixer } from '../src'

export function ResizeToFit() {
  const streamMixer = useStreamMixer()
  const ref = useRef<HTMLCanvasElement>()
  const [stat, setStat] = useState<ResizeStats | undefined>(undefined)

  useEffect(() => {
    if (!ref.current) return
    const output = streamMixer.createOutput(64, 64, ref.current)
    const resizer = streamMixer.createResizeMixer(ScaleMode.Fit)
    const revoke = resizer.on('stat', (evt) => {
      if (isResizeStat(evt)) {
        setStat(evt.data)
      }
    })
    const inputResolver = streamMixer
      .createCameraInput(
        {
          width: 640,
          height: 480,
        },
        1
      )
      .then((input) => {
        resizer.setInput(input)
        resizer.setOuput(output)
        return input
      })
    return async () => {
      revoke()
      const input = await inputResolver
      input.dispose()
      resizer.dispose()
    }
  }, [ref, setStat])

  return (
    <div>
      <h1>Resize To Fit</h1>
      <canvas style={{ border: '1px solid green' }} ref={ref} />
      {stat && (
        <ul>
          <li>Input: {JSON.stringify(stat?.source)}</li>
          <li>Mode: {stat?.mode}</li>
          <li>Scaling: {JSON.stringify(stat?.scaling)}</li>
        </ul>
      )}
    </div>
  )
}

export function ResizeToFill() {
  const streamMixer = useStreamMixer()
  const ref = useRef<HTMLCanvasElement>()
  const [stat, setStat] = useState<ResizeStats | undefined>(undefined)

  useEffect(() => {
    if (!ref.current) return
    const output = streamMixer.createOutput(64, 64, ref.current)
    const resizer = streamMixer.createResizeMixer(ScaleMode.Fill)
    const revoke = resizer.on('stat', (evt) => {
      if (isResizeStat(evt)) {
        setStat(evt.data)
      }
    })
    const inputResolver = streamMixer
      .createCameraInput({ width: 640, height: 480 }, 1)
      .then((input) => {
        resizer.setInput(input)
        resizer.setOuput(output)
        return input
      })

    return async () => {
      revoke()
      const input = await inputResolver
      input.dispose()
      resizer.dispose()
    }
  }, [ref, setStat])

  return (
    <div>
      <h1>Resize To Fill</h1>
      <canvas style={{ border: '1px solid green' }} ref={ref} />
      {stat && (
        <ul>
          <li>Mode: {stat?.mode}</li>
          <li>Scaling: {JSON.stringify(stat?.scaling)}</li>
        </ul>
      )}
    </div>
  )
}
