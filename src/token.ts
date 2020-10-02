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
  Safe,
} from './types/schema'

import {
  createBalanceID,
  createEventID,
  createNotificationID,
  createTrustID,
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

  let tokenContract = TokenContract.bind(event.address)

  // update the balance of the receiver
  let balTo = new Balance(createBalanceID(event.address, event.params.to))
  balTo.owner = event.params.to.toHex()
  balTo.token = event.address.toHex()
  balTo.amount = tokenContract.balanceOf(event.params.to)
  balTo.save()

  // if the transfer was not a ubi payout
  if (event.params.from.toHexString() != '0x0000000000000000000000000000000000000000') {
    // also update the balance of the sender
    let balFrom = new Balance(createBalanceID(event.address, event.params.from))
    balFrom.owner = event.params.from.toHex()
    balFrom.token = event.address.toHex()
    balFrom.amount = tokenContract.balanceOf(event.params.from)
    balFrom.save()

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

  // update all relevant trust limits
  updateMaxTrust(event.params.to, event.params.from, event.address)
}

function updateMaxTrust(canSendTo: Address, user: Address, token: Address): void {
  let tokenContract = TokenContract.bind(token)
  let tokenOwner = tokenContract.owner()
  let hubAddress = tokenContract.hub()
  let hub = HubContract.bind(hubAddress)

  // user has sent some of their own tokens, user is the transaction sender
  if (user == tokenOwner) {
    let safe = Safe.load(user.toHexString())
    for (let i = 0; i < safe.outgoingAddresses.length; i++) {
      let outgoingAddresses = safe.outgoingAddresses
      // find all the edges where tokens can come to this safe, and update them
      // this safe now accepts more/less of the tokens of every safe they trust
      let trust = Trust.load(createTrustID(user, user, createTrustID(Address.fromString(outgoingAddresses[i]))))
      if (!trust) {
        continue
      }
      let callResult = hub.try_checkSendLimit(user, user, createTrustID(Address.fromString(outgoingAddresses[i]))))
      if (callResult.reverted) {
        trust.limit = new BigInt(0)
      } else {
        trust.limit = callResult.value
      }
      trust.save()
    }
  }
 
  // canSendTo has received their own tokens, canSendTo is the transaction receiver
  if (canSendTo == tokenOwner) {
    let safe = Safe.load(canSendTo.toHexString())
    for (let i = 0; i < safe.outgoingAddresses.length; i++) {
      let outgoingAddresses = safe.outgoingAddresses
      // find all the edges where tokens can come to this safe, and update them
      // this safe now accepts more/less of the tokens of every safe they trust
      let trust = Trust.load(canSendTo, canSendTo, createTrustID(Address.fromString(outgoingAddresses[i])))
      if (!trust) {
        continue
      }
      let callResult = hub.try_checkSendLimit(canSendTo, canSendTo, createTrustID(Address.fromString(outgoingAddresses[i]))
      if (callResult.reverted) {
        trust.limit = new BigInt(0)
      } else {
        trust.limit = callResult.value
      }
      trust.save()
    }
  }
}
