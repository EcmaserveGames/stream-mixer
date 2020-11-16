import { h, render } from 'preact'
import { StreamMixerProvider } from '../src'
import { BroadcastSignaler } from './BroadcastSignaler'
import { ResizeToFit, ResizeToFill } from './CanResize'
import { WebRtc } from './WebRtc'
render(
  <StreamMixerProvider signaler={new BroadcastSignaler()}>
    <WebRtc />
    <ResizeToFit />
    <ResizeToFill />
  </StreamMixerProvider>,
  document.body
)

if (module.hot) module.hot.accept()
