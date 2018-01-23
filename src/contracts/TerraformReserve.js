import { abi } from './artifacts/TerraformReserve.json'

import { eth, Contract } from '../ethereum'
import env from '../env'
import { Log } from '../log'

const log = new Log('TerraformReserve')

/** TerraformReserve contract class */
class TerraformReserve extends Contract {
  static getDefaultAddress() {
    return env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
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