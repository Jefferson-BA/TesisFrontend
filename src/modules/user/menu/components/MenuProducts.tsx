// src/modules/user/menu/components/MenuProducts.tsx

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "../interfaces/product.interface";
import { MenuHero } from "./MenuHero";
import { MenuFilter } from "./MenuFilter";
import { ProductCard } from "./ProductCard";
import { MenuModal } from "./MenuModal";
import { WhatsAppButton } from "./WhatsAppButton";

export const MenuProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [category, setCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    getProducts()
      .then((r) => setProducts(Array.isArray(r) ? r : r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return ["Todos", ...new Set(products.map((p) => (p as any).category?.name || (p as any).category || "Criollo"))];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Filtrar por categoría
    if (category !== "Todos") {
      result = result.filter((p) => ((p as any).category?.name || (p as any).category || "Criollo") === category);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filtrar por precio máximo
    result = result.filter((p) => Number(p.price) <= priceRange[1]);

    // Ordenar
    if (sortOrder === "asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, category, searchQuery, sortOrder, priceRange]);

  const handleAddToCart = useCallback(
    (p: Product) => {
      addToCart({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: (p as any).imageUrl,
        category: (p as any).category?.name || (p as any).category || "Criollo",
      });
      toast.success(`${p.name} añadido`, {
        style: { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--ember)" },
      });
    },
    [addToCart]
  );

  return (
    <div className="w-full bg-background text-foreground min-h-screen overflow-hidden">
      <MenuHero />

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
              <div key={i} className="h-96 rounded-2xl bg-muted border border-border overflow-hidden animate-pulse">
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
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
            <button onClick={() => { setCategory("Todos"); setSearchQuery(""); setPriceRange([0, 500]); }}
              className="mt-4 text-ember hover:underline text-sm font-semibold">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => setSelected(p)}
                onAdd={() => handleAddToCart(p)}
              />
            ))}
          </div>
        )}
      </main>

      <MenuModal
        selected={selected}
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