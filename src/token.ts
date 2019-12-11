import {
  Address,
  BigInt,
  store,
} from '@graphprotocol/graph-ts'

import {
  Token as TokenContract,
  Transfer as TransferEvent,
} from './types/templates/Token/Token'

import {
  Hub as HubContract,
  Trust as TrustEvent,
} from './types/Hub/Hub'

import {
  Balance,
  Notification,
  Token,
  Transfer,
  Trust,
} from './types/schema'

import {
  createBalanceID,
  createEventID,
  createNotificationID,
  createTrustID,
} from './utils'

export function handleTransfer(event: TransferEvent): void {
  let notificationTo = new Notification(
    createNotificationID(
      'transfer-to',
      event.block.number,
      event.logIndex
    )
  )
  notificationTo.transactionHash = event.transaction.hash.toHexString()
  notificationTo.safe = event.params.to.toHexString()
  notificationTo.type = 'TRANSFER'
  notificationTo.time = event.block.timestamp
  notificationTo.transfer = createEventID(event.block.number, event.logIndex)
  notificationTo.save()

  let transfer = new Transfer(createEventID(event.block.number, event.logIndex))
  transfer.from = event.params.from.toHexString()
  transfer.to = event.params.to.toHexString()
  transfer.amount = event.params.value
  transfer.save()

  let tokenContract = TokenContract.bind(event.address)

  let balTo = new Balance(createBalanceID(event.address, event.params.to))
  balTo.owner = event.params.to.toHex()
  balTo.token = event.address.toHex()
  balTo.amount = tokenContract.balanceOf(event.params.to)
  balTo.save()

  if (event.params.from.toHexString() != '0x0000000000000000000000000000000000000000') {
    let balFrom = new Balance(createBalanceID(event.address, event.params.from))
    balFrom.owner = event.params.from.toHex()
    balFrom.token = event.address.toHex()
    balFrom.amount = tokenContract.balanceOf(event.params.from)
    balFrom.save()

    let notificationFrom = new Notification(
      createNotificationID(
        'transfer-from',
        event.block.number,
        event.logIndex
      )
    )
    notificationFrom.transactionHash = event.transaction.hash.toHexString()
    notificationFrom.safe = event.params.from.toHexString()
    notificationFrom.type = 'TRANSFER'
    notificationFrom.time = event.block.timestamp
    notificationFrom.transfer = createEventID(event.block.number, event.logIndex)
    notificationFrom.save()
  }

  updateMaxTrust(event.params.to, event.params.from, event.address)
}

function updateMaxTrust(from: Address, to: Address, token: Address): void {
  let tokenContract = TokenContract.bind(token)
  let tokenOwner = tokenContract.owner()

  let trust = Trust.load(createTrustID(tokenOwner, from, to))

  if (!trust) {
    return
  }

  let hubAddress = tokenContract.hub()
  let hub = HubContract.bind(hubAddress)
  let callResult = hub.try_checkSendLimit(tokenOwner, to, from)
  if (callResult.reverted) {
    trust.limit = new BigInt(0)
  } else {
    trust.limit = callResult.value
  }
  trust.save()
}
