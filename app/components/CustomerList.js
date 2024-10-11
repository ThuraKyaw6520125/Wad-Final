// /app/components/CustomerList.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
      setCustomers(customers.filter((customer) => customer._id !== id));
    }
  };

  return (
    <div>
      <h1>Customers</h1>
      <button onClick={() => router.push("/customers/new")}>
        Add New Customer
      </button>
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {customer.Name} - {customer.MemberNumber} - {customer.Interests}
            <button
              onClick={() => router.push(`/customers/${customer._id}/edit`)}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(customer._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
