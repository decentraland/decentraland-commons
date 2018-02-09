import { Log } from '../log'

import { NodeWallet } from './NodeWallet'
import { LedgerWallet } from './LedgerWallet'
import { Contract } from './Contract'
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
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.providerUrl] - URL for a provider forwarded to {@link Wallet#getWeb3Provider}
   * @return {boolean} - True if the connection was successful
   */
  async connect(options = {}) {
    if (this.isConnected()) {
      this.disconnect()
    }

    const { contracts = [], defaultAccount, providerUrl } = options

    try {
      this.wallet = await this.connectWallet(defaultAccount, providerUrl)
      web3 = this.wallet.getWeb3()

      this.setContracts(contracts)

      return true
    } catch (error) {
      log.info(`Error trying to connect Ethereum wallet: ${error.message}`)
      return false
    }
  },

  async connectWallet(defaultAccount, providerUrl) {
    let wallet

    try {
      wallet = new LedgerWallet(defaultAccount)
      await wallet.connect(providerUrl)
    } catch (error) {
      wallet = new NodeWallet(defaultAccount)
      await wallet.connect(providerUrl)
    }

    return wallet
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
        `The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are ${contractNames}`
      )
    }

    return this.contracts[name]
  },

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/commons/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} contracts - An array comprised of a wide variety of options: objects defining contracts, Contract subclasses or Contract instances.
   */
  setContracts(contracts) {
    for (const contractData of contracts) {
      let contract = null
      let contractName = null

      if (typeof contractData === 'function') {
        // contractData is subclass of Contract
        contract = new contractData()
        contractName = contractData.getContractName()
      } else if (
        typeof contractData === 'object' &&
        !this.isContractOptions(contractData)
      ) {
        // contractData is an instance of Contract or of one of its children
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

  isContractOptions(contractData) {
    return (
      'name' in contractData &&
      'address' in contractData &&
      'abi' in contractData
    )
  },

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus(txId) {
    return Contract.transaction(web3.eth.getTransaction, txId)
  },

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    const receipt = await Contract.transaction(
      web3.eth.getTransactionReceipt,
      txId
    )

    if (receipt) {
      receipt.logs = Contract.decodeLogs(receipt.logs)
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
