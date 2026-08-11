import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { IUser, UserRole } from '../models/User';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }

  generateToken(userId: string, role: UserRole): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined.');
    }
    // Token expires in 1 day
    return jwt.sign({ id: userId, role }, secret, { expiresIn: '1d' });
  }

  verifyToken(token: string): { id: string; role: UserRole } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined.');
    }
    return jwt.verify(token, secret) as { id: string; role: UserRole };
  }

  async registerUser(userData: Partial<IUser>): Promise<IUser> {
    const normalizedEmail = userData.email!.toLowerCase().trim();
    
    // Check if email already exists
    const emailExists = await this.userRepository.exists(normalizedEmail);
    if (emailExists) {
      throw new Error('Email is already registered');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(userData.password!);

    // Create the user object
    const newUser = await this.userRepository.create({
      name: userData.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userData.role,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name!)}`,
      isEmailVerified: false,
      isActive: true,
    });

    return newUser;
  }

  async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password selected
    const user = await this.userRepository.findByEmail(normalizedEmail, true);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive. Please contact support.');
    }

    // Verify password
    const isMatch = await this.comparePassword(password, user.password || '');
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = this.generateToken((user._id as any).toString(), user.role);

    return { user, token };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }
}
