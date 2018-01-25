import { abi } from './artifacts/ReturnMANA.json'
import { Contract } from './ethereum'
import { env } from '../env'
import { Log } from '../log'

const log = new Log('ReturnMANA')

/** ReturnMANA contract class */
export class ReturnMANA extends Contract {
  static getContractName() {
    return 'ReturnMANA'
  }

  static getDefaultAddress() {
    return env.universalGet('RETURN_MANA_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  burn(amount, opts = {}) {
    log.info(`(burn) ${amount} MANA`)

    return this.transaction(
      'burn',
      amount,
      Object.assign({}, { gas: 120000 }, opts)
    )
  }

  transferBackMANA(address, amount, opts = {}) {
    log.info(`(transferBackMANA) ${amount} to ${address}`)

    return this.transaction(
      'transferBackMANA',
      address,
      amount,
      Object.assign({}, { gas: 120000 }, opts)
    )
  }

  transferBackMANAMany(addresses, amounts, opts = {}) {
    log.info(`(transferBackMANAMany) ${amounts} to ${addresses}`)

    return this.transaction(
      'transferBackMANAMany',
      addresses,
      amounts,
      Object.assign({}, { gas: 120000 }, opts)
    )
  }
}
