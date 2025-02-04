/** @format */

import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import Product from "@/lib/modals/products";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

interface Filter {
  category: Types.ObjectId;
  $or?: Array<{
    [key: string]: { $regex: string; $options: string };
  }>;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  const categoryId = context.params.id;

  try {
    await connect();

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or missing category ID", {
        status: 400,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    const filter: Filter = {
      category: new Types.ObjectId(categoryId),
    };

    const products = await Product.find(filter); // Corrected variable name to lowercase 'products'

    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(`Error in fetching products: ${errorMessage}`, {
      // Template literal for cleaner string concatenation
      status: 500,
    });
  }
};
