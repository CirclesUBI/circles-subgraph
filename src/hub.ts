import {
  BigInt,
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

export function handleSignup(event: SignupEvent): void {
  let signupEvent = new Signup(createEventID(event.block.number, event.logIndex))
  signupEvent.safe = event.params.user.toHex()
  signupEvent.token = event.params.token.toHex()
  signupEvent.save()

  let token = new Token(event.params.user.toHex())
  token.owner = event.params.user.toHex()
  token.save()
}

export function handleTrust(event: TrustEvent): void {
  let trustEvent = new Trust(createEventID(event.block.number, event.logIndex))
  trustEvent.from = event.params.from.toHex()
  trustEvent.to = event.params.to.toHex()
  trustEvent.limit = event.params.limit
  trustEvent.save()
}

function createEventID(blockNumber: BigInt, logIndex: BigInt): string {
  return blockNumber.toString().concat('-').concat(logIndex.toString())
}
