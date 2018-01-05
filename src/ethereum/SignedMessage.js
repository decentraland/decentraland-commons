import eth from './eth'

/**
 * Work with signatures made with Ethereum wallets
 */
export default class SignedMessage {
  constructor(message, signature) {
    if (!message || !signature) {
      throw new Error('You need to supply a message and a signature')
    }

    this.message = message
    this.signature = signature
  }

  /**
   * Decodes the message for the given signature
   * @return {string} address - Address which signed the message
   */
  getAddress() {
    const decodedMessage = this.decodeMessage()
    const { v, r, s } = this.decodeSignature()

    const pubkey = eth.utils.ecrecover(
      eth.utils.hashPersonalMessage(decodedMessage),
      v,
      r,
      s
    )

    return '0x' + eth.utils.pubToAddress(pubkey).toString('hex')
  }

  /**
   * Decodes the signed message so it's ready to be stringified
   * @return {Buffer} - Buffer containing the decoded message
   */
  decodeMessage() {
    return new Buffer(this.message.substr(2), 'hex')
  }

  /**
   * Decodes the signature of a message
   * @return {Buffer} - Buffer containing the decoded signature
   */
  decodeSignature() {
    return eth.utils.fromRpcSig(new Buffer(this.signature.substr(2), 'hex'))
  }

  /**
   * Extract a value from a signed message. This function expects a particular message structure like this:
   * @example
   * Header title
   * propery1: value1
   * propery2: value2
   * ...etc
   * @param  {string} property - Property name to find
   * @return {object} - The value for the supplied propery or undefined
   */
  extract(property) {
    const propMatch = `^${property}:\\s(.*)$`
    const regexp = new RegExp(propMatch, 'gim')

    const match = regexp.exec(this.message)
    return match && match[1]
  }
}
