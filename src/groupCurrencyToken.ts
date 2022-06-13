import {
  BigInt,
  Address,
} from '@graphprotocol/graph-ts'
import {
  GroupCurrencyTokenCreated as GroupCurrencyTokenCreatedEvent
} from './types/GroupCurrencyTokenFactory/GroupCurrencyTokenFactory'
import {
  GroupCurrencyToken as GroupCurrencyTokenContract
} from './types/GroupCurrencyTokenFactory/GroupCurrencyToken'
import { GroupCurrencyToken } from './types/schema'

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
    groupCurrencyToken.suspended = GroupCurrencyTokenContractInstance.suspended()
    groupCurrencyToken.onlyOwnerCanMint = GroupCurrencyTokenContractInstance.onlyOwnerCanMint()
    groupCurrencyToken.onlyTrustedCanMint = GroupCurrencyTokenContractInstance.onlyTrustedCanMint()
    groupCurrencyToken.save()
  }
  return groupCurrencyToken
}

export function handleGroupCurrencyTokenCreation(event: GroupCurrencyTokenCreatedEvent): void {
  let groupAddress = event.params._address
  let creator = event.params._deployer.toHexString()
  let groupCurrencyToken = createGroupCurrencyTokenIfNonExistent(groupAddress)
  groupCurrencyToken.creator = creator
  groupCurrencyToken.save()
}
