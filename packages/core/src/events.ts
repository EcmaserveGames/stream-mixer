export interface StreamEvent<T extends string> {
  type: T
  source?: any
  data?: Record<string, any>
}

export type EventCallback<T extends string> = (event: StreamEvent<T>) => void

export class EventHub<T extends string> {
  private callbacks: Record<string, EventCallback<any>[]> = {}
  private types: T[]

  public constructor(...types: T[]) {
    this.types = types
  }

  public dispatchEvent(type: T, source?: any, data?: Record<string, any>) {
    const event = this.createStreamEvent(type, source, data)
    var callbacks = this.callbacks[event.type] || []
    callbacks.forEach((dispatch) => dispatch(event))
  }

  public addEventListener(type: T, callback: EventCallback<T>) {
    if (this.types.indexOf(type) === -1) {
      this.types.push(type)
    }
    this.callbacks[type] = this.callbacks[type] || []
    this.callbacks[type].push(callback)
  }

  public removeEventListener(type: T, callback: EventCallback<T>) {
    var callbacks = this.callbacks[type] || []
    var currentIndex = callbacks.indexOf(callback)
    if (currentIndex > -1) {
      callbacks.splice(currentIndex, 1)
    }
  }

  private createStreamEvent(type: T, source?: any, data?: Record<string, any>) {
    const event: StreamEvent<T> = {
      type: type,
      source,
      data,
    }
    return event
  }
}
