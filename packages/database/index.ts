import { Collection, MongoClient } from "mongodb";

const dbName = process.env.DATABASE_NAME || "testnet"

export const createMongoClient = async (uri: string): Promise<MongoClient> => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
  } catch (err) {
    console.log("Error connecting to MongoDB: ", err);
  }
  return client;
};

export const getCollection = <T extends Document>(client: MongoClient, collectionName: string): Collection<T> => {
  return client.db(dbName).collection<T>(collectionName);
};

export * from "./models/wallet.model";
export * from "./models/transaction.model";
export * from "./models/position.model";
export * from "./models/indexer_state.model";

