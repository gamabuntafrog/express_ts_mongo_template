import { BaseRepository } from './BaseRepository';
import { IUserDocument, CreateUserInput, UpdateUserInput, UserSchema, UpdateUserSchema } from '../models/User';

class UserRepository extends BaseRepository<IUserDocument, CreateUserInput, UpdateUserInput> {
  protected collectionName = 'users';

  constructor() {
    super(UserSchema, UpdateUserSchema);
  }

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

}

// Export singleton instance
export default new UserRepository();

