import {
  Address,
  BigInt,
  store,
} from '@graphprotocol/graph-ts'

import {
  Hub as HubContract,
  Signup as SignupEvent,
  Trust as TrustEvent,
} from './types/Hub/Hub'

import {
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
  let notificationFrom = new Notification(
    createNotificationID(
      'TRUST',
      event.block.number,
      event.logIndex
    )
  )
  notificationFrom.safe = event.params.from.toHexString()
  notificationFrom.type = 'TRUST'
  notificationFrom.time = event.block.timestamp
  notificationFrom.trust = createEventID(event.block.number, event.logIndex)
  notificationFrom.save()

  let notificationTo = new Notification(
    createNotificationID(
      'TRUST',
      event.block.number,
      event.logIndex
    )
  )
  notificationTo.safe = event.params.to.toHexString()
  notificationTo.type = 'TRUST'
  notificationTo.time = event.block.timestamp
  notificationTo.trust = createEventID(event.block.number, event.logIndex)
  notificationTo.save()

  let trustChange = new TrustChange(createEventID(event.block.number, event.logIndex))
  trustChange.from = event.params.from.toHexString()
  trustChange.to = event.params.to.toHexString()
  trustChange.limitPercentage = event.params.limit
  trustChange.save()

  if (event.params.limit === new BigInt(0)) {
    store.remove('Trust', createTrustID(event.params.from, event.params.to))
    return
  }

  let trustEvent = new Trust(createTrustID(event.params.from, event.params.to))
  trustEvent.from = event.params.from.toHexString()
  trustEvent.to = event.params.to.toHexString()

  let hub = HubContract.bind(event.address)
  trustEvent.limit = hub.checkSendLimit(event.params.to, event.params.to, event.params.from)
  trustEvent.limitPercentage = event.params.limit
  trustEvent.save()
}
