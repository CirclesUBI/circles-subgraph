import {
  Address,
  BigInt,
} from '@graphprotocol/graph-ts'
import { OwnershipChange, Notification} from './types/schema'

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

export function manageOwnership(owner: string, safe: string, transaction: string, blockNumber: BigInt, logIndex: BigInt, blocktimestap: BigInt): void {
  let ownership = new OwnershipChange(createEventID(blockNumber, logIndex))
  ownership.adds = owner
  ownership.save()

  let notification = new Notification(
    createNotificationID(
      'ownership',
      blockNumber,
      logIndex
    )
  )
  notification.transactionHash = transaction
  notification.safeAddress = safe
  notification.safe = safe
  notification.type = 'OWNERSHIP'
  notification.time = blocktimestap
  notification.ownership = createEventID(blockNumber, logIndex)
  notification.save()
}