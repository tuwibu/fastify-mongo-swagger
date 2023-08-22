import { Schema, Document, model, Model } from 'mongoose';

export interface IUser {
  username: string,
  password: string,
  role: 'admin' | 'user',
  createdAt: Date,
  updatedAt: Date
}

export interface IUserDocument extends Document, IUser {

}

interface IUserModel extends Model<IUserDocument> {

}

const schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export const User = model<IUser, IUserModel>('User', schema);

export default User;