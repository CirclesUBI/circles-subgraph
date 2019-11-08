import {
  Address,
  store,
} from '@graphprotocol/graph-ts'

import {
  Transfer as TransferEvent,
  Token as TokenContract,
} from './types/templates/Token/Token'

import {
  Trust as TrustEvent,
  Hub as HubContract,
} from './types/Hub/Hub'

import {
  Token,
  Balance,
  Trust
} from './types/schema'

import {
  createTrustID,
  createBalanceID,
} from './utils'

export function handleTransfer(event: TransferEvent): void {
  let tokenContract = TokenContract.bind(event.address);
  let balTo = new Balance(createBalanceID(event.address, event.params.to))
  balTo.owner = event.params.to.toHex()
  balTo.token = event.address.toHex()
  balTo.amount = tokenContract.balanceOf(event.params.to);
  balTo.save()
  if (event.params.from.toHexString() != '0x0000000000000000000000000000000000000000') {
	  let balFrom = new Balance(createBalanceID(event.address, event.params.from))
	  balFrom.owner = event.params.from.toHex()
	  balFrom.token = event.address.toHex()
	  balFrom.amount = tokenContract.balanceOf(event.params.from);
	  balFrom.save()
  }
  updateMaxTrust(event.params.to, event.params.from, event.address)
}

function updateMaxTrust(from: Address, to: Address, token: Address): void {
  let trust = Trust.load(createTrustID(from, to))
  if (trust !== null) {
    let tokenContract = TokenContract.bind(token);
    let hubAddress = tokenContract.hub()
    let hub = HubContract.bind(hubAddress);
    let tokenOwner = tokenContract.owner();
    trust.limit = hub.checkSendLimit(tokenOwner, to, from);
    trust.save()
  }
}