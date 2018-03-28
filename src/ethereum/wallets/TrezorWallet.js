import Web3 from 'web3'

import ProviderEngine from 'web3-provider-engine'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'

import { Wallet } from './Wallet'

let TrezorConnect = null

if (typeof window !== 'undefined') {
  TrezorConnect = window.TrezorConnect
}

/**
 * Trezor Wallet class
 * WARN: Web ONLY
 * @extends Wallet
 */
export class TrezorWallet extends Wallet {
  // eslint-disable-next-line
  static derivationPath = "44'/60'/0'/0"
  static type = 'trezor'

  static async isSupported() {
    return false
  }

  constructor(account, derivationPath) {
    super(account)

    if (!TrezorConnect) {
      throw new Error('WONT WORK, add https://connect.trezor.io/4/connect.js')
    }

    this.engine = null
    this.derivationPath = derivationPath || TrezorWallet.derivationPath
  }

  async connect(providerUrl) {
    const accounts = await this.getAccounts()

    this.engine = new ProviderEngine()
    const provider = await this.getProvider(providerUrl)

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
   * @return {object} The web3 provider
   */
  async getProvider(providerUrl) {
    let trezorWalletProvider = new TrezorWalletProvider(this.derivationPath)

    this.engine.addProvider(trezorWalletProvider)
    this.engine.addProvider(
      new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl))
    )
    this.engine.start()

    return this.engine
  }

  async getAccounts() {
    return new Promise((resolve, reject) => {
      TrezorConnect.ethereumGetAddress(this.derivationPath, function(result) {
        if (result.success) {
          resolve(['0x' + result.address])
        } else {
          reject(result.error)
        }
      })
    })
  }
}

class TrezorWalletProvider {
  constructor(derivationPath) {
    this.derivationPath = derivationPath
  }
}
