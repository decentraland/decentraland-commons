import { abi } from '../contracts/TerraformReserve.json'
import { Log } from '../log'
import env from '../env'

import Contract from './Contract'
import eth from './eth'

const log = new Log('TerraformReserve')
let instance = null

/** TerraformReserve contract class */
class TerraformReserve extends Contract {
  static getInstance() {
    if (!instance) {
      // Support create-react-app imports
      const address = env.get(
        'RESERVE_CONTRACT_ADDRESS',
        env.get('REACT_APP_RESERVE_CONTRACT_ADDRESS', '')
      )

      instance = new TerraformReserve('TerraformReserve', address, abi)
    }
    return instance
  }

  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.utils.toWei(mana))
  }

  lockManaWei(sender, mana) {
    log.info(`Locking ${mana}MANA for ${eth.getAddress()}`)
    eth.unlockAccount()
    return this.transaction('lockMana', sender, mana, { gas: 120000 })
  }
}

module.exports = TerraformReserve
