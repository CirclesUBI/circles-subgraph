import {
  Signup as SignupEvent,
} from './types/Hub/Hub'

import {
  Signup,
} from './types/schema'

import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

export function handleSignup(event: SignupEvent): void {
  let signupEvent = new Signup(createEventID(event.block.number, event.logIndex))
  signupEvent.accountID = event.params.user
  signupEvent.tokenID = event.params.token
  signupEvent.save()
}

function createEventID(blockNumber: BigInt, logIndex: BigInt): string {
  return blockNumber.toString().concat('-').concat(logIndex.toString())
}