"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "../interfaces/product.interface";

// --- SUBCOMPONENTES EXTRAÍDOS ---
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
  const addToCart = useCartStore((s) => s.addToCart);

  // Carga inicial de base de datos
  useEffect(() => { 
    getProducts()
      .then(r => setProducts(Array.isArray(r) ? r : r.data || []))
      .finally(() => setLoading(false)); 
  }, []);

  // Memorizar categorías únicas de los productos devueltos
  const categories = useMemo(() => {
    return ["Todos", ...new Set(products.map(p => (p as any).category?.name || (p as any).category || "Criollo"))];
  }, [products]);
  
  // Filtrado optimizado por render
  const filtered = useMemo(() => {
    if (category === "Todos") return products;
    return products.filter(p => ((p as any).category?.name || (p as any).category || "Criollo") === category);
  }, [products, category]);

  // Manejador para agregar productos al store
  const handleAddToCart = useCallback((p: Product) => {
    addToCart({ 
      id: p.id, 
      name: p.name, 
      price: Number(p.price), 
      imageUrl: (p as any).imageUrl, 
      category: (p as any).category?.name || (p as any).category || "Criollo" 
    });
    toast.success(`${p.name} añadido`, { 
      style: { background: "#0d0907", color: "#fff", border: "1px solid #eab308" } 
    });
  }, [addToCart]);

  return (
    <div className="w-full bg-char-deep text-white min-h-screen overflow-hidden">
      
      <MenuHero />

      <main className="max-w-7xl mx-auto space-y-12 pb-32 pt-16 px-4 sm:px-6 lg:px-8 relative z-30">
        
        <MenuFilter 
          categories={categories}
          currentCategory={category}
          onSelectCategory={setCategory}
          filteredLength={filtered.length}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 relative rounded-2xl bg-zinc-900/40 border border-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,color-mix(in_oklch,var(--ember)_8%,transparent)_50%,transparent_70%)] animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
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