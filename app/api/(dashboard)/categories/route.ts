/** @format */

import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
// import { Types } from "mongoose";

// type Filter = {
//   user: Types.ObjectId;
//   category: Types.ObjectId;
//   $or?: Array<{
//     [key: string]: { $regex: string; $options: string };
//   }>;
//   createdAt?: {
//     $gte?: Date;
//     $lte?: Date;
//   };
// };

export const GET = async () => {
  try {
    // const { searchParams } = new URL(request.url);
    // const userId = searchParams.get("userId");
    // const categoryId = searchParams.get("categoryid");
    // const searchKeywords = searchParams.get("Keywords") as string;
    // const startDate = searchParams.get("startDate");
    // const endDate = searchParams.get("endDate");
    // const page = parseInt(searchParams.get("page") || "1");
    // const limit = parseInt(searchParams.get("limit") || "10");

    // if (!userId || !Types.ObjectId.isValid(userId)) {
    //   return new NextResponse("Invalid or missing user ID", { status: 400 });
    // }

    // if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
    //   return new NextResponse("Invalid or missing category ID", {
    //     status: 400,
    //   });
    // }

    await connect();

    // const user = await User.findById(userId);
    // if (!user) {
    //   return new NextResponse(JSON.stringify({ message: "User not found" }), {
    //     status: 404,
    //   });
    // }

    // const category = await Category.findById(categoryId);
    // if (!category) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Category not found" }),
    //     { status: 404 }
    //   );
    // }

    // const filter: Filter = {
    //   user: new Types.ObjectId(userId),
    //   category: new Types.ObjectId(categoryId),
    // };

    // if (searchKeywords) {
    //   filter.$or = [
    //     { title: { $regex: searchKeywords, $options: "i" } },
    //     { description: { $regex: searchKeywords, $options: "i" } },
    //   ];
    // }

    // if (startDate || endDate) {
    //   filter.createdAt = {};
    //   if (startDate) filter.createdAt.$gte = new Date(startDate);
    //   if (endDate) filter.createdAt.$lte = new Date(endDate);
    // }

    // const skip = (page - 1) * limit;
    const category = await Category.find();

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse("Error in fetching category: " + errorMessage, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return new NextResponse(
        JSON.stringify({ message: "Title is required" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const category = await Category.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    });

    if (category) {
      return new NextResponse(
        JSON.stringify({ message: "Category already exists" }),
        {
          status: 400,
        }
      );
    }

    const newCategory = new Category({ title });

    await newCategory.save();

    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse("Error in creating category: " + errorMessage, {
      status: 500,
    });
  }
};
