import abiDecoder from 'abi-decoder'

import { promisify } from '../utils'


/** Class to work with Ethereum contracts */
class Contract {
  /**
   * @see transaction
   */
  static async transaction(method, ...args) {
    return await promisify(method)(...args)
  }

  /**
   * @see call
   */
  static async call(prop, ...args) {
    return await promisify(prop.call)(...args)
  }

  /**
   * @see decodeMethod
   */
  static decodeMethod(input) {
    return abiDecoder.decodeMethod(input)
  }

  /**
   * @see decodeLogs
   */
  static decodeLogs(logs) {
    return abiDecoder.decodeLogs(logs)
  }

  /**
   * @param  {string} name    - Name of the contract, just as a reference
   * @param  {string} address - Address of the contract
   * @param  {object} abi     - Object describing the contract (build result)
   * @return {Contract} instance
   */
  constructor(name, address, abi) {
    if (! address) throw new Error('Tried to instantiate a Contract without `address`')

    this.name = name
    this.address = address
    this.setAbi(abi)

    this.instance = null
  }

  setAbi(abi) {
    if (! abi) throw new Error('Tried to instantiate a Contract without an `abi`')
    this.abi = abi
    abiDecoder.addABI(abi)
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

  /**
   * Gets a transaction result `input` and returns a parsed object with the method execution details.
   * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
   * @param  {string} input - Hex input
   * @return {object} - Object representing the method execution
   */
  decodeMethod(input) {
    return Contract.decodeMethod(input)
  }


  /**
   * Gets a transaction recepeit `logs` and returns a parsed array with the details
   * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
   * @param  {string} logs - Hex logs
   * @return {array<object>} - An array of logs triggered by the transaction
   */
  decodeLogs(logs) {
    return Contract.decodeLogs(logs)
  }


  /**
   * Tries to find the supplied parameter to a *decoded* method @see decodeMethod. It returns the Wei value
   * A method typicaly consist of { "name": "methodName", "params": [{ "name": "paramName", "value": "VALUE_IN_WEI", "type": "uint256" }] }
   * @param  {object} decodedMethod
   * @param  {string} paramName
   * @return {string} - Found result or undefined
   */
  findParamValue(decodedMethod, paramName) {
    const params = decodedMethod.params || []
    const param = params.find(param => param.name === paramName)

    if (param) {
      return param.value
    }
  }
}

export default Contract
