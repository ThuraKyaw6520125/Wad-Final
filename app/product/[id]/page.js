export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';  // Fallback for API base
  let product = null;

  try {
    const response = await fetch(`${API_BASE}/product/${params.id}`, { cache: "no-store" });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    product = await response.json();
    console.log({ product, category: product.category });
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="m-4">
        <h1>Error</h1>
        <p>There was a problem fetching the product details. Please try again later.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="m-4">
        <h1>Product not found</h1>
        <p>The product with the specified ID could not be found.</p>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h1>Product</h1>
      <p className="font-bold text-xl text-blue-800">{product.name}</p>
      <p>{product.description}</p>
      <p>{product.price} Baht</p>
      <p>Category: {product.category?.name || "No category"}</p> {/* Safe access of category name */}
    </div>
  );
}

