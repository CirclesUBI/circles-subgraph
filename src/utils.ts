import {
  BigInt,
  Address,
  store,
} from '@graphprotocol/graph-ts'

export function createTrustID(from: Address, to: Address): string {
  return from.toHexString().concat('-').concat(to.toHexString())
}

export function createEventID(blockNumber: BigInt, logIndex: BigInt): string {
  return blockNumber.toString().concat('-').concat(logIndex.toString())
}

export function createBalanceID(from: Address, to: Address): string {
  return from.toHexString().concat('-').concat(to.toHexString())
}