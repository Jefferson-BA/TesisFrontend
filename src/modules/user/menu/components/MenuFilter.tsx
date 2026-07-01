import { SlidersHorizontal, UtensilsCrossed, Flame, Soup } from "lucide-react";

interface MenuFilterProps {
  categories: string[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  filteredLength: number;
}

export const MenuFilter = ({ categories, currentCategory, onSelectCategory, filteredLength }: MenuFilterProps) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-char/40">
    <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-white/60">
      <SlidersHorizontal className="w-4 h-4 text-ember" />
      <span>Categorías / <span className="text-ember">{filteredLength}</span> Delicias</span>
    </div>
    <div className="flex items-center gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none snap-x">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap snap-center border ${
            currentCategory === cat ? "text-char-deep border-transparent bg-ember" : "bg-[#110d0a] border-[#322319] text-white/60 hover:text-white hover:border-ember/40"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {cat === "Todos" && <UtensilsCrossed size={12} />}
            {cat.toLowerCase().includes("parri") && <Flame size={12} />}
            {cat.toLowerCase().includes("arabe") && <Soup size={12} />}
            {cat}
          </span>
        </button>
      ))}
    </div>
  </div>
);