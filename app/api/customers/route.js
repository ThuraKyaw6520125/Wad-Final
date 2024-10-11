// /app/api/customers/route.js (for Next.js 13+ App Directory)
// or /pages/api/customers.js (for Next.js 12 and below)

import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

// GET all customers
export async function GET() {
  await dbConnect();
  const customers = await Customer.find({});
  return new Response(JSON.stringify(customers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST (Create) a new customer
export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const newCustomer = new Customer(body);
  await newCustomer.save();
  return new Response(JSON.stringify(newCustomer), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// PUT (Update) a customer
export async function PUT(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response(JSON.stringify(customer), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// DELETE a customer
export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response("Customer deleted successfully", { status: 200 });
}
