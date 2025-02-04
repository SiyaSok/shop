/** @format */

import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Cart from "@/lib/modals/cart";

export const DELETE = async (
  request: Request,
  { params }: { params: { productId: string } } // Fix: Directly destructuring params
) => {
  try {
    if (!params?.productId) {
      return new NextResponse("Missing product ID", { status: 400 });
    }

    const { productId } = params;
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    console.log({ productId, cartItemId });

    // Validate IDs
    if (!cartItemId || !Types.ObjectId.isValid(cartItemId)) {
      return new NextResponse("Invalid cart item ID", { status: 400 });
    }

    if (!Types.ObjectId.isValid(productId)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    await connect();

    // Remove only the specific product from the cart's `items` array
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cartItemId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    console.log({ updatedCart });

    if (!updatedCart) {
      return new NextResponse("Cart item not found or could not be deleted", {
        status: 404,
      });
    }

    return NextResponse.json(
      {
        message: "Cart item deleted",
        cart: updatedCart,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return new NextResponse(
      `Error deleting cart item: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
};
