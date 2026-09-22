// src/modules/admin/promociones/interfaces/promotion.interface.ts

export type DiscountType = 'percentage' | 'fixed_amount' | 'buy_x_get_discount';
export type ApplyTo = 'product' | 'category' | 'all';

export interface PromotionProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface PromotionCategory {
  id: string;
  name: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  discountType: DiscountType;
  discountValue: number;
  minQuantity?: number;
  applyTo: ApplyTo;
  product?: PromotionProduct | null;
  category?: PromotionCategory | null;
  startDate: string;  // ISO date string "YYYY-MM-DD"
  endDate: string;    // ISO date string "YYYY-MM-DD"
  isActive: boolean;
}

export interface CreatePromotionDto {
  title: string;
  description: string;
  imageUrl?: string;
  discountType: DiscountType;
  discountValue: number;
  minQuantity?: number;
  applyTo: ApplyTo;
  productId?: string | null;
  categoryId?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
