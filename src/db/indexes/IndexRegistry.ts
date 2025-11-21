import { IndexDescription } from "mongodb";

/**
 * Registry entry for collection indexes
 */
export interface IndexRegistryEntry {
  collectionName: string;
  indexes: IndexDescription[];
}

/**
 * Global index registry
 * Repositories register their indexes here without MongoDB dependencies
 */
class IndexRegistry {
  private registry: Map<string, IndexDescription[]> = new Map();

  /**
   * Register indexes for a collection
   * @param collectionName Name of the collection
   * @param indexes Array of index descriptions
   */
  public register(collectionName: string, indexes: IndexDescription[]): void {
    if (indexes.length === 0) {
      return;
    }

    const existingIndexes = this.registry.get(collectionName) || [];
    this.registry.set(collectionName, [...existingIndexes, ...indexes]);
  }

  /**
   * Get all registered indexes for a collection
   * @param collectionName Name of the collection
   * @returns Array of index descriptions or empty array
   */
  public getIndexes(collectionName: string): IndexDescription[] {
    return this.registry.get(collectionName) || [];
  }

  /**
   * Get all registered collections with their indexes
   * @returns Array of registry entries
   */
  public getAllEntries(): IndexRegistryEntry[] {
    const entries: IndexRegistryEntry[] = [];

    this.registry.forEach((indexes, collectionName) => {
      entries.push({ collectionName, indexes });
    });

    return entries;
  }

  /**
   * Check if a collection has registered indexes
   * @param collectionName Name of the collection
   * @returns True if collection has indexes registered
   */
  public hasIndexes(collectionName: string): boolean {
    return (
      this.registry.has(collectionName) &&
      this.registry.get(collectionName)!.length > 0
    );
  }

  /**
   * Clear all registered indexes (useful for testing)
   */
  public clear(): void {
    this.registry.clear();
  }
}

// Export singleton instance
export const indexRegistry = new IndexRegistry();
