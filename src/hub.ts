import {
  BigInt,
  Address,
  store,
} from '@graphprotocol/graph-ts'

import {
  Signup as SignupEvent,
  Trust as TrustEvent,
} from './types/Hub/Hub'

import {
  Signup,
  Token,
  Trust,
} from './types/schema'

import {
  Token as TokenContract,
} from './types/templates'

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
  trustEvent.from = event.params.from.toHex()
  trustEvent.to = event.params.to.toHex()
  trustEvent.limit = event.params.limit
  trustEvent.save()
}

function createTrustID(from: Address, to: Address): string {
  return from.toString().concat('-').concat(to.toString())
}

function createEventID(blockNumber: BigInt, logIndex: BigInt): string {
  return blockNumber.toString().concat('-').concat(logIndex.toString())
}
