import * as React from 'react';
import { Publisher } from './pubsub';
import { useUpdater } from './react-updater';

export class Observable<T = any> { 
  private _value: T;
  private publisher = new Publisher();

  constructor(value: T) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const prevValue = this._value;
    this._value = value;
    this.publisher.publish(value, prevValue);
  }

  get(): T {
    return this._value;
  }

  set(value: T | ((prevValue: T) => T)) {
    this.value = value instanceof Function ? value(this._value) : value;
  }

  subscribe(callbcak: (value: T, prevValue: T) => void, batch = false) {
    return this.publisher.subscribe(callbcak, batch);
  }
}

export function useObservable<T>(observable: Observable<T>): T {
  const update = useUpdater();
  React.useEffect(() => observable.subscribe(update, true), [observable]);
  return observable.get();
}

try {
  const { unstable_batchedUpdates } = require('react-dom');
  // @ts-ignore
  const invokeCallbackQueue = Publisher.invokeCallbackQueue;
  // @ts-ignore
  Publisher.invokeCallbackQueue = () => unstable_batchedUpdates(invokeCallbackQueue);
}
catch (error) {}