import { expect } from "chai";
import { DBClient } from "./DBClient";

describe("DBClient.ts tests", () => {
  describe("#BClient.create()", () => {
    it("expect to create a client without throwing exceptions", () => {
      // arranges
      const config: any = {};

      // acts
      const act = () => DBClient.create(config);

      // asserts
      expect(act).not.to.throw(Error);
    });
  });
});
