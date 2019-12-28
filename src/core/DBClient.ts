import { MongoClient, MongoClientOptions } from "mongodb";
import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";
import { resolveConnectionURI } from "./resolveConnectionURI";

export const DBClient = {
  create: (config: IMongoDBConnectorConfig) => {
    const defaultOptions: MongoClientOptions = {
      useUnifiedTopology: true,
    };

    const initialOptions = Object.assign(defaultOptions, (config.options || {}));
    const uri = resolveConnectionURI(config);

    const client = new MongoClient(uri, initialOptions);

    return client;
  },
};
