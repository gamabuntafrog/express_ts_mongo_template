import UserRepository from '@repositories/UserRepository';
import { ConflictError, UnauthorizedError } from '@errors/AppError';
import authHelper from '@helpers/authHelper';
import { ERROR_CODES } from '@constants/errorCodes';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Register new user
   * @throws ConflictError if user already exists
   */
  public async register(data: RegisterData): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists', ERROR_CODES.USER_ALREADY_EXISTS);
    }

    // Hash password before saving
    const hashedPassword = await authHelper.hashPassword(data.password);

    // Create new user
    const user = await this.userRepository.create({ email: data.email, password: hashedPassword });

    // Generate token
    const token = authHelper.generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      }
    };
  }

  /**
   * Login user
   * @throws UnauthorizedError if credentials are invalid
   */
  public async login(data: LoginData): Promise<AuthResult> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await authHelper.comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = authHelper.generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      }
    };
  }
}

export default AuthService;

