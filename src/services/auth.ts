import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: any): string {
    return jwt.sign(payload, 'test', {
      expiresIn: 10000,
    });
  }
}
