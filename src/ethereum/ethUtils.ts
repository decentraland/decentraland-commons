import Web3 = require('web3')
import ethereumJsUtil from 'ethereumjs-util'

const web3utils = new Web3()

/**
 * Some utility functions to work with Ethereum dapps.
 * It also provides a reference to the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util}
 * @namespace
 */
export const ethUtils = {
  /**
   * Extend the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util} methods
   */
  ...ethereumJsUtil,

  /**
   * Converts a given number into a BigNumber instance. Check {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3tobignumber} for more info.
   */
  toBigNumber: web3utils.toBigNumber,

  /**
   * Converts a number of wei into the desired unit
   * @param  {number|BigNumber} amount - Amount to parse
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei} for more info
   * @return {string} - Parsed result
   */
  fromWei(amount, unit = 'ether') {
    amount = web3utils.toBigNumber(amount)
    return web3utils.fromWei(amount, unit).toNumber(10)
  },

  /**
   * Converts an ethereum unit into wei
   * @param  {number|BigNumber} amount - Amount to convert
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
   * @return {string} - Parsed result
   */
  toWei(amount: number, unit = 'ether'): string {
    amount = web3utils.toBigNumber(amount)
    return web3utils.toWei(amount, unit).toNumber(10)
  },

  toHex(utf8: string) {
    return web3utils.toHex(utf8)
  },

  fromHex(hex): string {
    return web3utils.toUtf8(hex)
  },

  /**
   * ECDSA sign some data
   * @param  {Buffer|string} data    - Data to sign. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {Buffer|string} privKey - private key to sign with. If it's a string, it'll converted to an hex Buffer
   * @return {string} vrs sign result concatenated as a string
   */
  localSign(data: Buffer | string, privKey: Buffer | string) {
    if (typeof data === 'string') data = ethereumJsUtil.sha3(data)
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex')

    const vrs = ethereumJsUtil.ecsign(data, privKey)

    return `${vrs.r.toString('hex')}||${vrs.s.toString('hex')}||${vrs.v}`
  },

  /**
   * ECDSA public key recovery from signature
   * @param  {Buffer|string} data  - Signed data. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {string} signature    - The result of calling `localSign`. Concatenated string of vrs sign
   * @return {string} public key hex value
   */
  localRecover(data: Buffer | string, signature: string) {
    if (typeof data === 'string') {
      data = ethereumJsUtil.sha3(data)
    }
    let [r, s, v] = signature.split('||')

    const bufferR = Buffer.from(r, 'hex')
    const bufferS = Buffer.from(s, 'hex')
    const bufferV = parseInt(v, 10)

    const publicKey = ethereumJsUtil.ecrecover(data, bufferV, bufferR, bufferS)

    return publicKey.toString('hex')
  },

  /**
   * Returns the ethereum public key of a given private key
   * @param  {Buffer|string} privKey - private key from where to derive the public key
   * @return {string} Hex public key
   */
  privateToPublicHex(privKey: string | Buffer) {
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex')
    return ethereumJsUtil.privateToPublic(privKey).toString('hex')
  },

  /**
   * Returns the ethereum address for a given public key
   * @param  {string} pubKey - public key from where to derive the address
   * @return {string} Hex address
   */
  pubToAddressHex(pubkey: string) {
    return ethereumJsUtil.pubToAddress(pubkey).toString('hex')
  }
}
