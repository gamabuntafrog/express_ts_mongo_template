import { ObjectId, Collection, Filter } from 'mongodb';
import { z } from 'zod';
import { IRepository } from '@repositories/IRepository';

/**
 * Abstract base repository class
 * Implements common CRUD operations that can be reused by all repositories
 */
export abstract class BaseRepository<T extends { _id: ObjectId }, TCreate, TUpdate> 
  implements IRepository<T, TCreate, TUpdate> {
  
  protected readonly collection: Collection<T>;
  protected readonly createSchema: z.ZodSchema<TCreate>;
  protected readonly updateSchema: z.ZodSchema<TUpdate>;

  constructor(collection: Collection<T>, createSchema: z.ZodSchema<TCreate>, updateSchema: z.ZodSchema<TUpdate>) {
    this.collection = collection;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }

  /**
   * Find a document by its ID
   */
  public async findById(id: string): Promise<T | null> {
    try {
      const objectId = new ObjectId(id);
      return await this.collection.findOne({ _id: objectId } as any) as T | null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a new document
   * Validates input with createSchema before creating
   */
  public async create(data: TCreate): Promise<T> {
    // Validate input with schema before creating
    const validatedData = this.createSchema.parse(data);
    
    const now = new Date();
    const document = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(document as any);
    const insertedDoc = await this.collection.findOne({ _id: result.insertedId }  as Filter<T>) as T | null;
    
    if (!insertedDoc) {
      throw new Error('Failed to create document');
    }

    return insertedDoc;
  }

  /**
   * Update a document by ID
   * Validates input with updateSchema before updating
   */
  public async updateById(id: string, data: TUpdate): Promise<T | null> {
    // Validate input with schema before updating
    const validatedData = this.updateSchema.parse(data);
    
    try {
      const objectId = new ObjectId(id);

      const updateData: any = {
        ...validatedData,
        updatedAt: new Date(),
      };

      await this.collection.updateOne(
        { _id: objectId } as any,
        { $set: updateData }
      );

      return await this.collection.findOne({ _id: objectId }  as Filter<T>) as T | null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete a document by ID
   */
  public async deleteById(id: string): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.collection.deleteOne({ _id: objectId } as Filter<T>);
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

