import { Collection } from "mongodb";
import { BaseRepository } from "@repositories/BaseRepository";
import {
  IUserDocument,
  CreateUserInput,
  UpdateUserInput,
  UserSchema,
  UpdateUserSchema,
} from "@models/User";

class UserRepository extends BaseRepository<
  IUserDocument,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(collection: Collection<IUserDocument>) {
    super(collection, UserSchema, UpdateUserSchema);
  }

  /**
   * Create a unique index on email field
   */
  public async createIndexes(): Promise<void> {
    await this.collection.createIndex({ email: 1 }, { unique: true });
  }

  /**
   * Find user by email
   * This is a UserRepository-specific method
   */
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    return await this.collection.findOne({ email: email.toLowerCase().trim() });
  }
}

export default UserRepository;
