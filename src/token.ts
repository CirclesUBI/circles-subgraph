import {
  Address,
} from '@graphprotocol/graph-ts'

import {
  Transfer as TransferEvent,
  Token as TokenContract,
} from './types/templates/Token/Token'

import {
  Token,
  Balance,
} from './types/schema'

export function handleTransfer(event: TransferEvent): void {
  let balTo = new Balance(createBalanceID(event.address, event.params.to))
  balTo.owner = event.params.to.toHex()
  balTo.token = event.address.toHex()
  let tokenContract = TokenContract.bind(event.address);
  balTo.amount = tokenContract.balanceOf(event.params.to);
  balTo.save()
  if (event.params.from.toHexString() !=== '0x0000000000000000000000000000000000000000') {
	  let balFrom = new Balance(createBalanceID(event.address, event.params.from))
	  balFrom.owner = event.params.from.toHex()
	  balFrom.token = event.address.toHex()
	  balFrom.amount = tokenContract.balanceOf(event.params.from);
	  balFrom.save()
  }
}

export function handleTransferFrom(event: TransferEvent): void {  
  handleTransfer(event)
}

function createBalanceID(from: Address, to: Address): string {
  return from.toHexString().concat('-').concat(to.toHexString())
}