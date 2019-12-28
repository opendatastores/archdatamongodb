import { IDataConnector } from "archdatacore";
import { buildDataContext } from "./core/buildDataContext";
import { IMongoDBConnectOptions } from "./IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";

export const DataConnector: IDataConnector<IMongoDBConnectorConfig, IMongoDBConnectOptions> = (config) =>
  (options) => buildDataContext(config, options);

Object.freeze(DataConnector);
