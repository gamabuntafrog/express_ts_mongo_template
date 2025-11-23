import { Db, Collection } from "mongodb";
import { indexRegistry, IndexRegistryEntry } from "./IndexRegistry";
import logger from "@utilities/logger";

/**
 * Index Manager
 * Reads from IndexRegistry and creates indexes in MongoDB (idempotent)
 */
class IndexManager {
  /**
   * Create all registered indexes for all collections
   * @param db MongoDB database instance
   */
  public async createAllIndexes(db: Db): Promise<void> {
    const entries = indexRegistry.getAllEntries();

    if (entries.length === 0) {
      logger.info("No indexes registered");
      return;
    }

    logger.info(`Creating indexes for ${entries.length} collection(s)`);

    for (const entry of entries) {
      await this.createIndexesForCollection(db, entry);
    }

    logger.info("All indexes created successfully");
  }

  /**
   * Create indexes for a specific collection
   * @param db MongoDB database instance
   * @param entry Registry entry with collection name and indexes
   */
  private async createIndexesForCollection(
    db: Db,
    entry: IndexRegistryEntry
  ): Promise<void> {
    const { collectionName, indexes } = entry;

    try {
      const collection: Collection = db.collection(collectionName);

      logger.info(
        `Creating ${indexes.length} index(es) for collection "${collectionName}"`
      );

      // createIndexes is idempotent - it won't recreate existing indexes
      await collection.createIndexes(indexes);

      logger.info(
        `Successfully created indexes for collection "${collectionName}"`
      );
    } catch (error) {
      logger.error(
        { error, collectionName },
        `Failed to create indexes for collection "${collectionName}"`
      );
      throw error;
    }
  }

  /**
   * Create indexes for a specific collection by name
   * @param db MongoDB database instance
   * @param collectionName Name of the collection
   */
  public async createIndexesForCollectionName(
    db: Db,
    collectionName: string
  ): Promise<void> {
    const indexes = indexRegistry.getIndexes(collectionName);

    if (indexes.length === 0) {
      logger.info(`No indexes registered for collection "${collectionName}"`);
      return;
    }

    await this.createIndexesForCollection(db, {
      collectionName,
      indexes,
    });
  }
}

// Export singleton instance
export const indexManager = new IndexManager();
