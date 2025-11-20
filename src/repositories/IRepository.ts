/**
 * Base repository interface
 * Defines common database operations that all repositories should implement
 */
export interface IRepository<T, TCreate, TUpdate> {
  /**
   * Find a document by its ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Create a new document
   */
  create(data: TCreate): Promise<T>;

  /**
   * Update a document by ID
   */
  updateById(id: string, data: TUpdate): Promise<T | null>;

  /**
   * Delete a document by ID
   */
  deleteById(id: string): Promise<boolean>;

  /**
   * Initialize indexes for the collection
   */
  createIndexes(): Promise<void>;
}


