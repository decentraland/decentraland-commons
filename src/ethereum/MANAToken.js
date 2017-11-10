import { abi } from "../contracts/MANAToken.json";
import env from "../env";

import Contract from "./Contract";
import TerraformReserve from "./TerraformReserve";
import eth from "./eth";

let instance = null;

/** MANAToken contract class */
class MANAToken extends Contract {
  static getInstance() {
    if (!instance) {
      // Support create-react-app imports
      const address = env.get(
        "MANA_CONTRACT_ADDRESS",
        env.get("REACT_APP_MANA_CONTRACT_ADDRESS", "")
      );

      instance = new MANAToken("MANAToken", address, abi);
    }
    return instance;
  }

  async getAllowance(sender) {
    const assigned = await this.getAllowanceWei(sender);
    return eth.utils.fromWei(assigned);
  }

  getAllowanceWei(sender) {
    return this.call("allowance", sender, TerraformReserve.address);
  }

  async getBalance(sender) {
    const manaBalance = await this.getBalanceWei(sender);
    return eth.utils.fromWei(manaBalance);
  }

  getBalanceWei(sender) {
    return this.call("balanceOf", sender);
  }
}

module.exports = MANAToken;
