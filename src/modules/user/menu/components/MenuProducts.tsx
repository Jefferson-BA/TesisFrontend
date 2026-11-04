import { QueryProvider } from '@/components/shared/QueryProvider';
import { useCatalog } from '@/modules/catalog/hooks/useCatalog';
import { getCategoryName } from '@/modules/catalog/utils/product';
// src/modules/user/menu/components/MenuProducts.tsx

import { useCartStore } from '@/modules/cart/store/cartStore';
import type { Product } from '@/modules/catalog/interfaces/product.interface';
import {
  calcDiscountedPrice,
  findPromoForProduct,
  getPromoLabel,
} from '@/modules/promotions/utils/promoUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MenuFilter } from './MenuFilter';
import { MenuHero } from './MenuHero';
import { MenuModal } from './MenuModal';
import { ProductCard } from './ProductCard';
import { WhatsAppButton } from './WhatsAppButton';

const MenuProductsContent = () => {
  const { products: productsQuery, promotions: promosQuery } = useCatalog();
  const products = useMemo(
    () => productsQuery.data ?? [],
    [productsQuery.data],
  );
  const activePromos = useMemo(
    () => promosQuery.data ?? [],
    [promosQuery.data],
  );
  const loading = productsQuery.isPending;
  const [selected, setSelected] = useState<Product | null>(null);
  const [category, setCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>(
    'default',
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const addToCart = useCartStore((s) => s.addToCart);
  const syncPromotions = useCartStore((s) => s.syncPromotions);

  useEffect(() => {
    if (promosQuery.data) syncPromotions(promosQuery.data);
  }, [promosQuery.data, syncPromotions]);

  const categories = useMemo(() => {
    return [
      'Todos',
      ...new Set(products.map((p) => getCategoryName(p, 'Criollo'))),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Filtrar por categoría
    if (category !== 'Todos') {
      result = result.filter((p) => getCategoryName(p, 'Criollo') === category);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      );
    }

    // Filtrar por precio máximo
    result = result.filter((p) => Number(p.price) <= priceRange[1]);

    // Ordenar
    if (sortOrder === 'asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, category, searchQuery, sortOrder, priceRange]);

  const handleAddToCart = useCallback(
    (p: Product) => {
      const categoryId: string | undefined =
        p.categoryId ??
        (typeof p.category === 'object' && p.category !== null
          ? p.category.id
          : undefined);

      const promo = findPromoForProduct(activePromos, p.id, categoryId);
      const originalPrice = Number(p.price);
      const discountedPrice = promo
        ? calcDiscountedPrice(originalPrice, promo, 1)
        : null;

      addToCart({
        id: p.id,
        name: p.name,
        price: discountedPrice !== null ? discountedPrice : originalPrice,
        originalPrice: originalPrice,
        discountType: promo?.discountType,
        discountValue: promo ? Number(promo.discountValue) : undefined,
        minQuantity: promo?.minQuantity,
        promoLabel: promo ? getPromoLabel(promo) : undefined,
        promoTitle: promo?.title,
        imageUrl: p.imageUrl || p.image,
        category: getCategoryName(p, 'Criollo'),
        categoryId,
      });

      toast.success(`${p.name} añadido`, {
        style: {
          background: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--ember)',
        },
      });
    },
    [addToCart, activePromos],
  );

  return (
    <div className="w-full bg-background text-foreground min-h-screen overflow-hidden">
      <MenuHero />
      {(productsQuery.isError || promosQuery.isError) && (
        <div role="alert" className="max-w-7xl mx-auto p-4 text-destructive">
          No se pudo actualizar el catálogo o las promociones.{' '}
          <button
            onClick={() => {
              void productsQuery.refetch();
              void promosQuery.refetch();
            }}
            className="underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto space-y-8 pb-32 pt-16 px-4 sm:px-6 lg:px-8 relative z-30">
        <MenuFilter
          categories={categories}
          currentCategory={category}
          onSelectCategory={setCategory}
          filteredLength={filtered.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-muted border border-border overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-muted-foreground/10" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-1/2 bg-muted-foreground/10 rounded" />
                  <div className="h-10 bg-muted-foreground/10 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No se encontraron productos
            </p>
            <button
              onClick={() => {
                setCategory('Todos');
                setSearchQuery('');
                setPriceRange([0, 500]);
              }}
              className="mt-4 text-ember hover:underline text-sm font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                activePromos={activePromos}
                onView={() => setSelected(p)}
                onAdd={() => handleAddToCart(p)}
              />
            ))}
          </div>
        )}
      </main>

      <MenuModal
        selected={selected}
        activePromos={activePromos}
        onClose={() => setSelected(null)}
        onConfirm={() => {
          if (selected) {
            handleAddToCart(selected);
            setSelected(null);
          }
        }}
      />

      <WhatsAppButton />
    </div>
  );
};
export const MenuProducts = () => (
  <QueryProvider>
    <MenuProductsContent />
  </QueryProvider>
);
