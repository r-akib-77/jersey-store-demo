export type ProductCategory = "club" | "national" | "retro" | "training";

export type ProductFilter = "all" | ProductCategory;

export interface ProductDetail {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  image: string;
  sizes: string[];
  shortDescription: string;
  description: string;
  details: ProductDetail[];
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  /** Unique key: product id + selected size */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  note: string;
}

export interface NavLink {
  label: string;
  href: string;
}
