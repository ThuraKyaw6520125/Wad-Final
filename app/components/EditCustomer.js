// /app/components/EditCustomer.js

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const EditCustomer = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    Name: "",
    DateOfBirth: "",
    MemberNumber: "",
    Interests: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/customers");
  };

  return (
    <div>
      <h1>Edit Customer</h1>
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

        <button type="submit">Update Customer</button>
      </form>
    </div>
  );
};

export default EditCustomer;

