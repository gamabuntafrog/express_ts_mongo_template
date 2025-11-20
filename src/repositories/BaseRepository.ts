import { ObjectId, Collection, Filter } from 'mongodb';
import { getDb } from '../config/database';
import { IRepository } from './IRepository';

/**
 * Abstract base repository class
 * Implements common CRUD operations that can be reused by all repositories
 */
export abstract class BaseRepository<T extends { _id: ObjectId }, TCreate, TUpdate> 
  implements IRepository<T, TCreate, TUpdate> {
  
  protected abstract collectionName: string;

  /**
   * Get the MongoDB collection for this repository
   */
  protected getCollection(): Collection<T> {
    return getDb().collection<T>(this.collectionName);
  }

  /**
   * Find a document by its ID
   */
  public async findById(id: string): Promise<T | null> {
    const collection = this.getCollection();
    try {
      const objectId = new ObjectId(id);
      return await collection.findOne({ _id: objectId } as any) as T | null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a new document
   * Note: Subclasses should override this to add validation
   */
  public async create(data: TCreate): Promise<T> {
    const collection = this.getCollection();
    
    const now = new Date();
    const document = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document as any);
    const insertedDoc = await collection.findOne({ _id: result.insertedId }  as Filter<T>) as T | null;
    
    if (!insertedDoc) {
      throw new Error('Failed to create document');
    }

    return insertedDoc;
  }

  /**
   * Update a document by ID
   */
  public async updateById(id: string, data: TUpdate): Promise<T | null> {
    const collection = this.getCollection();
    try {
      const objectId = new ObjectId(id);

      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };

      await collection.updateOne(
        { _id: objectId } as any,
        { $set: updateData }
      );

      return await collection.findOne({ _id: objectId }  as Filter<T>) as T | null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete a document by ID
   */
  public async deleteById(id: string): Promise<boolean> {
    const collection = this.getCollection();
    try {
      const objectId = new ObjectId(id);
      const result = await collection.deleteOne({ _id: objectId } as Filter<T>);
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize indexes for the collection
   * Subclasses should override this to define their specific indexes
   */
  public abstract createIndexes(): Promise<void>;
}

