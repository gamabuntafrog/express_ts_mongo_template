import { Collection, IndexDescription } from "mongodb";
import { BaseRepository } from "@repositories/BaseRepository";
import { indexRegistry } from "@db/indexes/IndexRegistry";
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
  static readonly collectionName = "users";
  static readonly indexes: IndexDescription[] = [
    {
      key: { email: 1 },
      unique: true,
    },
  ];

  constructor(collection: Collection<IUserDocument>) {
    super(collection, UserSchema, UpdateUserSchema);
  }

  /**
   * Find user by email
   * This is a UserRepository-specific method
   */
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    return await this.findOne({ email: email.toLowerCase().trim() });
  }
}

// Register indexes when importing the module
indexRegistry.register(UserRepository.collectionName, UserRepository.indexes);

export default UserRepository;
