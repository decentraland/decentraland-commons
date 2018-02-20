import { abi } from './artifacts/TerraformReserve.json'
import { eth, Contract } from '../ethereum'
import { env } from '../env'

/** TerraformReserve contract class */
export class TerraformReserve extends Contract {
  static getContractName() {
    return 'TerraformReserve'
  }

  static getDefaultAddress() {
    return env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.utils.toWei(mana))
  }

  lockManaWei(sender, mana, opts = { gas: 1200 }) {
    eth.unlockAccount()
    return this.transaction('lockMana', sender, mana, opts)
  }
}
