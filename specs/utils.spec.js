import { expect } from "chai";
import { pick } from "../src/utils";

describe("Utils", function() {
  describe("#pick", function() {
    it("should return a new object with only the asked values", function() {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
        d: {
          e: 4
        }
      };
      const newObj = pick(obj, ["a", "b"]);

      expect(newObj).to.deep.equal({
        a: 1,
        b: 2
      });
    });
  });
});
