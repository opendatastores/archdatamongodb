import { MongoClientOptions } from "mongodb";

export interface IMongoDBConnectorConfig {
  connection?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  options?: MongoClientOptions;
}
