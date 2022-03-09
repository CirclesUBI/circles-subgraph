import {
  Address,
  BigInt,
} from '@graphprotocol/graph-ts'

export function createTrustID(token: Address, user: Address, canSendTo: Address): string {
  return token.toHexString().concat('-').concat(user.toHexString().concat('-').concat(canSendTo.toHexString()))
}

export function createEventID(blockNumber: BigInt, logIndex: BigInt): string {
  return blockNumber.toString().concat('-').concat(logIndex.toString())
}

export function createNotificationID(
  type: string,
  blockNumber: BigInt,
  logIndex: BigInt
): string {
  return type.concat('-').concat(
    blockNumber.toString().concat('-').concat(logIndex.toString())
  )
}

export function createBalanceID(token: Address, holder: Address): string {
  return token.toHexString().concat('-').concat(holder.toHexString())
}

