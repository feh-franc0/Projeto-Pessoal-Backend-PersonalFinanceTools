import mongoose, { Document, Schema } from 'mongoose';

export interface IAuth extends Document {
  name: string;
  email: string;
  password: string;
}

export const AuthSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const AuthModel = mongoose.model<IAuth>('Auth', AuthSchema);