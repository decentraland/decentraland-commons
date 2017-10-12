import { abi } from '../contracts/TerraformReserve.json'
import { Log } from '../log'
import * as env from '../env'

import Contract from './Contract'
import eth from './index'


const log = new Log('[TerraformReserve]')


class TerraformReserve extends Contract {
  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.toWei(mana))
  }

  lockManaWei(sender, mana) {
    log.info(`Locking ${mana}MANA for ${eth.getAddress()}`)
    eth.unlockAccount()
    return this.transaction('lockMana', sender, mana, { gas: 120000 })
  }
}

export default new TerraformReserve('TerraformReserve', env.getEnv('RESERVE_CONTRACT_ADDRESS'), abi)
