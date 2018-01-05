import Web3 from 'web3'

import { Log } from '../log'

import Contract from './Contract'

const log = new Log('Ethereum')
let web3 = null

/** @namespace */
const eth = {
  /**
   * Filled on .connect()
   */
  contracts: {},
  web3: null,

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  utils: require('./ethUtils'),

  /**
   * Connect to web3
   * @param  {string} [defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use. By default will use the available contracts
   * @param  {object} [options] - Extra options for the ETH connection
   * @param  {string} [options.httpProviderUrl] - URL for an HTTP provider forwarded to {@link eth#getWeb3Provider}
   * @return {boolean} - True if the connection was successful
   */
  async connect(defaultAccount, contracts, options = {}) {
    if (web3 !== null) return true

    const { httpProviderUrl } = options

    const currentProvider = this.getWeb3Provider(httpProviderUrl)
    if (!currentProvider) {
      log.info('Could not get a valid provider for web3')
      return false
    }

    log.info('Instantiating contracts')
    web3 = new Web3(currentProvider)
    this.web3 = web3
    this.getBlock = web3.eth.getBlock

    const accounts = defaultAccount || (await this.getAccounts())
    if (accounts.length === 0) {
      log.warn('Could not get the default address from web3, please try again')
      this.disconnect()
      return false
    }

    this.setAddress(accounts[0])
    this.setContracts(contracts || this._getDefaultContracts())

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

  // Internal. Dynamic require
  _getDefaultContracts() {
    return [
      require('./MANAToken'),
      require('./TerraformReserve'),
      require('./LANDTerraformSale'),
      require('./ReturnMANA')
    ]
  },

  getContract(name) {
    if (!this.contracts[name]) {
      throw new Error(
        `The contract ${
          name
        } not found. Did you add it to the '.connect()' call?`
      )
    }

    return this.contracts[name]
  },

  async getAccounts() {
    log.info('Getting web3 accounts')
    return await Contract.transaction(web3.eth.getAccounts)
  },

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * Usable later via `.getContract`
   * @param  {array<Contract>} [contracts] - An array of objects defining contracts or of Contract subclasses to use.
   */
  setContracts(contracts) {
    for (let contract of contracts) {
      contract = Contract.isPrototypeOf(contract)
        ? contract.getInstance()
        : new Contract(contract)

      const instance = web3.eth.contract(contract.abi).at(contract.address)
      contract.setInstance(instance)

      this.contracts[contract.name] = contract
    }
  },

  /**
   * Gets the appropiate Web3 provider for the given environment.
   * It'll fetch it from the `window` on the browser or use a new HttpProvider instance on nodejs
   * @param  {string} [httpProviderURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
   * @return {object} The web3 provider
   */
  getWeb3Provider(httpProviderUrl = 'http://localhost:8545') {
    return process.browser
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
   * @return {object} - An object describing the transaction recepeit (if it exists) with it's logs
   */
  async fetchTxReceipt(txId) {
    log.info(`Getting ${txId} recepeit`)
    const recepeit = await Contract.transaction(
      web3.eth.getTransactionReceipt,
      txId
    )

    if (recepeit) {
      recepeit.logs = Contract.decodeLogs(recepeit.logs)
    }

    return recepeit
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

  setupFilter(type) {
    return web3.eth.filter(type)
  }
}

module.exports = eth
