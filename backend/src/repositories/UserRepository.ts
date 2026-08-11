import { User, IUser } from '../models/User';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string, selectPassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (selectPassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async exists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase().trim() }).exec();
    return count > 0;
  }
}
