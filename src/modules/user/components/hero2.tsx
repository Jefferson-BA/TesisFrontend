import { Hero } from "./components/Hero";
import { MenuProducts } from "./components/MenuProducts";

export const UserMenuPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0806] text-white">
      {/* 1. El Hero con su carrusel de fondo premium ocupa toda la pantalla */}
      <Hero />
      
      {/* 2. El contenedor del menú con espaciado elegante */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MenuProducts />
      </main>
    </div>
  );
};