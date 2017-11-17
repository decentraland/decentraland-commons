import * as env from "../env";

import Contract from "./Contract";
import { abi } from "../contracts/LANDTestSale.json";

let instance = null;

/** LANDTestSale contract class */
class LANDTestSale extends Contract {
  static getInstance() {
    if (!instance) {
      instance = new LANDTestSale(
        "LANDTestSale",
        env.get("LAND_TEST_SALE_CONTRACT_ADDRESS", name => {
          if (env.isProduction()) {
            throw new Error(`Missing env: ${name}`);
          }
          return "0x32345987770c17796bdb0a8d9492d468f53054c1";
        }),
        abi
      );
    }
    return instance;
  }

  buy(x, y) {
    return this.transaction("buy", x, y, { gas: 120000 });
  }
}

module.exports = LANDTestSale;
