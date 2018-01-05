import * as env from '../env'
import { Log } from '../log'

import Contract from './Contract'
import { abi } from '../contracts/ReturnMANA.json'

const log = new Log('ReturnMANA')
let instance = null

/** ReturnMANA contract class */
class ReturnMANA extends Contract {
  static getInstance() {
    if (!instance) {
      instance = new ReturnMANA(
        'ReturnMANA',
        env.get('RETURN_MANA_ADDRESS', name => {
          return env.get('REACT_APP_RETURN_MANA_ADDRESS', () => {
            if (env.isProduction()) {
              throw new Error(
                'Missing RETURN_MANA_ADDRESS or REACT_APP_RETURN_MANA_ADDRESS'
              )
            }
            return '0xd9824914a1b1d4b5c9a135fb1e8312f6b2c3e37f'
          })
        }),
        abi
      )
    }
    return instance
  }

  burn(amount, opts = {}) {
    log.info(`(burn) ${amount} MANA`)
    return this.transaction(
      'burn',
      amount,
      Object.assign(
        {},
        {
          gas: 120000
        },
        opts
      )
    )
  }

  transferBackMANA(address, amount, opts = {}) {
    log.info(`(transferBackMANA) ${amount} to ${address}`)
    return this.transaction(
      'transferBackMANA',
      address,
      amount,
      Object.assign(
        {},
        {
          gas: 120000
        },
        opts
      )
    )
  }

  transferBackMANAMany(addresses, amounts, opts = {}) {
    log.info(`(transferBackMANAMany) ${amounts} to ${addresses}`)
    return this.transaction(
      'transferBackMANAMany',
      addresses,
      amounts,
      Object.assign(
        {},
        {
          gas: 120000
        },
        opts
      )
    )
  }
}

module.exports = ReturnMANA
