import { expect } from "chai";
import { DataConnector } from "./DataConnector";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";

describe("DataConnector.ts tests", () => {
  const connectorConfig: IMongoDBConnectorConfig = {
    host: "localhost",
    password: "",
    port: 27017,
    user: "",
  };

  describe("#DataConnector()", () => {
    it("expect to build the data context without throwing exceptions", () => {
      // arranges

      // acts
      const connect = DataConnector(connectorConfig);
      const result = connect();

      // asserts
      expect(result).not.to.equal(null);
      expect(result).not.to.equal(undefined);
    });
  });
});
