import { Db, ObjectId } from "mongodb";
import { IMongoDBConnectOptions } from "../IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";
import { IMongoDBDataContext } from "../IMongoDBDataContext";
import { DBClient } from "./DBClient";

export const buildDataContext = (config: IMongoDBConnectorConfig, opts: IMongoDBConnectOptions = {}): IMongoDBDataContext =>
  ((Config, Options): IMongoDBDataContext => {
    let dbInstance: Db;
    const client = DBClient.create(Config);
    const database = Options.database || Config.database;

    const resolveDB = (): Promise<Db> => new Promise((resolve, reject) => {
      if (dbInstance === undefined) {
        client.connect()
          .then(() => {
            dbInstance = client.db(database);
            resolve(dbInstance);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve(dbInstance);
      }
    });

    const resolveCollection = async (collection: string) => {
      const db = await resolveDB();

      return db.collection(collection);
    };

    const dataContext: IMongoDBDataContext = {
      close: () => client.close(true),
      createItem: async (collection, item, options = {}) => {
        const Collection = await resolveCollection(collection);
        const { result } = await Collection.insertOne(item, options) as any;

        return { affected: result.n };
      },
      db: resolveDB,
      newID: () => new ObjectId(),
      queryByID: async (collection, id, options = {}) => {
        const Collection = await resolveCollection(collection);
        const filter = { _id: id };
        const item: any = await Collection.findOne(filter, options);

        if (item === undefined || item === null) {
          return undefined;
        } else {
          return item;
        }
      },
      removeByID: async (collection, id, options = {}) => {
        const Collection = await resolveCollection(collection);
        const { result } = await Collection.deleteOne({ _id: id }, options) as any;

        return { affected: result.n };
      },
      toRepository: (collection, defaultOptions = {}) => ({
        collection: () =>
          resolveCollection(collection),
        createItem: (item, options = {}) =>
          dataContext.createItem(collection, item, Object.assign(options, defaultOptions)),
        newID: () =>
          dataContext.newID(),
        queryByID: (id, options = {}) =>
          dataContext.queryByID(collection, id, Object.assign(options, defaultOptions)),
        removeByID: (id, options = {}) =>
          dataContext.removeByID(collection, id, Object.assign(options, defaultOptions)),
      }),
    };

    return dataContext;
  })(config, opts);

Object.freeze(buildDataContext);
