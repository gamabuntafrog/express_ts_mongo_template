import { BaseRepository } from './BaseRepository';
import { IUserDocument, IUser, CreateUserInput } from '../models/User';
import { UserSchema } from '../models/User';

class UserRepository extends BaseRepository<IUserDocument, CreateUserInput, Partial<IUser>> {
  protected collectionName = 'users';

  /**
   * Create a unique index on email field
   */
  public async createIndexes(): Promise<void> {
    const collection = this.getCollection();
    await collection.createIndex({ email: 1 }, { unique: true });
  }

  /**
   * Find user by email
   * This is a UserRepository-specific method
   */
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    const collection = this.getCollection();
    return await collection.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Create a new user
   * Overrides BaseRepository.create to add Zod validation
   */
  public async create(data: CreateUserInput): Promise<IUserDocument> {
    // Validate input with zod before creating
    const validatedData = UserSchema.parse(data);
    
    // Call parent create method with validated data
    return await super.create(validatedData);
  }

  /**
   * Update user by ID
   * Overrides BaseRepository.updateById to add Zod validation
   */
  public async updateById(id: string, data: Partial<IUser>): Promise<IUserDocument | null> {
    // Validate partial data if provided
    const validatedData: Partial<IUser> = {};
    
    if (data.email) {
      validatedData.email = UserSchema.shape.email.parse(data.email);
    }
    if (data.password) {
      validatedData.password = UserSchema.shape.password.parse(data.password);
    }

    // Call parent updateById method with validated data
    return await super.updateById(id, validatedData);
  }
}

// Export singleton instance
export default new UserRepository();

