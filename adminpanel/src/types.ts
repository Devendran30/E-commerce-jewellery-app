export interface User {
  id: number;
  name: string;
  email: string;
}

export interface product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
}

export interface productVariation {
  id: number;
  product_id: number;
  price: number;
  stock: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
}

export interface OrderStats {
  totalOrders: number;
  pending: number;
  completed: number;
  revenue: number;
}