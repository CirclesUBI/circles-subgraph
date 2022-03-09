import {
  Transfer as TransferEvent,
} from './types/templates/Token/Token'

import {
  Balance,
  Notification,
  Transfer,
} from './types/schema'

import {
  createBalanceID,
  createEventID,
  createNotificationID,
} from './utils'

export function handleTransfer(event: TransferEvent): void {
  // notify the person receiving the transfer
  let notificationTo = new Notification(
    createNotificationID(
      'transfer-to',
      event.block.number,
      event.logIndex
    )
  )
  notificationTo.transactionHash = event.transaction.hash.toHexString()
  notificationTo.safeAddress = event.params.to.toHexString()
  notificationTo.safe = event.params.to.toHexString()
  notificationTo.type = 'TRANSFER'
  notificationTo.time = event.block.timestamp
  notificationTo.transfer = createEventID(event.block.number, event.logIndex)
  notificationTo.save()

  // store details about the transfer for both users
  let transfer = new Transfer(createEventID(event.block.number, event.logIndex))
  transfer.from = event.params.from.toHexString()
  transfer.to = event.params.to.toHexString()
  transfer.amount = event.params.value
  transfer.save()

  // update the balance of the receiver
  let balTo = Balance.load(createBalanceID(event.address, event.params.to))

  if (balTo == null) {
    balTo = new Balance(createBalanceID(event.address, event.params.to))
    balTo.owner = event.params.to.toHex()
    balTo.token = event.address.toHex()
    balTo.amount = event.params.value
  } else {
    balTo.amount = balTo.amount + event.params.value
  }

  balTo.save()

  // if the transfer was not a ubi payout
  if (event.params.from.toHexString() != '0x0000000000000000000000000000000000000000') {
    // also update the balance of the sender
    let balFrom = Balance.load(createBalanceID(event.address, event.params.from))

    if (balFrom !== null) {
      balFrom.amount = balFrom.amount - event.params.value
      balFrom.save()
    }

    // also notify the sender
    let notificationFrom = new Notification(
      createNotificationID(
        'transfer-from',
        event.block.number,
        event.logIndex
      )
    )
    notificationFrom.transactionHash = event.transaction.hash.toHexString()
    notificationFrom.safeAddress = event.params.from.toHexString()
    notificationFrom.safe = event.params.from.toHexString()
    notificationFrom.type = 'TRANSFER'
    notificationFrom.time = event.block.timestamp
    notificationFrom.transfer = createEventID(event.block.number, event.logIndex)
    notificationFrom.save()
  }
}
