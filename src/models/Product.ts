import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
}

export const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);



// export interface IAtendente extends Document {
//   nome: string;
//   cargo: string;
//   idade: number;
// }

// export const AtendenteSchema: Schema = new Schema({
//   nome: { type: String, required: true },
//   cargo: { type: String, required: true },
//   idade: { type: Number, required: true },
// });

// export const AtendenteModel = mongoose.model<IAtendente>('Atendente', AtendenteSchema);

