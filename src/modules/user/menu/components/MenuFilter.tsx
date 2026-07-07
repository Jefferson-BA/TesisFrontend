// src/modules/user/menu/components/MenuFilter.tsx

"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, Flame, Soup, UtensilsCrossed, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuFilterProps {
  categories: string[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  filteredLength: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "default" | "asc" | "desc";
  onSortChange: (order: "default" | "asc" | "desc") => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Todos": <UtensilsCrossed size={12} />,
  "parrillero": <Flame size={12} />,
  "parrilla": <Flame size={12} />,
  "arabe": <Soup size={12} />,
  "árabe": <Soup size={12} />,
  "criollo": <UtensilsCrossed size={12} />,
};

export const MenuFilter = ({
  categories,
  currentCategory,
  onSelectCategory,
  filteredLength,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  priceRange,
  onPriceRangeChange,
}: MenuFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
      if (lower.includes(key)) return icon;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Barra principal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4 text-ember" />
          <span>
            Menú / <span className="text-ember">{filteredLength}</span> Delicias
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Búsqueda */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar plato..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-ember/50 outline-none transition-colors"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Toggle filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2.5 rounded-xl border transition-all",
              showFilters
                ? "bg-ember/10 border-ember/30 text-ember"
                : "bg-muted border-border text-muted-foreground hover:border-ember/30"
            )}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap snap-center border flex items-center gap-1.5",
              currentCategory === cat
                ? "text-char-deep border-transparent bg-ember shadow-[0_2px_12px_color-mix(in_oklch,var(--ember)_35%,transparent)]"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-ember/40"
            )}
          >
            {getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-card border border-border animate-fade-in">
          {/* Ordenar por precio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown size={12} /> Ordenar por precio
            </label>
            <div className="flex gap-1">
              {(["default", "asc", "desc"] as const).map((order) => (
                <button
                  key={order}
                  onClick={() => onSortChange(order)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all",
                    sortOrder === order
                      ? "bg-ember text-char-deep"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {order === "default" ? "Normal" : order === "asc" ? "Menor precio" : "Mayor precio"}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de precio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Precio máximo: S/ {priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([0, Number(e.target.value)])}
              className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-ember [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ember [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>S/ 0</span>
              <span>S/ 500</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};