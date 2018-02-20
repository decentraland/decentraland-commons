import { abi } from './artifacts/LANDTerraformSale.json'
import { Contract } from '../ethereum'
import { env } from '../env'

/** LANDTerraformSale contract class */
export class LANDTerraformSale extends Contract {
  static getContractName() {
    return 'LANDTerraformSale'
  }

  static getDefaultAddress() {
    return env.universalGet('LAND_TERRAFORM_SALE_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }
}
