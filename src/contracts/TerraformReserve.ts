import { eth, Contract } from '../ethereum'
import { env } from '../env'

const { abi } = require('./artifacts/TerraformReserve.json')

/** TerraformReserve contract class */
export class TerraformReserve extends Contract {
  getContractName() {
    return 'TerraformReserve'
  }

  getDefaultAddress() {
    return env.universalGet('TERRAFORM_RESERVE_CONTRACT_ADDRESS')
  }

  getDefaultAbi() {
    return abi
  }

  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.utils.toWei(mana))
  }

  lockManaWei(sender, mana, opts = { gas: 1200 }) {
    // TODO: this unlock account method doesnt exist
    // eth.unlockAccount()
    return this.transaction('lockMana', sender, mana, opts)
  }
}
