import userRepository from '../repositories/UserRepository';
import { NotFoundError } from '../errors/AppError';
import { ERROR_CODES } from '../constants/errorCodes';

export interface UserData {
  id: string;
  email: string;
}

class UserService {
  /**
   * Get user by ID
   * @throws NotFoundError if user not found
   */
  public async getUserById(userId: string): Promise<UserData> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found', ERROR_CODES.USER_NOT_FOUND);
    }

    return {
      id: user._id.toString(),
      email: user.email
    };
  }
}

// Export singleton instance
export default new UserService();

