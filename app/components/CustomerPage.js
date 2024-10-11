'use client'; // For client-side rendering
import Link from "next/link"; // Import Link for navigation
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'; // Set API base
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Fetch all customers from the API
  async function fetchCustomers() {
    try {
      const response = await fetch(`${APIBASE}/customers`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load customers. Please try again later.");
    }
  }

  // Create or Update customer
  const createOrUpdateCustomer = async (data) => {
    const method = editMode ? "PUT" : "POST";
    const url = `${APIBASE}/customers`;

    const customerData = {
      _id: editingCustomerId, // Used for updating the customer
      ...data,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) throw new Error(`Failed to ${editMode ? "update" : "add"} customer`);
      alert(`Customer ${editMode ? "updated" : "added"} successfully`);

      reset(); // Reset the form
      setEditMode(false);
      setEditingCustomerId(null);
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error(error);
      alert(`Failed to ${editMode ? "update" : "add"} customer`);
    }
  };

  // Delete a customer by ID
  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`${APIBASE}/customers?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete customer");
      alert("Customer deleted successfully");
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer");
    }
  };

  // Edit a customer (set form values for editing)
  const startEdit = (customer) => () => {
    setEditMode(true);
    reset(customer); // Populate form with customer data
    setEditingCustomerId(customer._id); // Store the customer's ID
  };

  // Fetch customers on page load
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      {/* Form to add/update customer */}
      <form onSubmit={handleSubmit(createOrUpdateCustomer)} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="Name">Name:</label>
            <input
              name="Name"
              type="text"
              {...register("Name", { required: true })}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="DateOfBirth">Date of Birth:</label>
            <input
              name="DateOfBirth"
              type="date"
              {...register("DateOfBirth", { required: true })}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="MemberNumber">Member Number:</label>
            <input
              name="MemberNumber"
              type="number"
              {...register("MemberNumber", { required: true })}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="Interests">Interests:</label>
            <input
              name="Interests"
              type="text"
              {...register("Interests", { required: true })}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editMode ? "Update" : "Add"} Customer
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => {
                reset();
                setEditMode(false);
                setEditingCustomerId(null);
              }}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of customers */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Customer List</h2>
        <ul>
          {customers.map((customer) => (
            <li key={customer._id} className="flex justify-between mb-2">
              <div>
                <Link href={`/customers/${customer._id}`} passHref>
                  <span className="font-semibold cursor-pointer text-blue-500 hover:underline">{customer.Name}</span>
                </Link>
                {" "} - {customer.Interests}
              </div>
              <div>
                <button
                  onClick={startEdit(customer)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(customer._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
