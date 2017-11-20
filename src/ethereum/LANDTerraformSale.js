import * as env from "../env";
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
        env.get("TERRAFORM_CONTRACT_ADDRESS", name => {
          return env.get("REACT_APP_TERRAFORM_CONTRACT_ADDRESS", () => {
            if (env.isProduction()) {
              throw new Error(
                "Missing TERRAFORM_CONTRACT_ADDRESS or REACT_APP_TERRAFORM_CONTRACT_ADDRESS"
              );
            }
            return "0x4bc79175f1f6fded07f04aa1b4b0465ecff6f1b3";
          })
        }),
        abi
      );
    }
    return instance;
  }

  buyMany(buyer, xList, yList, totalCost) {
    log.info(`(buyMany) LAND for ${buyer}`);
    return this.transaction("buyMany", buyer, xList, yList, totalCost, {
      gas: 120000
    });
  }

  transferBackMANA(address, amount) {
    log.info(`(transferBackMANA) ${amount} to ${address}`);
    return this.transaction("transferBackMANA", address, amount, {
      gas: 120000
    });
  }
}

module.exports = LANDTerraformSale;
