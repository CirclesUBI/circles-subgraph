import {
  BigInt,
  Address,
  store,
} from '@graphprotocol/graph-ts'

import {
  Signup as SignupEvent,
  Trust as TrustEvent,
  Hub as HubContract,
} from './types/Hub/Hub'

import {
  Signup,
  Token,
  Trust,
} from './types/schema'

import {
  Token as TokenContract,
} from './types/templates'

import {
  createTrustID,
  createEventID,
} from './utils'

export function handleSignup(event: SignupEvent): void {
  TokenContract.create(event.params.token)

  let signupEvent = new Signup(createEventID(event.block.number, event.logIndex))
  signupEvent.safe = event.params.user.toHex()
  signupEvent.token = event.params.token.toHex()
  signupEvent.save()

  let token = new Token(event.params.token.toHex())
  token.owner = event.params.user.toHex()
  token.save()
}

export function handleTrust(event: TrustEvent): void {
  if (event.params.limit === new BigInt(0)) {
    store.remove('Trust', createTrustID(event.params.from, event.params.to))
    return
  }
  let trustEvent = new Trust(createTrustID(event.params.from, event.params.to))
  trustEvent.from = event.params.from.toHexString()
  trustEvent.to = event.params.to.toHexString()
  let hub = HubContract.bind(event.address);
  trustEvent.limit = hub.checkSendLimit(event.params.to, event.params.to, event.params.from);
  trustEvent.limitPercentage = event.params.limit
  trustEvent.save()
}
