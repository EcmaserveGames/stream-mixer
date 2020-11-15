import { useContext } from 'preact/hooks'
import { StreamMixerContext } from './Context'

export function useStreamMixer() {
  const ctx = useContext(StreamMixerContext)
  return ctx
}
