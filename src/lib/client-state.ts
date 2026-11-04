import { useCartStore } from '@/modules/cart/store/cartStore';
import { clearQueryCache } from './query-client';
export function clearPrivateClientState(preserveCart = false) {
  if (!preserveCart) useCartStore.getState().clearCart();
  clearQueryCache();
  if (typeof window === 'undefined') return;
  try {
    for (const key of ['auth-storage', 'token', 'user', 'cart', 'promos'])
      window.localStorage.removeItem(key);
    if (!preserveCart)
      window.localStorage.removeItem('deparraspitz-cart-storage');
  } catch {
    /* La sesión del servidor se elimina incluso si el almacenamiento está bloqueado. */
  }
}
