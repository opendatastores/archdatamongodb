import { expect } from "chai";
import * as sinon from "sinon";
import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";
import { buildDataContext } from "./buildDataContext";
import { DBClient } from "./DBClient";

describe("buildDataContext.ts tests", () => {
  const config: IMongoDBConnectorConfig = {
    host: "localhost",
    password: "",
    port: 27017,
    user: "",
  };

  const testItem: any = {
    _id: undefined,
    date: new Date(),
  };

  describe("#buildDataContext()", () => {
    let clientStub: any;

    afterEach(() => {
      if (clientStub) {
        clientStub.reset();
      }
    });

    it("expect to build the data context without throwing exceptions", () => {
      // arranges

      // acts
      const act = () => buildDataContext(config);

      // asserts
      expect(act).not.to.throw(Error);
    });

    it("expect to handle an exception", async () => {
      // arranges
      clientStub = sinon.stub(DBClient as any, "create").callsFake(() => ({
        connect: () => Promise.resolve(),
        db: () => { throw new Error(); },
      }));
      const context = buildDataContext(config);

      // acts
      try {
        await context.db();
      } catch (error) {
        // asserts
        expect(error).not.to.equal(null);
        expect(error).not.to.equal(undefined);
      }
    });
  });

  describe("#DataContext", () => {
    const options = { database: "test" };
    const dataContext = buildDataContext(config, options);

    after(async () => {
      const db = await dataContext.db();
      await db.dropDatabase();
      dataContext.close();
    });

    describe("#DataContext.db()", () => {
      it("expect to resolve the database instance, #1", async () => {
        // arranges

        // acts
        const db = await dataContext.db();

        // asserts
        expect(db).not.to.equal(null);
        expect(db).not.to.equal(undefined);
      });

      it("expect to resolve the database instance, #2", async () => {
        // arranges

        // acts
        const db1 = await dataContext.db();
        const db2 = await dataContext.db();

        // asserts
        expect(db1).to.equal(db2);
      });
    });

    describe("#DataContext.newID()", () => {
      it("expect to create a new ID", () => {
        // arranges

        // acts
        const id = dataContext.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });
    });

    describe("#DataContext.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.createItem("sample", testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.queryByID()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await dataContext.queryByID("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });
    });

    describe("#DataContext.removeByID()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.removeByID("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = dataContext.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await dataContext.removeByID("sample", id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.toRepository", () => {
      it("expect to resolve a repository", () => {
        // arranges

        // acts
        const result = dataContext.toRepository("sample");

        // asserts
        expect(result).not.to.equal(null);
        expect(result).not.to.equal(undefined);
      });
    });
  });

  describe("#Repository", () => {
    const dataContext = buildDataContext(config);
    const repository = dataContext.toRepository("sample");

    after(async () => {
      const db = await dataContext.db();
      await db.dropDatabase();
      dataContext.close();
    });

    describe("#Repository.collection()", () => {
      it("expect to resolve the collection instance", async () => {
        // arranges

        // acts
        const collection = await repository.collection();

        // asserts
        expect(collection).not.to.equal(null);
        expect(collection).not.to.equal(undefined);
      });
    });

    describe("#Repository.newID()", () => {
      it("expect to create a new ID", () => {
        // arranges

        // acts
        const id = repository.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });
    });

    describe("#Repository.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.createItem(testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#Repository.queryByID()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await repository.queryByID(testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });

      it("expect to get undefined as item not exist", async () => {
        // arranges

        // acts
        const result = await repository.queryByID("12345");

        // asserts
        expect(result).to.equal(undefined);
      });
    });

    describe("#Repository.removeByID()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.removeByID(testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = repository.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await repository.removeByID(id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });
  });
});
