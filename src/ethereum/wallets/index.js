import { NodeWallet } from './NodeWallet'
import { LedgerWallet } from './LedgerWallet'
import { TrezorWallet } from './TrezorWallet'

export const WALLET_TYPES = {
  node: NodeWallet.type,
  ledger: LedgerWallet.type,
  trezor: TrezorWallet.type
}

export * from './NodeWallet'
export * from './LedgerWallet'
export * from './TrezorWallet'
