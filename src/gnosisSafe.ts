import {
  store,
} from '@graphprotocol/graph-ts'

import {
  AddedOwner as AddedOwnerEvent,
  RemovedOwner as RemovedOwnerEvent,
} from './types/templates/GnosisSafe/GnosisSafe'

import {
  Notification,
  OwnershipChange,
  Safe,
  User,
} from './types/schema'

import {
  createEventID,
  createNotificationID,
} from './utils'

export function handleAddedOwner(event: AddedOwnerEvent): void {
  let user = new User(event.params.owner.toHexString())
  user.safe = event.address.toHexString()
  user.save()

  let ownership = new OwnershipChange(createEventID(event.block.number, event.logIndex))
  ownership.adds = event.params.owner.toHexString()
  ownership.save()

  let notification = new Notification(
    createNotificationID(
      'ownership',
      event.block.number,
      event.logIndex
    )
  )
  notification.transactionHash = event.transaction.hash.toHexString()
  notification.safeAddress = event.address.toHexString()
  notification.safe = event.address.toHexString()
  notification.type = 'OWNERSHIP'
  notification.time = event.block.timestamp
  notification.ownership = createEventID(event.block.number, event.logIndex)
  notification.save()
}

export function handleRemovedOwner(event: RemovedOwnerEvent): void {
  store.remove('User', event.params.owner.toHex())

  let ownership = new OwnershipChange(createEventID(event.block.number, event.logIndex))
  ownership.removes = event.params.owner.toHexString()
  ownership.save()

  let notification = new Notification(
    createNotificationID(
      'OWNERSHIP',
      event.block.number,
      event.logIndex
    )
  )
  notification.transactionHash = event.transaction.hash.toHexString()
  notification.safeAddress = event.address.toHexString()
  notification.safe = event.address.toHexString()
  notification.type = 'OWNERSHIP'
  notification.time = event.block.timestamp
  notification.ownership = createEventID(event.block.number, event.logIndex)
  notification.save()
}
