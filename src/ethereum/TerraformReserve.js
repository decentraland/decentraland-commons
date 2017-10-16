import { abi } from "../contracts/TerraformReserve.json";
import { Log } from "../log";
import * as env from "../env";

import Contract from "./Contract";
import eth from "./index";

const log = new Log("[TerraformReserve]");
let instance = null;

/** TerraformReserve contract class */
class TerraformReserve extends Contract {
  static getInstance() {
    if (!instance) {
      instance = new TerraformReserve(
        "TerraformReserve",
        env.getEnv("RESERVE_CONTRACT_ADDRESS", ""),
        abi
      );
    }
    return instance;
  }

  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.toWei(mana));
  }

  lockManaWei(sender, mana) {
    log.info(`Locking ${mana}MANA for ${eth.getAddress()}`);
    eth.unlockAccount();
    return this.transaction("lockMana", sender, mana, { gas: 120000 });
  }
}

module.exports = TerraformReserve;
