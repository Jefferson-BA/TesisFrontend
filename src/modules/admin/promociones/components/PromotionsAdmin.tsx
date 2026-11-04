import { getErrorMessage } from '@/lib/errors';
import type { Category } from '@/modules/catalog/interfaces/category.interface';
import type { Product } from '@/modules/catalog/interfaces/product.interface';
import { PromoModal } from './PromotionModal';
// src/modules/admin/promociones/components/PromotionsAdmin.tsx

import { getCategories } from '@/modules/catalog/services/category.service';
import { getProducts } from '@/modules/catalog/services/product.service';
import type { Promotion } from '@/modules/promotions/interfaces/promotion.interface';
import {
  deletePromotion,
  getAllPromotions,
  updatePromotion,
} from '@/modules/promotions/services/promotion.service';
import {
  formatPromoDates,
  getPromoLabel,
} from '@/modules/promotions/utils/promoUtils';
import {
  Calendar,
  CheckCircle2,
  Edit,
  Flame,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

/** Toggle activo/inactivo sin recargar la página */
async function togglePromoActive(promo: Promotion): Promise<Promotion> {
  return updatePromotion(promo.id, { isActive: !promo.isActive });
}

/* ─── EMPTY FORM STATE ─── */
/* ─── BADGE ─── */
function DiscountBadge({ promo }: { promo: Promotion }) {
  const label = getPromoLabel(promo);
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 uppercase tracking-wider">
      <Flame size={10} />
      {label}
    </span>
  );
}

/* ─── MODAL ─── */
/* ─── MAIN COMPONENT ─── */
export default function PromotionsAdmin() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPromotions();
      setPromos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar las promociones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
    // Pre-load products and categories for the modal selects
    getProducts()
      .then((r) => setProducts(r))
      .catch(console.error);
    getCategories()
      .then((r) => setCategories(r))
      .catch(console.error);
  }, [fetchPromos]);

  /**
   * Toggle isActive optimistic: actualiza la UI de inmediato y luego llama
   * al backend. Si el backend falla, revierte el cambio local.
   */
  const handleToggleActive = async (promo: Promotion) => {
    if (togglingId === promo.id) return; // debounce
    setTogglingId(promo.id);

    // Optimistic update
    setPromos((prev) =>
      prev.map((p) =>
        p.id === promo.id ? { ...p, isActive: !p.isActive } : p,
      ),
    );

    try {
      await togglePromoActive(promo);
      toast.success(
        !promo.isActive ? '✓ Promoción activada' : '✗ Promoción desactivada',
      );
    } catch (err) {
      // Revert on error
      setPromos((prev) =>
        prev.map((p) =>
          p.id === promo.id ? { ...p, isActive: promo.isActive } : p,
        ),
      );
      toast.error(getErrorMessage(err, 'Error al cambiar el estado'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (promo: Promotion) => {
    if (!confirm(`¿Eliminar la promoción "${promo.title}"?`)) return;
    try {
      await deletePromotion(promo.id);
      toast.success('Promoción eliminada');
      setPromos((prev) => prev.filter((p) => p.id !== promo.id));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al eliminar'));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  /* ─── RENDER ─── */
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">
            Gestión de Promociones
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Crea descuentos, ofertas y promociones especiales para tu menú.
          </p>
        </div>
        <button
          id="btn-new-promo"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wide text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 shrink-0"
        >
          <Plus size={16} />
          Nueva Promoción
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: promos.length, color: 'text-foreground' },
          {
            label: 'Activas',
            value: promos.filter((p) => p.isActive).length,
            color: 'text-emerald-500',
          },
          {
            label: 'Inactivas',
            value: promos.filter((p) => !p.isActive).length,
            color: 'text-muted-foreground',
          },
          {
            label: '% Descuento',
            value: promos.filter((p) => p.discountType === 'percentage').length,
            color: 'text-amber-500',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5 font-bold">Título</th>
                <th className="px-4 py-3.5 font-bold">Descuento</th>
                <th className="px-4 py-3.5 font-bold hidden md:table-cell">
                  Aplica a
                </th>
                <th className="px-4 py-3.5 font-bold hidden lg:table-cell">
                  Vigencia
                </th>
                <th className="px-4 py-3.5 font-bold text-center">Estado</th>
                <th className="px-4 py-3.5 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : promos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <Flame size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">
                      No hay promociones registradas
                    </p>
                    <p className="text-xs mt-1">
                      Crea tu primera promoción con el botón de arriba.
                    </p>
                  </td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    {/* Título */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {promo.imageUrl && (
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-foreground leading-tight">
                            {promo.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {promo.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Descuento */}
                    <td className="px-4 py-4">
                      <DiscountBadge promo={promo} />
                    </td>

                    {/* Aplica a */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-muted-foreground text-xs">
                        {promo.applyTo === 'all' && 'Todo el menú'}
                        {promo.applyTo === 'product' &&
                          (promo.product?.name ?? '—')}
                        {promo.applyTo === 'category' &&
                          (promo.category?.name ?? '—')}
                      </span>
                    </td>

                    {/* Vigencia */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={11} />
                        {formatPromoDates(promo.startDate, promo.endDate)}
                      </span>
                    </td>

                    {/* Estado — clickable toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        id={`btn-toggle-promo-${promo.id}`}
                        type="button"
                        onClick={() => handleToggleActive(promo)}
                        disabled={togglingId === promo.id}
                        title={
                          promo.isActive
                            ? 'Haz clic para desactivar'
                            : 'Haz clic para activar'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs border transition-all cursor-pointer hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed ${
                          promo.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-secondary text-muted-foreground border-border hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20'
                        }`}
                      >
                        {togglingId === promo.id ? (
                          <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : promo.isActive ? (
                          <>
                            <CheckCircle2 size={11} /> Activa
                          </>
                        ) : (
                          <>
                            <XCircle size={11} /> Inactiva
                          </>
                        )}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          id={`btn-edit-promo-${promo.id}`}
                          onClick={() => openEdit(promo)}
                          title="Editar"
                          className="p-2 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          id={`btn-delete-promo-${promo.id}`}
                          onClick={() => handleDelete(promo)}
                          title="Eliminar"
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PromoModal
        open={modalOpen}
        editing={editing}
        products={products}
        categories={categories}
        onClose={closeModal}
        onSaved={fetchPromos}
      />
    </section>
  );
}
