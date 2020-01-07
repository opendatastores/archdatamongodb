import { DataConnector, IDataConnect } from "archdatacore";
import { MongoClient, MongoClientOptions, ObjectID } from "mongodb";
import { IMongoDBConnectOptions } from "./IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";
import { IMongoDBDataContext } from "./IMongoDBDataContext";
import { NoDatabaseError } from "./NoDatabaseError";

const DefaultOptions: MongoClientOptions = {
  useNewUrlParser: true,
};

export const Connector: DataConnector<IMongoDBConnectorConfig, IMongoDBConnectOptions> = (config) => {
  const URI = config.connection;
  const Options = Object.assign({}, DefaultOptions, config.options || {});

  return ((): IDataConnect<IMongoDBConnectOptions> => {
    let DBClient = new MongoClient(URI, Options);
    let isConnected = false;

    return {
      connect: async (opts = {}) => {
        const dbName = opts.dbName || config.dbName;

        if (dbName === undefined || dbName === null) {
          throw new NoDatabaseError();
        }

        if (!isConnected) {
          await DBClient.connect();

          isConnected = true;
        }

        const DBInstance = DBClient.db(dbName);

        const dataContext: IMongoDBDataContext = {
          close: async () => {
            await DBClient.close(true);

            DBClient = new MongoClient(URI, Options);
            isConnected = false;
          },
          createItem: async (collection, item, options = {}) => {
            const Collection = await DBInstance.collection(collection);
            const { result } = await Collection.insertOne(item, options) as any;

            return { affected: result.n };
          },
          db: async () =>
            DBInstance,
          newID: () =>
            new ObjectID(),
          queryByID: async (collection, id, options = {}) => {
            const Collection = await DBInstance.collection(collection);
            const filter = { _id: id };
            const item: any = await Collection.findOne(filter, options);

            if (item === undefined || item === null) {
              return undefined;
            } else {
              return item;
            }
          },
          removeByID: async (collection, id, options = {}) => {
            const Collection = await DBInstance.collection(collection);
            const { result } = await Collection.deleteOne({ _id: id }, options) as any;

            return { affected: result.n };
          },
          toRepository: (collection, defaultOptions = {}) => ({
            collection: async () =>
              DBInstance.collection(collection),
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
      },
    };
  })();
};

Object.freeze(Connector);
