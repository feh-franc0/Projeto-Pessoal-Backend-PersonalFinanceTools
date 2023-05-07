import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAccountItem {
  name: string;
  earnOrSpend: 'earn' | 'spend';
  price: number;
}

interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  accountItems: IAccountItem[];
}

const accountItemSchema = new Schema<IAccountItem>({
  name: { type: String, required: true },
  earnOrSpend: { type: String, enum: ['earn', 'spend'], required: true },
  price: { type: Number, required: true },
});

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  accountItems: [accountItemSchema],
});

export const UserModel = mongoose.model<IUserDocument>('user', userSchema);
