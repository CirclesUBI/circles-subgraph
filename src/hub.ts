import {
  Address,
  BigInt,
  store,
} from '@graphprotocol/graph-ts'

import {
  Hub as HubContract,
  HubTransfer as HubTransferEvent,
  Signup as SignupEvent,
  Trust as TrustEvent,
} from './types/Hub/Hub'

import {
  HubTransfer,
  Notification,
  Signup,
  Token,
  Trust,
  TrustChange,
  Safe,
} from './types/schema'

import {
  Token as TokenContract,
} from './types/templates'

import {
  createEventID,
  createNotificationID,
  createTrustID,
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
  // notify the user who is doing the trusting that they were successful
  let notificationCanSendTo = new Notification(
    createNotificationID(
      'trust-from',
      event.block.number,
      event.logIndex
    )
  )
  notificationCanSendTo.transactionHash = event.transaction.hash.toHexString()
  notificationCanSendTo.safeAddress = event.params.canSendTo.toHexString()
  notificationCanSendTo.safe = event.params.canSendTo.toHexString()
  notificationCanSendTo.type = 'TRUST'
  notificationCanSendTo.time = event.block.timestamp
  notificationCanSendTo.trust = createEventID(event.block.number, event.logIndex)
  notificationCanSendTo.save()

  // notify the user who has been trusted
  let notificationUser = new Notification(
    createNotificationID(
      'trust-to',
      event.block.number,
      event.logIndex
    )
  )
  notificationUser.transactionHash = event.transaction.hash.toHexString()
  notificationUser.safeAddress = event.params.user.toHexString()
  notificationUser.safe = event.params.user.toHexString()
  notificationUser.type = 'TRUST'
  notificationUser.time = event.block.timestamp
  notificationUser.trust = createEventID(event.block.number, event.logIndex)
  notificationUser.save()

  // store details about the kind of notification for both users
  let trustChange = new TrustChange(createEventID(event.block.number, event.logIndex))
  trustChange.canSendTo = event.params.canSendTo.toHexString()
  trustChange.user = event.params.user.toHexString()
  trustChange.limitPercentage = event.params.limit
  trustChange.save()

  // load the safe of the user being trusted
  let safe = Safe.load(event.params.user.toHexString())
  if (!safe) {
    safe.outgoingAddresses = new Array<string>()
  }
  let outgoing = safe.outgoingAddresses

  if (event.params.limit === new BigInt(0)) {
    // if this is actually an 'untrust', remote the connection from the trust graph
    store.remove('Trust', createTrustID(event.params.user, event.params.user, event.params.canSendTo))
    // also remote the person doing the trusting from the outgoingAddresses array
    let index = outgoing.indexOf(event.params.canSendTo.toHexString())
    outgoing = outgoing.splice(index, 1)
    safe.outgoingAddresses = outgoing
    safe.save()
    // no need to save the trust event if this was actually an 'untrust' - return here
    return
  } else {
    // add a record of the person doing the trusting to the outgoingAddresses array
    // if it isn't already there
    let index = outgoing.indexOf(event.params.canSendTo.toHexString())
    if (index === -1) {
      outgoing.push(event.params.canSendTo.toHexString())
      safe.outgoingAddresses = outgoing
      safe.save()
    }
  }

  // store the connection in the trust graph
  let trustEvent = new Trust(createTrustID(event.params.user, event.params.user, event.params.canSendTo))
  trustEvent.canSendTo = event.params.canSendTo.toHexString()
  trustEvent.canSendToAddress = event.params.canSendTo.toHexString()
  trustEvent.user = event.params.user.toHexString()
  trustEvent.userAddress = event.params.user.toHexString()

  let hub = HubContract.bind(event.address)
  let callResult = hub.try_checkSendLimit(event.params.user, event.params.user, event.params.canSendTo)
  if (callResult.reverted) {
    trustEvent.limit = new BigInt(0)
  } else {
    trustEvent.limit = callResult.value
  }
  trustEvent.limitPercentage = event.params.limit
  trustEvent.save()
}

export function handleHubTransfer(event: HubTransferEvent): void {
  // notify the user receiving the transfer
  let notificationTo = new Notification(
    createNotificationID(
      'hub-transfer-to',
      event.block.number,
      event.logIndex
    )
  )
  notificationTo.transactionHash = event.transaction.hash.toHexString()
  notificationTo.safeAddress = event.params.to.toHexString()
  notificationTo.safe = event.params.to.toHexString()
  notificationTo.type = 'HUB_TRANSFER'
  notificationTo.time = event.block.timestamp
  notificationTo.hubTransfer = createEventID(event.block.number, event.logIndex)
  notificationTo.save()
  
  // store the details about the kind of notification for both users
  let hubTransfer = new HubTransfer(createEventID(event.block.number, event.logIndex))
  hubTransfer.from = event.params.from.toHexString()
  hubTransfer.to = event.params.to.toHexString()
  hubTransfer.amount = event.params.amount
  hubTransfer.save()

  // notify the user sending the transfer
  let notificationFrom = new Notification(
    createNotificationID(
      'hub-transfer-from',
      event.block.number,
      event.logIndex
    )
  )
  notificationFrom.transactionHash = event.transaction.hash.toHexString()
  notificationFrom.safeAddress = event.params.from.toHexString()
  notificationFrom.safe = event.params.from.toHexString()
  notificationFrom.type = 'HUB_TRANSFER'
  notificationFrom.time = event.block.timestamp
  notificationFrom.hubTransfer = createEventID(event.block.number, event.logIndex)
  notificationFrom.save()
}
