import * as env from "../env";
// import eth from "./eth";
import { Log } from "../log";

import Contract from "./Contract";
import { abi } from "../contracts/LANDTerraformSale.json";

const log = new Log("[LANDTerraformSale]");
let instance = null;

/** LANDTerraformSale contract class */
class LANDTerraformSale extends Contract {
  static getInstance() {
    if (!instance) {
      instance = new LANDTerraformSale(
        "LANDTerraformSale",
        env.get("TERRAFORM_CONTRACT_ADDRESS", ""),
        abi
      );
    }
    return instance;
  }

  buyMany(buyer, xList, yList, totalCost) {
    log.info(`BuyMany LAND for ${buyer}`);
    return this.transaction("buyMany", buyer, xList, yList, totalCost, {
      gas: 120000
    });
  }
}

module.exports = LANDTerraformSale;
