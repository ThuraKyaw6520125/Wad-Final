"use client"; // Mark this component as a client component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams for dynamic route

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState(null);
  const params = useParams(); // Get the customer ID from the URL

  useEffect(() => {
    async function fetchCustomer() {
      if (!params.id) return;
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCustomer();
  }, [params.id]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white shadow-md p-4 rounded">
        <p><strong>Name:</strong> {customer.Name}</p>
        <p><strong>Date of Birth:</strong> {new Date(customer.DateOfBirth).toLocaleDateString()}</p>
        <p><strong>Member Number:</strong> {customer.MemberNumber}</p>
        <p><strong>Interests:</strong> {customer.Interests}</p>
      </div>
    </div>
  );
}
