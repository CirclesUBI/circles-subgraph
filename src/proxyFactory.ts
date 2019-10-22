import {
  CreateProxyCall,
  ProxyCreation as ProxyCreationEvent,
} from './types/ProxyFactory/ProxyFactory'

import {
  Safe,
  User,
} from './types/schema'

import { Bytes, BigInt, Address } from '@graphprotocol/graph-ts'

export function handleProxyCreation(event: ProxyCreationEvent): void {
  let safe = new Safe(event.params.proxy.toHex())
  safe.save()
}

export function handleCreateProxyCall(call: CreateProxyCall): void {
  let id = call.transaction.hash.toHex()
  let user = new User(call.from.toHex())
  user.safe = call.outputs.proxy.toHex()
  user.save()
}
