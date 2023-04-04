import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  earnOrSpend: string;
  price: number;
}

export const accountingSchema: Schema = new Schema({
  name: { type: String, required: true },
  earnOrSpend: { type: String, required: true }, //* Debit, credit |
  price: { type: Number, required: true },
});

export const ProductModel = mongoose.model<IProduct>('Product', accountingSchema);
