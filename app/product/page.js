"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';  // Fallback for API base
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Function to handle starting edit mode
  const startEdit = (product) => () => {
    setEditMode(true);
    reset(product);
  };

  // Fetch products from the API
  async function fetchProducts() {
    try {
      const response = await fetch(`${APIBASE}/product`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const productsData = await response.json();
      setProducts(productsData.map((product) => ({ ...product, id: product._id })));
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("There was a problem fetching products. Please try again.");
    }
  }

  // Fetch categories from the API
  async function fetchCategories() {
    try {
      const response = await fetch(`${APIBASE}/category`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("There was a problem fetching categories. Please try again.");
    }
  }

  // Create or update a product
  const createOrUpdateProduct = async (data) => {
    const method = editMode ? "PUT" : "POST";
    const url = `${APIBASE}/product`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${editMode ? "update" : "add"} product: ${response.status}`);
      }
      alert(`Product ${editMode ? "updated" : "added"} successfully`);
      
      // Reset the form and switch off edit mode if needed
      reset({
        code: "",
        name: "",
        description: "",
        price: "",
        category: "",
      });
      setEditMode(false);
      fetchProducts();  // Refresh products list after action
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "adding"} product:`, error);
      alert(`Failed to ${editMode ? "update" : "add"} product: ${error.message}`);
    }
  };

  // Delete a product by ID
  const deleteProduct = (id) => async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${APIBASE}/product/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }
      alert("Product deleted successfully");
      fetchProducts();  // Refresh products list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <form onSubmit={handleSubmit(createOrUpdateProduct)}>
            <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
              <div>Code:</div>
              <div>
                <input
                  name="code"
                  type="text"
                  {...register("code", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Description:</div>
              <div>
                <textarea
                  name="description"
                  {...register("description")}
                  className="border border-black w-full"
                />
              </div>
              <div>Price:</div>
              <div>
                <input
                  name="price"
                  type="number"
                  {...register("price", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Category:</div>
              <div>
                <select
                  name="category"
                  {...register("category", { required: true })}
                  className="border border-black w-full"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({ code: "", name: "", description: "", price: "", category: "" });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Products ({products.length})</h1>
          <ul className="list-disc ml-8">
            {products.map((p) => (
              <li key={p._id}>
                <button className="border border-black p-1/2" onClick={startEdit(p)}>
                  📝
                </button>{" "}
                <button className="border border-black p-1/2" onClick={deleteProduct(p._id)}>
                  ❌
                </button>{" "}
                <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
