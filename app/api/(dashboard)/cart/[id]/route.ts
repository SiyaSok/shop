/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Cart from "@/lib/modals/cart";

// POST request to add a new item to the cart
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { productId, quantity } = body; // Expect productId and quantity in the body

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("User ID not found or invalid", { status: 400 });
    }

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse("Product ID not found or invalid", {
        status: 400,
      });
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return new NextResponse("Invalid quantity", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the item is already in the cart
    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      // Update the quantity if the item exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create a new cart item
      cartItem = new Cart({ user: userId, product: productId, quantity });
      await cartItem.save();
    }

    return new NextResponse(
      JSON.stringify({ message: "Item added to cart", cartItem }),
      { status: 201 }
    ); // 201 Created
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error adding item to cart: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};

// DELETE request to remove a cart item (updated from previous example)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DELETE = async (context: { params: any }) => {
  const cartItemId = context.params.id;
  try {
    // const { searchParams } = new URL(request.url);
    // const userId = searchParams.get("userId");
    // console.log({ userId });

    // if (!userId || !Types.ObjectId.isValid(userId)) {
    //   return new NextResponse("User ID not found or invalid", { status: 400 });
    // }

    if (!cartItemId || !Types.ObjectId.isValid(cartItemId)) {
      return new NextResponse("Cart item ID not found or invalid", {
        status: 400,
      });
    }

    await connect();

    // const user = await User.findById(userId);

    // if (!user) {
    //   return new NextResponse("User not found", { status: 404 });
    // }

    const deletedCartItem = await Cart.findOneAndDelete({
      _id: cartItemId,
      // user: userId,
    }); // Find and delete

    if (!deletedCartItem) {
      return new NextResponse("Cart item not found or could not be deleted", {
        status: 404,
      }); // 404 if not found or not deleted
    }

    return new NextResponse(
      JSON.stringify({
        message: "Cart item deleted",
        cartItem: deletedCartItem,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error deleting cart item: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};

// PATCH request to update a cart item
export const PATCH = async (request: Request, context: { params: any }) => {
  const cartItemId = context.params.cartItemId; // More descriptive name

  try {
    const body = await request.json();
    const { quantity, productId } = body; //  Expect quantity and productId in the body

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("User ID not found or invalid", { status: 400 });
    }

    if (!cartItemId || !Types.ObjectId.isValid(cartItemId)) {
      return new NextResponse("Cart item ID not found or invalid", {
        status: 400,
      });
    }

    await connect();

    const user = await User.findById(userId); // Verify user exists (important for authorization)

    if (!user) {
      return new NextResponse("User not found", { status: 404 }); // 404 is more appropriate here
    }

    const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 }); // 404 is more appropriate here
    }

    // Update the cart item
    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity, product: productId }, // Update quantity and product
      { new: true, runValidators: true } // Important: run validators!
    );

    if (!updatedCartItem) {
      return new NextResponse("Failed to update cart item", { status: 500 }); //Handle potential update failures
    }

    return new NextResponse(
      JSON.stringify({
        message: "Cart item updated",
        cartItem: updatedCartItem,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error updating cart item: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};
