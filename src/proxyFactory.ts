import {
  ProxyCreation as ProxyCreationEvent,
} from './types/ProxyFactory/ProxyFactory'

import {
  Safe,
} from './types/schema'

import {
  GnosisSafe as GnosisSafeContract,
} from './types/templates'

export function handleProxyCreation(event: ProxyCreationEvent): void {
  GnosisSafeContract.create(event.params.proxy)

  let safe = new Safe(event.params.proxy.toHex())
  safe.save()
}