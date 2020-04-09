import { DataConnector } from "archdatacore";
import { MongoClient, MongoClientOptions } from "mongodb";
import { createMongoDBContext } from "./core/createMongoDBContext";
import { IMongoDBConnectOptions } from "./IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";

const DefaultOptions: MongoClientOptions = {
  useUnifiedTopology: true,
};

export const Connector: DataConnector<IMongoDBConnectorConfig, IMongoDBConnectOptions> = (config) => {
  const URI = config.connection;
  const Options = Object.assign({}, DefaultOptions, (config.options || {}));
  const DBClient: MongoClient = new MongoClient(URI, Options);

  return {
    connect: (options = {}) => createMongoDBContext(DBClient, config.dbName, Object.assign({}, Options, options)),
  };
};

Object.freeze(Connector);
