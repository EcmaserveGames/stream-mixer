import { h, render } from 'preact'
import { StreamMixerProvider } from '../src'
import { ResizeToFit, ResizeToFill } from './CanResize'
render(
  <StreamMixerProvider>
    <ResizeToFit />
    <ResizeToFill />
  </StreamMixerProvider>,
  document.body
)

if (module.hot) module.hot.accept()
