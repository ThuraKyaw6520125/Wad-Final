// /app/api/customers/[id]/route.js

import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

// GET a customer by ID
export async function GET(req, { params }) {
  const { id } = params;
  await dbConnect();
  const customer = await Customer.findById(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response(JSON.stringify(customer), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// PUT (Update) a customer by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();
  await dbConnect();
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response(JSON.stringify(customer), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// DELETE a customer by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  await dbConnect();
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response("Customer deleted", { status: 200 });
}


