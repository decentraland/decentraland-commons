import { promisify } from '../utils'
import { Abi } from './Abi'
import { Event } from './Event'

/** Class to work with Ethereum contracts */
export class Contract {
  /**
   * Get the contract name
   * @return {string} - contract name
   */
  static getContractName() {
    throw new Error('Not implemented, please override `getContractName`')
  }

  /**
   * Get the default address used for this contract. You should override it on subclasses
   * @return {string} - address
   */
  static getDefaultAddress() {
    throw new Error('Not implemented, please override `getDefaultAddress`')
  }

  /**
   * Get the default abi used for this contract. You should override it on subclasses
   * @return {object} - abi
   */
  static getDefaultAbi() {
    throw new Error('Not implemented, please override `getDefaultAbi`')
  }

  /**
   * Get the contract events from the abi
   * @return {Array<string>} - events
   */
  static getEvents() {
    return new Abi(this.getDefaultAbi()).getEvents()
  }

  /**
   * Checks if an address is actually 0 in hex or a falsy value
   * @param  {string} address
   * @return {boolean}
   */
  static isEmptyAddress(address) {
    return !address || address === '0x0000000000000000000000000000000000000000'
  }

  /**
   * See {@link Contract#transaction}
   */
  static async transaction(method, ...args) {
    return await promisify(method)(...args)
  }

  /**
   * See {@link Contract#call}
   */
  static async call(prop, ...args) {
    return await promisify(prop.call)(...args)
  }

  /**
   * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
   * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
   * @return {Contract} instance
   */
  constructor(address, abi) {
    this.setAddress(address || this.constructor.getDefaultAddress())
    this.setAbi(abi || this.constructor.getDefaultAbi())
    this.instance = null

    this.abi.extend(this)
  }

  /**
   * Set's the address of the contract. It'll throw on falsy values
   * @param {string} address - Address of the contract
   */
  setAddress(address) {
    if (!address) {
      throw new Error('Tried to instantiate a Contract without an `address`')
    }

    this.address = address
  }

  /**
   * Set's the abi of the contract. It'll throw on falsy values
   * @param {object} abi - Abi of the contract
   */
  setAbi(abi) {
    if (!abi) {
      throw new Error('Tried to instantiate a Contract without an `abi`')
    }

    this.abi = Abi.new(abi)
  }

  setInstance(instance) {
    this.instance = instance
  }

  /**
   * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
   * @param  {string}    method - Method name
   * @param  {...object} args   - Every argument after the name will be fordwarded to the transaction method, in order
   * @return {Promise} - promise that resolves when the transaction does
   */
  transaction(method, ...args) {
    return Contract.transaction(this.instance[method], ...args)
  }

  /**
   * Inoke a contract function that does not broadcast or publish anything on the blockchain.
   * @param  {string}    prop - Prop name
   * @param  {...object} args   - Every argument after the name will be fordwarded to the call function, in order
   * @return {Promise} - promise that resolves when the call does
   */
  call(prop, ...args) {
    return Contract.call(this.instance[prop], ...args)
  }

  getEvent(eventName) {
    return new Event(this, eventName)
  }
}
