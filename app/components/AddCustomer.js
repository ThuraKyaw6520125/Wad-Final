// /app/components/AddCustomer.js

import React, { useState } from "react";
import { useRouter } from "next/router";

const AddCustomer = () => {
  const [form, setForm] = useState({
    Name: "",
    DateOfBirth: "",
    MemberNumber: "",
    Interests: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/customers");
  };

  return (
    <div>
      <h1>Add New Customer</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={form.Name}
          onChange={(e) => setForm({ ...form, Name: e.target.value })}
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={form.DateOfBirth}
          onChange={(e) => setForm({ ...form, DateOfBirth: e.target.value })}
        />

        <label>Member Number</label>
        <input
          type="number"
          value={form.MemberNumber}
          onChange={(e) =>
            setForm({ ...form, MemberNumber: e.target.value })
          }
        />

        <label>Interests</label>
        <input
          type="text"
          value={form.Interests}
          onChange={(e) => setForm({ ...form, Interests: e.target.value })}
        />

        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;

