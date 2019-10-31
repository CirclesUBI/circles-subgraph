import {
  ProxyCreation as ProxyCreationEvent,
} from './types/ProxyFactory/ProxyFactory'

import {
  Safe,
} from './types/schema'

export function handleProxyCreation(event: ProxyCreationEvent): void {
  let safe = new Safe(event.params.proxy.toHex())
  safe.save()
}