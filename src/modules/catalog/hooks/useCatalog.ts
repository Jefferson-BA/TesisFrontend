import { getActivePromotions } from '@/modules/promotions/services/promotion.service';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';
export function useCatalog() {
  const products = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const promotions = useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: getActivePromotions,
  });
  return { products, promotions };
}
