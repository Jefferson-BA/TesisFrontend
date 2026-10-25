// src/modules/admin/promociones/services/promotion.service.ts

import { api } from '@/api/axios';
import type { CreatePromotionDto, Promotion } from '../interfaces/promotion.interface';

/**
 * Público — sin JWT.
 * Retorna solo las promos activas con fechas vigentes.
 */
export const getActivePromotions = async (): Promise<Promotion[]> => {
  try {
    // Intentamos el endpoint active primero (por si el backend ya lo implementó)
    const res = await api.get('/promotions/active');
    if (Array.isArray(res.data)) return res.data;
  } catch (error) {
    console.warn("Endpoint /promotions/active falló, usando /promotions con filtro manual");
  }

  // Fallback: Obtenemos todas y filtramos manualmente en el frontend
  const res = await api.get('/promotions');
  const allPromos: Promotion[] = res.data;
  return allPromos.filter(promo => promo.isActive === true);
};

/**
 * Admin (JWT) — lista todas las promos sin importar estado.
 */
export const getAllPromotions = async (): Promise<Promotion[]> => {
  const res = await api.get('/promotions');
  return res.data;
};

/**
 * Admin (JWT) — crea una nueva promoción.
 */
export const createPromotion = async (data: CreatePromotionDto): Promise<Promotion> => {
  const res = await api.post('/promotions', data);
  return res.data;
};

/**
 * Admin (JWT) — actualiza campos de una promo existente.
 */
export const updatePromotion = async (
  id: number,
  data: Partial<CreatePromotionDto>
): Promise<Promotion> => {
  const res = await api.patch(`/promotions/${id}`, data);
  return res.data;
};

/**
 * Admin (JWT) — elimina una promo.
 */
export const deletePromotion = async (id: number): Promise<void> => {
  await api.delete(`/promotions/${id}`);
};
