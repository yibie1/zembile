import { Document, Types } from 'mongoose';

export interface IProductVariant {
  size?: string;
  color?: string;
  material?: string;
  weight?: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface IProductReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  verified: boolean;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  thumbnail?: string;
  stock: number;
  sku: string;
  variants?: IProductVariant[];
  specifications?: Record<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  origin: {
    region?: string;
    city?: string;
    artisan?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  isDiscounted: boolean;
  rating: {
    average: number;
    count: number;
  };
  reviews: IProductReview[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  tags?: string[];
  images?: string[];
  stock: number;
  sku?: string;
  variants?: IProductVariant[];
  specifications?: Record<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  origin?: {
    region?: string;
    city?: string;
    artisan?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  subcategory?: string;
  tags?: string[];
  images?: string[];
  stock?: number;
  variants?: IProductVariant[];
  specifications?: Record<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  origin?: {
    region?: string;
    city?: string;
    artisan?: string;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface IProductFilter {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isDiscounted?: boolean;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IProductResponse {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  thumbnail?: string;
  stock: number;
  sku: string;
  variants?: IProductVariant[];
  specifications?: Record<string, string>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  origin?: {
    region?: string;
    city?: string;
    artisan?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  isDiscounted: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}