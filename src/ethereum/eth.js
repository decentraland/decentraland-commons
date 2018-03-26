import { Log } from '../log'

import { NodeWallet, LedgerWallet } from './wallets'
import { Contract } from './Contract'
import { Abi } from './abi'
import { ethUtils } from './ethUtils'
import { promisify } from '../utils/index'

const log = new Log('Ethereum')
let web3 = null

/** @namespace */
export const eth = {
  /**
   * Filled on .connect()
   */
  contracts: {},
  wallet: null,

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: ethUtils,

  /**
   * Connect to web3
   * @param  {object} [options] - Options for the ETH connection
   * @param  {array<Contract>} [options.contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts}
   * @param  {array<Wallet>} [options.wallets=[Ledger, Node]] - An array of Wallet classes. It'll use the first successful connection. Check {@link wallets}
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.providerUrl] - URL for a provider forwarded to {@link Wallet#getWeb3Provider}
   * @param  {string} [options.derivationPath] - Path to derive the hardware wallet in. Defaults to each wallets most common value
   * @return {boolean} - True if the connection was successful
   */
  async connect(options = {}) {
    if (this.isConnected()) {
      this.disconnect()
    }

    const {
      contracts = [],
      wallets = [LedgerWallet, NodeWallet],
      defaultAccount,
      providerUrl,
      derivationPath
    } = options

    try {
      this.wallet = await this.connectWallet(wallets, {
        defaultAccount,
        providerUrl,
        derivationPath
      })
      web3 = this.wallet.getWeb3()

      this.setContracts(contracts)

      return true
    } catch (error) {
      log.info(`Error trying to connect Ethereum wallet:\n${error.message}`)
      return false
    }
  },

  async connectWallet(wallets, options = {}) {
    const { defaultAccount, providerUrl = '', derivationPath = null } = options

    const networks = this.getNetworks()
    const network =
      networks.find(network => providerUrl.includes(network.name)) ||
      networks[0]

    const errors = []

    for (const Wallet of wallets) {
      try {
        const wallet = new Wallet(defaultAccount, derivationPath)
        await wallet.connect(providerUrl, network.id)
        return wallet
      } catch (error) {
        errors.push(error.message)
      }
    }

    throw new Error(errors.join('\n'))
  },

  isConnected() {
    return (this.wallet && this.wallet.isConnected()) || !!web3
  },

  disconnect() {
    if (this.wallet) {
      this.wallet.disconnect()
    }
    this.wallet = null
    this.contracts = {}
    web3 = null
  },

  getAddress() {
    return this.getAccount()
  },

  getAccount() {
    return this.wallet.getAccount()
  },

  getWalletAttributes() {
    return {
      account: this.wallet.account,
      type: this.wallet.type,
      derivationPath: this.wallet.derivationPath
    }
  },

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/commons/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} contracts - An array comprised of a wide variety of options: objects defining contracts, Contract subclasses or Contract instances.
   */
  setContracts(contracts) {
    if (!this.isConnected()) {
      throw new Error(
        'Tried to set eth contracts without connecting successfully first'
      )
    }

    for (const contractData of contracts) {
      let contract = null
      let contractName = null

      if (typeof contractData === 'function') {
        // contractData is subclass of Contract
        contract = new contractData()
        contractName = contractData.getContractName()
      } else if (
        typeof contractData === 'object' &&
        contractData.constructor !== Object
      ) {
        // contractData is an instance of Contract or of one of its subclasses
        contract = contractData
        contractName = contractData.constructor.getContractName()
      } else {
        // contractData is an object defining the contract
        contract = new Contract(contractData)
        contractName = contractData.name
      }

      if (!contractName) continue // skip

      const instance = this.wallet.createContractInstance(
        contract.abi,
        contract.address
      )
      contract.setInstance(instance)

      this.contracts[contractName] = contract
    }
  },

  /**
   * Get a contract instance built on {@link eth#setContracts}
   * It'll throw if the contract is not found on the `contracts` mapping
   * @param  {string} name - Contract name
   * @return {object} contract
   */
  getContract(name) {
    if (!this.contracts[name]) {
      const contractNames = Object.keys(this.contracts)
      throw new Error(
        `The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are "${contractNames}"`
      )
    }

    return this.contracts[name]
  },

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  async fetchTxStatus(txId) {
    return await promisify(web3.eth.getTransaction)(txId)
  },

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    const receipt = await promisify(web3.eth.getTransactionReceipt)(txId)

    if (receipt) {
      receipt.logs = Abi.decodeLogs(receipt.logs)
    }

    return receipt
  },

  async sign(payload) {
    const message = this.utils.toHex(payload)
    const signature = await this.wallet.sign(message)
    return { message, signature }
  },

  async recover(message, signature) {
    return await this.wallet.recover(message, signature)
  },

  /**
   * Get a list of known networks
   * @return {array} - An array of objects describing each network: { id, name, label }
   */
  getNetworks() {
    return [
      {
        id: '1',
        name: 'mainnet',
        label: 'Main Ethereum Network'
      },
      {
        id: '2',
        name: 'morden',
        label: 'Morden Test Network'
      },
      {
        id: '3',
        name: 'ropsten',
        label: 'Ropsten Test Network'
      },
      {
        id: '4',
        name: 'rinkeby',
        label: 'Rinkeby Test Network'
      },
      {
        id: '42',
        name: 'kovan',
        label: 'Kovan Test Network'
      }
    ]
  },

  /**
   * Interface for the web3 `getNetwork` method (it adds the network name and label).
   * @return {object} - An object describing the current network: { id, name, label }
   */
  async getNetwork() {
    const id = await promisify(web3.version.getNetwork)()
    const networks = this.getNetworks()
    const network = networks.find(network => network.id === id)
    if (!network) {
      throw new Error('Unknown Network')
    }
    return network
  }
}
