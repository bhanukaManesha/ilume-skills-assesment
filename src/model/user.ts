import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    somethingElse?: number;
  };

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;