import Web3 from 'web3'

import { Log } from '../log'
import { Contract } from './Contract'
import { ethUtils } from './ethUtils'

const log = new Log('Ethereum')
let web3 = null

/** @namespace */
export const eth = {
  /**
   * Filled on .connect()
   */
  contracts: {},
  web3: null,

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: ethUtils,

  /**
   * Connect to web3
   * @param  {object} [options] - Options for the ETH connection
   * @param  {array<Contract>} [options.contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link Contract#setContracts}
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.httpProviderUrl] - URL for an HTTP provider forwarded to {@link eth#getWeb3Provider}
   * @return {boolean} - True if the connection was successful
   */
  async connect(options = {}) {
    if (web3 !== null) return true

    const { contracts = [], defaultAccount, httpProviderUrl } = options

    const currentProvider = this.getWeb3Provider(httpProviderUrl)
    if (!currentProvider) {
      log.info('Could not get a valid provider for web3')
      return false
    }

    log.info('Instantiating contracts')
    web3 = new Web3(currentProvider)
    this.web3 = web3

    const account = defaultAccount || (await this.getAccounts())[0]
    if (!account) {
      log.warn('Could not get the default address from web3, please try again')
      this.disconnect()
      return false
    }

    this.setAddress(account)
    this.setContracts(contracts)

    log.info(`Got ${this.getAddress()} as current user address`)
    return true
  },

  disconnect() {
    if (web3) {
      this.setAddress(null)
    }
    web3 = null
  },

  async reconnect(...args) {
    this.disconnect()
    return await this.connect(...args)
  },

  getContract(name) {
    if (!this.contracts[name]) {
      const contractNames = Object.keys(this.contracts)
      throw new Error(
        `The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are ${contractNames}`
      )
    }

    return this.contracts[name]
  },

  async getAccounts() {
    log.info('Getting web3 accounts')
    return await Contract.transaction(web3.eth.getAccounts)
  },

  isContractOptions(contractData) {
    return (
      'name' in contractData &&
      'address' in contractData &&
      'abi' in contractData
    )
  },

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/commons/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} [contracts] - An array comprised of a a wide of options: objects defining contracts, Contract subclasses or Contract instances.
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

      const instance = web3.eth.contract(contract.abi).at(contract.address)
      contract.setInstance(instance)

      this.contracts[contractName] = contract
    }
  },

  /**
   * Gets the appropiate Web3 provider for the given environment.
   * It'll fetch it from the `window` on the browser or use a new HttpProvider instance on nodejs
   * @param  {string} [httpProviderURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
   * @return {object} The web3 provider
   */
  getWeb3Provider(httpProviderUrl = 'http://localhost:8545') {
    return typeof window !== 'undefined'
      ? window.web3 && window.web3.currentProvider
      : new Web3.providers.HttpProvider(httpProviderUrl)
  },

  /**
   * Unlocks the current account with the given password
   * @param  {string} password - Account password
   * @return {boolean} Whether the operation was successfull or not
   */
  unlockAccount(password) {
    return web3.personal.unlockAccount(this.getAddress(), password)
  },

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  fetchTxStatus(txId) {
    log.info(`Getting ${txId} status`)
    return Contract.transaction(web3.eth.getTransaction, txId)
  },

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    log.info(`Getting ${txId} receipt`)
    const receipt = await Contract.transaction(
      web3.eth.getTransactionReceipt,
      txId
    )

    if (receipt) {
      receipt.logs = Contract.decodeLogs(receipt.logs)
    }

    return receipt
  },

  async remoteSign(message, address) {
    const sign = web3.personal.sign.bind(web3.personal)
    return await Contract.transaction(sign, message, address)
  },

  async remoteRecover(message, signature) {
    return await web3.personal.ecRecover(message, signature)
  },

  setAddress(address) {
    web3.eth.defaultAccount = address
  },

  getAddress() {
    return web3.eth.defaultAccount
  },

  getBlock(blockNumber) {
    return web3.eth.getBlock(blockNumber)
  },

  setupFilter(type) {
    return web3.eth.filter(type)
  }
}
