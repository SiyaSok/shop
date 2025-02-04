/** @format */

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "@/lib/db";
import Cart from "@/lib/modals/cart";
import Product from "@/lib/modals/products";

// **GET Endpoint - Fetch User's Cart**
export const GET = async (request: Request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching cart", details: error },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    await connect();

    const { userId, items } = await request.json();
    const { productId, quantity } = items;

    console.log({ items });
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid or missing product ID" },
        { status: 400 }
      );
    }
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    console.log({ cart });

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log({ product });

    const existingItem = cart.items.find(
      (item: { productId: string }) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: productId,
        title: product.title || "Unknown Product",
        price: product.price || 0, // Ensure price is a valid number
        category: product.category || "Unknown",
        image: product.image || "",
        quantity,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total: number, item: { price: number; quantity: number }) => {
        return total + (item.price ? item.price * item.quantity : 0);
      },
      0
    );

    console.log({ cart });

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error updating cart: ", error); // Log the actual error
    return NextResponse.json({ error: "Error updating cart" }, { status: 500 });
  }
};
