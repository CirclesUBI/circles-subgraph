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

  let trustChange = new TrustChange(createEventID(event.block.number, event.logIndex))
  trustChange.canSendTo = event.params.canSendTo.toHexString()
  trustChange.user = event.params.user.toHexString()
  trustChange.limitPercentage = event.params.limit
  trustChange.save()

  if (event.params.limit === new BigInt(0)) {
    store.remove('Trust', createTrustID(event.params.user, event.params.user, event.params.canSendTo))
    return
  }

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

  let transfer = new HubTransfer(createEventID(event.block.number, event.logIndex))
  transfer.from = event.params.from.toHexString()
  transfer.to = event.params.to.toHexString()
  transfer.amount = event.params.amount
  transfer.save()

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
  notificationFrom.type = 'HUB_TRANSFER'
  notificationFrom.time = event.block.timestamp
  notificationFrom.hubTransfer = createEventID(event.block.number, event.logIndex)
  notificationFrom.save()
}
