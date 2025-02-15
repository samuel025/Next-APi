import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const categories = await Category.find({
      user: new Types.ObjectId(user._id),
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    return new NextResponse("Error in categories" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();

    return NextResponse.json(newCategory);
  } catch (error: any) {
    return new NextResponse("Error in categories" + error.message, {
      status: 500,
    });
  }
};
