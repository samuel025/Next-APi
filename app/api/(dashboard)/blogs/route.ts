import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blogs";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "User ID is invalid" },
        { status: 400 },
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Category ID is invalid" },
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const category = await Category.findById(categoryId);
    console.log(category);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    const blogs = await Blog.find(filter);
    console.log(blogs);
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" + error.message },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "User ID is invalid" },
        { status: 400 },
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Category ID is invalid" },
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error" + error.message, {
      status: 500,
    });
  }
};
