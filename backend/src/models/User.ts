import { Schema, model, Document } from 'mongoose';

export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'HIRING_MANAGER' | 'INTERVIEWER' | 'ADMIN';

export const USER_ROLES: UserRole[] = ['CANDIDATE', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER', 'ADMIN'];

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Do not return in API queries by default
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'Role is required'],
    },
    avatar: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Customize toJSON to omit password and internal version keys
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const retVal = ret as any;
    delete retVal.password;
    delete retVal.__v;
    retVal.id = retVal._id ? retVal._id.toString() : undefined;
    delete retVal._id;
    return retVal;
  },
});

export const User = model<IUser>('User', userSchema);
