import {
  BigInt,
} from '@graphprotocol/graph-ts'
import {
  GroupCurrencyTokenCreated as GroupCurrencyTokenCreatedEvent
} from './types/GroupCurrencyTokenFactory/GroupCurrencyTokenFactory'
import {
  GroupCurrencyToken as GroupCurrencyTokenContract
} from './types/GroupCurrencyTokenFactory/GroupCurrencyToken'
import { GroupCurrencyToken } from './types/schema'

export function handleGroupCurrencyTokenCreation(event: GroupCurrencyTokenCreatedEvent): void {
  let groupAddress = event.params._address
  let groupAddressString = groupAddress.toHex()
  let creator = event.params._deployer.toHexString()
  let groupCurrencyToken = GroupCurrencyToken.load(groupAddressString)

  if (!groupCurrencyToken) {
    let groupCurrencyTokenInstance = GroupCurrencyTokenContract.bind(groupAddress)
    groupCurrencyToken = new GroupCurrencyToken(groupAddressString)
    groupCurrencyToken.name = groupCurrencyTokenInstance.name()
    groupCurrencyToken.symbol = groupCurrencyTokenInstance.symbol()
    groupCurrencyToken.creator = creator
    groupCurrencyToken.hub = groupCurrencyTokenInstance.hub().toHexString()
    groupCurrencyToken.owner = groupCurrencyTokenInstance.owner().toHexString()
    groupCurrencyToken.treasury = groupCurrencyTokenInstance.treasury().toHexString()
    groupCurrencyToken.mintFeePerThousand = BigInt.fromI32(groupCurrencyTokenInstance.mintFeePerThousand())
    groupCurrencyToken.suspended = false
    groupCurrencyToken.onlyOwnerCanMint = false
    groupCurrencyToken.onlyTrustedCanMint = false
    groupCurrencyToken.save()
  }
}
