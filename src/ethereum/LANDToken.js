import { abi } from "../contracts/LANDToken.json";
import env from "../env";

import Contract from "./Contract";

let instance = null;

/** LANDToken contract class */
class LANDToken extends Contract {
  static getInstance() {
    if (!instance) {
      // Support create-react-app imports
      const address = env.get(
        "LAND_CONTRACT_ADDRESS",
        env.get("REACT_APP_LAND_CONTRACT_ADDRESS", () => {
          if (env.isProduction()) {
            throw new Error(
              "Missing LAND_CONTRACT_ADDRESS or REACT_APP_LAND_CONTRACT_ADDRESS"
            );
          }
          return "0x89021CCAF582aC748A7F21cAeF68cC7b9FE17FC5";
        })
      );

      instance = new LANDToken("LANDToken", address, abi);
    }
    return instance;
  }

  getMetadata(x, y) {
    return this.call("landMetadata", x, y);
  }

  updateMetadata(coordinates, metadata) {
    const x = coordinates.map(coor => coor.x);
    const y = coordinates.map(coor => coor.y);
    return this.call("updateManyLandMetadata", x, y, metadata);
  }

  getOwner(x, y) {
    return this.call("ownerOfLand", x, y);
  }

  buildTokenId(x, y) {
    return this.call("buildTokenId", x, y);
  }

  ping(x, y) {
    return this.call("ping", x, y);
  }

  exists(x, y) {
    return this.call("exists", x, y);
  }

  transferTo(x, y, newOwner) {
    return this.call("transferLand", newOwner, x, y);
  }
}

module.exports = LANDToken;
