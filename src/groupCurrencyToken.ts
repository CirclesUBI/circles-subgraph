import {
  BigInt,
  Address,
  store,
} from '@graphprotocol/graph-ts'
import {
  GroupCurrencyTokenCreated as GroupCurrencyTokenCreatedEvent
} from './types/GroupCurrencyTokenFactory/GroupCurrencyTokenFactory'
import {
  GroupCurrencyToken as GroupCurrencyTokenContract,
  MemberTokenAdded as MemberTokenAddedEvent,
  OnlyOwnerCanMint as OnlyOwnerCanMintEvent,
  OnlyTrustedCanMint as OnlyTrustedCanMintEvent,
  OwnerChanged as OwnerChangedEvent,
  Suspended as SuspendedEvent,
  Minted as MintedEvent,
} from './types/GroupCurrencyTokenFactory/GroupCurrencyToken'
import { GroupAddMember, GroupCreation, GroupCurrencyToken, GroupMint, GroupRemoveMember, Notification, SafeGroupMember } from './types/schema'
import { GroupCurrencyToken as GroupCurrencyTokenTemplate } from './types/templates'
import { createEventID, createNotificationID } from './utils'

export function createGroupCurrencyTokenIfNonExistent(groupAddress: Address): GroupCurrencyToken {
  let groupAddressString = groupAddress.toHexString()
  let groupCurrencyToken = GroupCurrencyToken.load(groupAddressString)

  if (!groupCurrencyToken) {
    // Load Group State from the Contract
    let GroupCurrencyTokenContractInstance = GroupCurrencyTokenContract.bind(groupAddress)
    groupCurrencyToken = new GroupCurrencyToken(groupAddressString)
    groupCurrencyToken.name = GroupCurrencyTokenContractInstance.name()
    groupCurrencyToken.symbol = GroupCurrencyTokenContractInstance.symbol()
    groupCurrencyToken.hub = GroupCurrencyTokenContractInstance.hub().toHexString()
    groupCurrencyToken.owner = GroupCurrencyTokenContractInstance.owner().toHexString()
    groupCurrencyToken.treasury = GroupCurrencyTokenContractInstance.treasury().toHexString()
    groupCurrencyToken.mintFeePerThousand = BigInt.fromI32(GroupCurrencyTokenContractInstance.mintFeePerThousand())
    groupCurrencyToken.minted = new BigInt(0)
    groupCurrencyToken.suspended = GroupCurrencyTokenContractInstance.suspended()
    groupCurrencyToken.onlyOwnerCanMint = GroupCurrencyTokenContractInstance.onlyOwnerCanMint()
    groupCurrencyToken.onlyTrustedCanMint = GroupCurrencyTokenContractInstance.onlyTrustedCanMint()
    groupCurrencyToken.save()
    // Finally creates the Data Template
    GroupCurrencyTokenTemplate.create(groupAddress)
  }
  return groupCurrencyToken
}

export function createSafeGroupMemberId(groupId: string, safeId: string): string {
  return groupId + "-" + safeId
}

export function createSafeGroupMemberIfNonExistent(groupId: string, safeId: string): SafeGroupMember {
  let id = createSafeGroupMemberId(groupId, safeId)
  let safeGroupMember = SafeGroupMember.load(id)
  if (!safeGroupMember) {
    safeGroupMember = new SafeGroupMember(id)
    safeGroupMember.group = groupId
    safeGroupMember.safe = safeId
    safeGroupMember.save()
  }
  return safeGroupMember
}

export function handleGroupCurrencyTokenCreation(event: GroupCurrencyTokenCreatedEvent): void {
  let groupAddress = event.params._address
  let creator = event.params._deployer.toHexString()
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.time = event.block.timestamp
  groupCurrencyToken.creator = creator
  groupCurrencyToken.save()

  // Creates Group Creation event
  let eventId = createEventID(event.block.number, event.logIndex)
  let groupCreationEvent = new GroupCreation(eventId)
  groupCreationEvent.creator = creator
  groupCreationEvent.group = groupCurrencyToken.id
  groupCreationEvent.save()

  // Creates Notification for Group Creation event
  let notificationId = createNotificationID('group-creation', event.block.number, event.logIndex)
  let notification = new Notification(notificationId)
  notification.transactionHash = event.transaction.hash.toHexString()
  notification.safeAddress = creator
  notification.safe = creator
  notification.type = 'GROUP_CREATION'
  notification.time = event.block.timestamp
  notification.groupCreation = eventId
  notification.save()
}

