import Product from "@/models/Product";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET: Fetch all products
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    console.log(body);
    const product = new Product(body);
    await product.save();
    return new Response(JSON.stringify(product), {
      status: 201,  // Created
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(`Error: ${error.message}`, { status: 400 });
  }
}

// PUT: Replace a product by ID
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    // Validate if _id is present and valid
    if (!_id || !isValidObjectId(_id)) {
      return new Response("Invalid or missing product ID", { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
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
    console.error("Error updating product:", error);
    return new Response(`Error: ${error.message}`, { status: 400 });
  }
}

// PATCH: Partially update a product by ID
export async function PATCH(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    // Validate if _id is present and valid
    if (!_id || !isValidObjectId(_id)) {
      return new Response("Invalid or missing product ID", { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
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
    console.error("Error patching product:", error);
    return new Response(`Error: ${error.message}`, { status: 400 });
  }
}
