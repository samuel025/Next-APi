import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blogs";

interface RequestContext {
  params: {
    blog: string;
  };
}

export const GET = async (request: Request, { params }: RequestContext) => {
  const blogId = params.blog;
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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: "Blog ID is invalid" },
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
