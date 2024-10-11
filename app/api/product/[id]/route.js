import Product from "@/models/Product";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Helper function to check if the provided ID is a valid MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET: Fetch product by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;

  // Validate ID format
  if (!isValidObjectId(id)) {
    return new Response("Invalid product ID format", { status: 400 });
  }

  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  // Validate ID format
  if (!isValidObjectId(id)) {
    return new Response("Invalid product ID format", { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return new Response("Product not found", { status: 404 });
    }
    return new Response(JSON.stringify(deletedProduct), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

