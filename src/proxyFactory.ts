import {
  ProxyCreation as ProxyCreationEvent,
} from './types/ProxyFactory/ProxyFactory'

import {
  Safe,
} from './types/schema'

import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

export function handleProxyCreation(event: ProxyCreationEvent): void {
  let safe = new Safe(event.params.proxy.toHex())
  safe.save()
}