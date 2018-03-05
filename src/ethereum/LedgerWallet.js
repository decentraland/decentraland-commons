import Web3 from 'web3'

import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Eth from '@ledgerhq/hw-app-eth'

import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import LedgerWalletSubprovider from 'ledger-wallet-provider'

import { Wallet } from './Wallet'
import { sleep } from '../utils'

export class LedgerWallet extends Wallet {
  // eslint-disable-next-line
  static derivationPath = "44'/60'/0'/0"

  static async isSupported() {
    const devices = await TransportU2F.list()
    return devices.length > 0
  }

  constructor(account, derivationPath = LedgerWallet.derivationPath) {
    super(account)
    this.ledger = null
    this.derivationPath = derivationPath
  }

  async connect(providerUrl) {
    const transport = await TransportU2F.open(null, 2)
    const ledger = new Eth(transport)

    this.ledger = ledger

    // FireFox hangs on indefinetly on `getAccounts`, so the second promise acts as a timeout
    const accounts = await Promise.race([
      this.getAccounts(),
      sleep(2000).then(() =>
        Promise.reject({ message: 'Timed out trying to connect to ledger' })
      )
    ])

    if (!this.account) {
      this.setAccount(accounts[0])
    }

    const provider = await this.getProvider(providerUrl)
    this.web3 = new Web3(provider)
  }

  /**
   * It'll create a new provider using the providerUrl param for RPC calls
   * @param  {string} [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
   * @return {object} The web3 provider
   */
  async getProvider(providerUrl = 'https://mainnet.infura.io/') {
    let engine = new ProviderEngine()
    let ledgerWalletSubProvider = await LedgerWalletSubprovider(
      this.derivationPath
    )

    engine.addProvider(ledgerWalletSubProvider)
    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: providerUrl
      })
    )
    engine.start()

    return engine
  }

  async getAccounts() {
    const defaultAccount = await this.ledger.getAddress(
      LedgerWallet.derivationPath
    )
    return [defaultAccount.address] // follow the Wallet interface
  }

  async sign(message) {
    let { v, r, s } = await this.ledger.signPersonalMessage(
      LedgerWallet.derivationPath,
      message.substring(2)
    )

    v = (v - 27).toString(16)
    if (v.length < 2) v = '0' + v

    return '0x' + r + s + v
  }
}
