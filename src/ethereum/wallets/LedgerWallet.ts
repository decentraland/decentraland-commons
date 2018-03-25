import Web3 from 'web3'

import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Eth from '@ledgerhq/hw-app-eth'

import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import LedgerWalletSubprovider from 'ledger-wallet-provider'

import { Wallet } from './Wallet'
import { sleep } from '../../utils'

export class LedgerWallet extends Wallet {
  // eslint-disable-next-line

  ledger = null
  engine = null
  derivationPath = "44'/60'/0'/0"

  constructor(account, derivationPath) {
    super(account)

    this.derivationPath = derivationPath || "44'/60'/0'/0"
  }

  static async isSupported() {
    const devices = await TransportU2F.list()
    return devices.length > 0
  }

  getType() {
    return 'ledger'
  }

  async connect(providerUrl?: string, networkId?: string) {
    if (!providerUrl || !networkId) {
      throw new Error('You must provide both providerUrl and networkId')
    }

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

    this.engine = new ProviderEngine()

    const provider = await this.getProvider(providerUrl, networkId)
    this.web3 = new Web3(provider)

    if (!this.account) {
      this.setAccount(accounts[0])
    }
  }

  disconnect() {
    super.disconnect()

    if (this.engine) {
      this.engine.stop()
      this.engine = null
    }
  }

  /**
   * It'll create a new provider using the providerUrl param for RPC calls
   * @param  {string} [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
   * @param  {string} [networkId="1"] - The id of the network we're connecting to. 1 means mainnet, check {@link eth#getNetworks}
   * @return {object} The web3 provider
   */
  async getProvider(
    providerUrl = 'https://mainnet.infura.io/',
    networkId = '1'
  ) {
    let ledgerWalletSubProvider = await LedgerWalletSubprovider(
      () => networkId,
      this.derivationPath
    )

    this.engine.addProvider(ledgerWalletSubProvider)
    this.engine.addProvider(
      new RpcSubprovider({
        rpcUrl: providerUrl
      })
    )
    this.engine.start()

    return this.engine
  }

  async getAccounts() {
    const defaultAccount = await this.ledger.getAddress(this.derivationPath)
    return [defaultAccount.address] // follow the Wallet interface
  }

  async sign(message: string): Promise<string> {
    let { v, r, s } = await this.ledger.signPersonalMessage(
      this.derivationPath,
      message.substring(2)
    )

    v = (v - 27).toString(16)
    if (v.length < 2) v = '0' + v

    return '0x' + r + s + v
  }
}
