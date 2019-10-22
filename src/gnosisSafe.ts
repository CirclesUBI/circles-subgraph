import {
  AddedOwner as AddedOwnerEvent,
} from './types/templates/GnosisSafe/GnosisSafe'

import {
  Safe,
} from './types/schema'

import { Bytes, BigInt, Address } from '@graphprotocol/graph-ts'

export function handleAddedOwner(event: AddedOwnerEvent): void {
  // let safe = new Safe(event.params.owner.toHex())
  // safe.save()
}
