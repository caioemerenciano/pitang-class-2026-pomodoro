import type { Product, ProductsResponse } from "@/types";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(
  page: number = 1,
  limit: number = 10
): Promise<ProductsResponse> {
  const skip = (page - 1) * limit;
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  
  return response.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  
  return response.json();
}
