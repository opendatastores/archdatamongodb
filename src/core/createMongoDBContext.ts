import { Db, MongoClient, ObjectID } from "mongodb";
import { IMongoDBConnectOptions } from "../IMongoDBConnectOptions";
import { IMongoDBDataContext } from "../IMongoDBDataContext";

export const createMongoDBContext = (DBClient: MongoClient, dbName: string, Options?: IMongoDBConnectOptions) => {
  let DBInstance: Db;

  const ResolveCollection = async (collection: string) => {
    if (!DBInstance) {
      await DBClient.connect();
      DBInstance = DBClient.db(dbName);
    }

    return DBInstance.collection(collection);
  };

  const dataContext: IMongoDBDataContext = {
    close: async () => {
      DBClient.close(true);
    },
    createItem: async (collection, item, options = {}) => {
      const Collection = await ResolveCollection(collection);
      const { result } = await Collection.insertOne(item, options) as any;

      return { affected: result.n };
    },
    db: async () =>
      DBInstance,
    newID: () =>
      new ObjectID(),
    queryByID: async (collection, id, options = {}) => {
      const Collection = await ResolveCollection(collection);
      const filter = { _id: id };
      const item: any = await Collection.findOne(filter, options);

      if (item === undefined || item === null) {
        return undefined;
      } else {
        return item;
      }
    },
    removeByID: async (collection, id, options = {}) => {
      const Collection = await ResolveCollection(collection);
      const { result } = await Collection.deleteOne({ _id: id }, options) as any;

      return { affected: result.n };
    },
    toRepository: (collection, defaultOptions = {}) => ({
      collection: async () =>
        ResolveCollection(collection),
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
};

Object.freeze(createMongoDBContext);
