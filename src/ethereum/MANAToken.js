import { abi } from '../contracts/MANAToken.json'
import * as env from '../env'

import Contract from './Contract'
import TerraformReserve from './TerraformReserve'
import eth from './index'


class MANAToken extends Contract {
  async getAllowance(sender) {
    const assigned = await this.getAllowanceWei(sender)
    return eth.fromWei(assigned)
  }

  getAllowanceWei(sender) {
    return this.call('allowance', sender, TerraformReserve.address)
  }

  async getBalance(sender) {
    const manaBalance = await this.getBalanceWei(sender)
    return eth.fromWei(manaBalance)
  }

  getBalanceWei(sender) {
    return this.call('balanceOf', sender)
  }
}

export default new MANAToken('MANAToken', env.getEnv('MANA_CONTRACT_ADDRESS'), abi)
