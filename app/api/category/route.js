import Category from "@/models/Category";
import dbConnect from "@/lib/db";

// Helper function to validate the request body for POST/PUT
function validateCategoryData(body) {
  if (!body.name || !body.order) {
    throw new Error("Missing required fields: 'name' and 'order'");
  }
}

// GET: Fetch all categories, sorted by `order` field
export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find().sort({ order: -1 });
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(`Error fetching categories: ${error.message}`, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    validateCategoryData(body); // Validate the request body
    const category = new Category(body);
    await category.save();
    return new Response(JSON.stringify(category), {
      status: 201,  // Created
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(`Error creating category: ${error.message}`, { status: 400 });
  }
}

// PUT: Update an existing category
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    if (!body._id) {
      return new Response("Missing category ID (_id) in request body", { status: 400 });
    }
    validateCategoryData(body);  // Validate the request body
    const category = await Category.findByIdAndUpdate(body._id, body, { new: true });
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
    return new Response(`Error updating category: ${error.message}`, { status: 400 });
  }
}
