import { expect } from "chai";
import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";
import { resolveConnectionURI } from "./resolveConnectionURI";

describe("resolveConnectionURI.ts tests", () => {
  describe("#resolveConnectionURI()", () => {
    it("expect to resolve a connection uri, #1", () => {
      // arranges
      const config: IMongoDBConnectorConfig = {
        host: "localhost",
        port: 27017,
      };
      const expected = "mongodb://localhost:27017";

      // acts
      const result = resolveConnectionURI(config);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to resolve a connection uri, #2", () => {
      // arranges
      const config: IMongoDBConnectorConfig = {
        host: "localhost",
      };
      const expected = "mongodb://localhost:27017";

      // acts
      const result = resolveConnectionURI(config);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to resolve a connection uri, #3", () => {
      // arranges
      const config: IMongoDBConnectorConfig = {
        host: "localhost",
        password: "password",
        port: 27017,
        user: "user",
      };
      const expected = "mongodb://user:password@localhost:27017";

      // acts
      const result = resolveConnectionURI(config);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to resolve a connection uri only connectionString", () => {
      // arranges
      const config: IMongoDBConnectorConfig = {
        connectionURL: "mongodb://one:secret@localhost:27017",
        host: "localhost",
        password: "password",
        port: 27017,
        user: "user",
      };
      const expected = "mongodb://one:secret@localhost:27017";

      // acts
      const result = resolveConnectionURI(config);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
