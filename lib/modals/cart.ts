/** @format */

import { Schema, model, models, Document, Types } from "mongoose";

interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image: string;
  category: Types.ObjectId;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        category: {
          type: Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = models.Cart || model<ICart>("Cart", CartSchema);

export default Cart;
