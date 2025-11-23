import { MongoClient, Db } from "mongodb";
import config from "@config";
import logger from "@utilities/logger";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectDB(): Promise<Db> {
  try {
    client = new MongoClient(config.MONGODB_URI);
    await client.connect();

    // Extract database name from URI or use default
    // MongoDB URI format: mongodb://host:port/database
    const uriMatch = config.MONGODB_URI.match(/\/([^/?]+)(\?|$)/);
    const dbName = uriMatch ? uriMatch[1] : "auth-db";
    db = client.db(dbName);

    logger.info("MongoDB connected successfully");
    return db;
  } catch (error) {
    logger.error({ error }, "MongoDB connection error");
    process.exit(1);
  }
}

export function getClient(): MongoClient {
  if (!client) {
    throw new Error("MongoDB client not initialized. Call connectDB() first.");
  }
  return client;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info("MongoDB connection closed");
  }
}

export default connectDB;
