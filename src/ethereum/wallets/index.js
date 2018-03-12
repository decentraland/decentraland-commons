import { NodeWallet } from './NodeWallet'
import { LedgerWallet } from './LedgerWallet'

export const WALLET_TYPES = {
  node: NodeWallet.type,
  ledger: LedgerWallet.type
}

export * from './NodeWallet'
export * from './LedgerWallet'
