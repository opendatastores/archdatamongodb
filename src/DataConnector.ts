import { IDataConnector } from "archdatacore";
import { MongoClient, MongoClientOptions } from "mongodb";
import { buildDataContext } from "./core/buildDataContext";
import { IMongoDBConnectOptions } from "./IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";
import { IMongoDBDataContext } from "./IMongoDBDataContext";
import { NoDatabaseError } from "./NoDatabaseError";

const DefaultOptions: MongoClientOptions = {};

export const DataConnector: IDataConnector<IMongoDBConnectorConfig, IMongoDBConnectOptions> = (config) => {
  const URI = config.connection;
  const Options = Object.assign({}, DefaultOptions, config.options || {});
  const client = new MongoClient(URI, Options);

  return (options = {}) => {
    const dbName = options.dbName || config.dbName;

    if (dbName === undefined || dbName === null) {
      throw new NoDatabaseError();
    }

    const dataContext: IMongoDBDataContext = buildDataContext(client, dbName);

    return dataContext;
  };
};

Object.freeze(DataConnector);
