import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";

export const resolveConnectionURI = (config: IMongoDBConnectorConfig) => {
  const { connection, host, password, port = 27017, user } = config;

  if (connection) {
    return connection;
  } else {
    const uri = (user && user.length > 0) && (password && password.length > 0) ?
      `mongodb://${user}:${password}@${host}:${port}` :
      `mongodb://${host}:${port}`;

    return uri;
  }
};

Object.freeze(resolveConnectionURI);
