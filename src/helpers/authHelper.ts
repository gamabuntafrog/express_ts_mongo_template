import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config';

class AuthHelper {
  private readonly JWT_SECRET: string;
  private readonly SALT_ROUNDS: number = 10;

  constructor() {
    this.JWT_SECRET = config.JWT_SECRET;
  }

  /**
   * Generate JWT token for user
   */
  public generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: '7d'
    });
  }

  /**
   * Hash password using bcrypt
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare plain password with hashed password
   */
  public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Export singleton instance
export default new AuthHelper();

