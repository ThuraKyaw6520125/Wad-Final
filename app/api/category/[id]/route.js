import Category from "@/models/Category";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Helper function to check if an ID is a valid MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET a category by ID
export async function GET(request, { params }) {
  const { id } = params;

  // Validate the ID
  if (!isValidObjectId(id)) {
    return new Response("Invalid ID format", { status: 400 });
  }

  await dbConnect();
  try {
    const category = await Category.findById(id);
    if (!category) {
      return new Response("Category not found", { status: 404 });
    }
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  // Validate the ID
  if (!isValidObjectId(id)) {
    return new Response("Invalid ID format", { status: 400 });
  }

  await dbConnect();
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return new Response("Category not found", { status: 404 });
    }
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
