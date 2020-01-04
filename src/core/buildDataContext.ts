import {
  Db,
  MongoClient,
  ObjectId,
} from "mongodb";
import { IMongoDBDataContext } from "../IMongoDBDataContext";

export const buildDataContext = (client: MongoClient, dbName: string): IMongoDBDataContext =>
  ((DBClient, DBName): IMongoDBDataContext => {
    let DBInstance: Db;

    const resolveDB = (): Promise<Db> => new Promise((resolve, reject) => {
      if (DBInstance === undefined) {
        DBClient.connect()
          .then(() => {
            DBInstance = DBClient.db(DBName);
            resolve(DBInstance);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve(DBInstance);
      }
    });

    const resolveCollection = async (collection: string) => {
      const db = await resolveDB();

      return db.collection(collection);
    };

    const dataContext: IMongoDBDataContext = {
      close: () => DBClient.close(true),
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
  })(client, dbName);

Object.freeze(buildDataContext);