export function handleMemberTokenAdded(event: MemberTokenAddedEvent): void {
  // group Id is generated by transforming the group Address to HexString
  let groupId = event.address.toHexString()
  // safe Id is generated by transforming the Safe Address to Hex
  let safeId = event.params._memberToken.toHex()
  createSafeGroupMemberIfNonExistent(groupId, safeId)

  // Creates Group Add Member event
  let eventId = createEventID(event.block.number, event.logIndex)
  let groupAddMemberEvent = new GroupAddMember(eventId)
  groupAddMemberEvent.user = safeId
  groupAddMemberEvent.group = groupId
  groupAddMemberEvent.save()

  // Creates Notification for Group Creation event
  let notificationId = createNotificationID('group-add-member', event.block.number, event.logIndex)
  let notification = new Notification(notificationId)
  notification.transactionHash = event.transaction.hash.toHexString()

  notification.safeAddress = safeId
  notification.safe = safeId
  notification.type = 'GROUP_ADD_MEMBER'
  notification.time = event.block.timestamp
  notification.groupAddMember = eventId
  notification.save()
}

// @TODO shall we remove them or we might want to keep them for historical data?
// Currently we are removing them from the group
export function handleMemberTokenRemoved(event: MemberTokenAddedEvent): void {
  // group Id is generated by transforming the group Address to HexString
  let groupId = event.address.toHexString()
  // safe Id is generated by transforming the Safe Address to Hex
  let safeId = event.params._memberToken.toHex()
  let groupMemberId = createSafeGroupMemberId(groupId, safeId)
  store.remove('SafeGroupMember', groupMemberId)

  // Creates Group Remove Member event
  let eventId = createEventID(event.block.number, event.logIndex)
  let groupRemoveMemberEvent = new GroupRemoveMember(eventId)
  groupRemoveMemberEvent.user = safeId
  groupRemoveMemberEvent.group = groupId
  groupRemoveMemberEvent.save()

  // Creates Notification for Group Creation event
  let notificationId = createNotificationID('group-remove-member', event.block.number, event.logIndex)
  let notification = new Notification(notificationId)
  notification.transactionHash = event.transaction.hash.toHexString()

  notification.safeAddress = safeId
  notification.safe = safeId
  notification.type = 'GROUP_REMOVE_MEMBER'
  notification.time = event.block.timestamp
  notification.groupRemoveMember = eventId
  notification.save()
}

export function handleOnlyOwnerCanMint(event: OnlyOwnerCanMintEvent): void {
  let groupAddress = event.params._event.address
  let onlyOwnerCanMint = event.params._onlyOwnerCanMint
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.onlyOwnerCanMint = onlyOwnerCanMint
  groupCurrencyToken.save()
}

export function handleOnlyTrustedCanMint(event: OnlyTrustedCanMintEvent): void {
  let groupAddress = event.params._event.address
  let onlyTrustedCanMint = event.params._onlyTrustedCanMint
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.onlyTrustedCanMint = onlyTrustedCanMint
  groupCurrencyToken.save()
}

export function handleOwnerChanged(event: OwnerChangedEvent): void {
  let groupAddress = event.params._event.address
  let newOwner = event.params._new
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.owner = newOwner.toHexString()
  groupCurrencyToken.save()
}

export function handleSuspended(event: SuspendedEvent): void {
  let groupAddress = event.params._event.address
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  // @TODO the suspended event only send the owner address data, it'd be better if send the suspended bool
  let GroupCurrencyTokenContractInstance = GroupCurrencyTokenContract.bind(groupAddress)
  groupCurrencyToken.suspended = GroupCurrencyTokenContractInstance.suspended()
  groupCurrencyToken.save()
}

// @TODO: this event has many information such as: receiver, amount, mintAmount, mintFee
// amount = mintAmount + mintFee
// we might want to save some of this piece of information in a different entity?
// in the meantime we will just save the minted amount (mintAmount)
export function handleMinted(event: MintedEvent): void {
  let groupAddress = event.params._event.address
  let mintAmount = event.params._mintAmount
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.minted = groupCurrencyToken.minted.plus(mintAmount)
  groupCurrencyToken.save()

  // Creates Group Mint event
  let eventId = createEventID(event.block.number, event.logIndex)
  let groupMintEvent = new GroupMint(eventId)
  let receiver = event.params._receiver.toHexString()
  groupMintEvent.receiver = receiver
  groupMintEvent.amount = mintAmount
  groupMintEvent.mintFee = event.params._mintFee
  groupMintEvent.group = groupAddress.toHexString()
  groupMintEvent.save()

  // Creates Notification for Group Creation event
  let notificationId = createNotificationID('group-mint', event.block.number, event.logIndex)
  let notification = new Notification(notificationId)
  notification.transactionHash = event.transaction.hash.toHexString()

  notification.safeAddress = receiver
  notification.safe = receiver
  notification.type = 'GROUP_MINT'
  notification.time = event.block.timestamp
  notification.groupMint = eventId
  notification.save()
}
