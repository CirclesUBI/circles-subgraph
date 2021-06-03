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

  let safe = Safe.load(event.params.proxy.toHex())
  if (!safe) {
    safe = new Safe(event.params.proxy.toHex())
    safe.outgoingAddresses = new Array<string>()
  }
  safe.deployed = true
  safe.organization = false
  safe.save()
}
