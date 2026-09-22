// src/modules/admin/promociones/components/PromotionsAdmin.tsx

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Plus, Edit, Trash2, X, Save, Tag, Calendar, Image,
  ToggleLeft, ToggleRight, ChevronDown, Flame, Percent, DollarSign,
  Package, CheckCircle2, XCircle,
} from 'lucide-react';
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../services/promotion.service';
import { getProducts } from '@/modules/admin/productos/services/product.service';
import { getCategories } from '@/modules/admin/productos/services/category.service';
import type { Promotion, CreatePromotionDto, DiscountType, ApplyTo } from '../interfaces/promotion.interface';
import { getPromoLabel, formatPromoDates } from '../utils/promoUtils';

/* ─── EMPTY FORM STATE ─── */
const EMPTY_FORM: CreatePromotionDto = {
  title: '',
  description: '',
  imageUrl: '',
  discountType: 'percentage',
  discountValue: 10,
  minQuantity: 2,
  applyTo: 'all',
  productId: null,
  categoryId: null,
  startDate: '',
  endDate: '',
  isActive: true,
};

/* ─── DISCOUNT TYPE OPTIONS ─── */
const DISCOUNT_TYPES: { value: DiscountType; label: string; icon: string }[] = [
  { value: 'percentage', label: 'Porcentaje (%)', icon: '％' },
  { value: 'fixed_amount', label: 'Monto fijo (S/)', icon: 'S/' },
  { value: 'buy_x_get_discount', label: 'Compra X y obtén descuento', icon: '🛒' },
];

const APPLY_TO_OPTIONS: { value: ApplyTo; label: string }[] = [
  { value: 'all', label: 'Todo el menú' },
  { value: 'product', label: 'Producto específico' },
  { value: 'category', label: 'Categoría específica' },
];

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
interface PromoModalProps {
  open: boolean;
  editing: Promotion | null;
  products: any[];
  categories: any[];
  onClose: () => void;
  onSaved: () => void;
}

function PromoModal({ open, editing, products, categories, onClose, onSaved }: PromoModalProps) {
  const [form, setForm] = useState<CreatePromotionDto>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description,
        imageUrl: editing.imageUrl ?? '',
        discountType: editing.discountType,
        discountValue: editing.discountValue,
        minQuantity: editing.minQuantity ?? 2,
        applyTo: editing.applyTo,
        productId: editing.product?.id ?? null,
        categoryId: editing.category?.id ?? null,
        startDate: editing.startDate,
        endDate: editing.endDate,
        isActive: editing.isActive,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editing, open]);

  const set = (key: keyof CreatePromotionDto, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreatePromotionDto = {
        ...form,
        discountValue: Number(form.discountValue),
        minQuantity: form.discountType === 'buy_x_get_discount' ? Number(form.minQuantity) : undefined,
        productId: form.applyTo === 'product' ? form.productId : null,
        categoryId: form.applyTo === 'category' ? form.categoryId : null,
        imageUrl: form.imageUrl?.trim() || undefined,
      };

      if (editing) {
        await updatePromotion(editing.id, payload);
        toast.success('Promoción actualizada ✓');
      } else {
        await createPromotion(payload);
        toast.success('Promoción creada ✓');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message ?? 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Tag size={16} className="text-amber-500" />
            </div>
            <h2 className="text-lg font-black text-foreground uppercase tracking-wide">
              {editing ? 'Editar Promoción' : 'Nueva Promoción'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Título <span className="text-amber-500">*</span>
            </label>
            <input
              id="promo-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ej. 2x1 en Tacos"
              required
              className="h-11 px-4 bg-background border border-input text-foreground rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Descripción <span className="text-amber-500">*</span>
            </label>
            <textarea
              id="promo-description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Texto que aparece en el banner"
              required
              rows={3}
              className="p-3 bg-background border border-input text-foreground rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Imagen URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Image size={14} className="text-muted-foreground" />
              URL de imagen <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
            </label>
            <input
              id="promo-image"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="h-11 px-4 bg-background border border-input text-foreground rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-1 h-20 w-full object-cover rounded-lg border border-border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tipo de descuento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Tipo de descuento <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="promo-discount-type"
                  value={form.discountType}
                  onChange={(e) => set('discountType', e.target.value as DiscountType)}
                  className="w-full h-11 pl-4 pr-10 bg-background border border-input text-foreground rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {DISCOUNT_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.icon} {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Valor del descuento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Valor del descuento <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                  {form.discountType === 'fixed_amount' ? 'S/' : '%'}
                </span>
                <input
                  id="promo-discount-value"
                  type="number"
                  min="0"
                  step={form.discountType === 'fixed_amount' ? '0.01' : '1'}
                  max={form.discountType !== 'fixed_amount' ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => set('discountValue', e.target.value)}
                  required
                  className="w-full h-11 pl-9 pr-4 bg-background border border-input text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Cantidad mínima — solo para buy_x_get_discount */}
          {form.discountType === 'buy_x_get_discount' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package size={14} className="text-amber-500" />
                Cantidad mínima para activar el descuento <span className="text-amber-500">*</span>
              </label>
              <input
                id="promo-min-qty"
                type="number"
                min="2"
                value={form.minQuantity}
                onChange={(e) => set('minQuantity', Number(e.target.value))}
                required
                className="h-11 px-4 bg-background border border-amber-500/30 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <p className="text-xs text-muted-foreground">El descuento se aplica cuando el cliente lleva ≥ {form.minQuantity ?? 2} unidades del ítem.</p>
            </div>
          )}

          {/* Aplica a */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Aplica a <span className="text-amber-500">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {APPLY_TO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('applyTo', opt.value as ApplyTo)}
                  className={`px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${
                    form.applyTo === opt.value
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
                      : 'bg-background border-input text-muted-foreground hover:border-amber-400/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector producto — solo si applyTo === 'product' */}
          {form.applyTo === 'product' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-foreground">
                Producto específico <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="promo-product"
                  value={form.productId ?? ''}
                  onChange={(e) => set('productId', e.target.value || null)}
                  required
                  className="w-full h-11 pl-4 pr-10 bg-background border border-input text-foreground rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((p) => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      {p.name} — S/ {Number(p.price).toFixed(2)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}

          {/* Selector categoría — solo si applyTo === 'category' */}
          {form.applyTo === 'category' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-foreground">
                Categoría específica <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="promo-category"
                  value={form.categoryId ?? ''}
                  onChange={(e) => set('categoryId', e.target.value || null)}
                  required
                  className="w-full h-11 pl-4 pr-10 bg-background border border-input text-foreground rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                Fecha inicio <span className="text-amber-500">*</span>
              </label>
              <input
                id="promo-start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                required
                className="h-11 px-4 bg-background border border-input text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                Fecha fin <span className="text-amber-500">*</span>
              </label>
              <input
                id="promo-end-date"
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) => set('endDate', e.target.value)}
                required
                className="h-11 px-4 bg-background border border-input text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Toggle activa */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
            <div>
              <p className="font-semibold text-sm text-foreground">Estado de la promoción</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {form.isActive ? 'Visible para los usuarios' : 'Oculta para los usuarios'}
              </p>
            </div>
            <button
              type="button"
              id="promo-toggle-active"
              onClick={() => set('isActive', !form.isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
                form.isActive
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-secondary border-input text-muted-foreground'
              }`}
            >
              {form.isActive
                ? <><ToggleRight size={18} /> Activa</>
                : <><ToggleLeft size={18} /> Inactiva</>
              }
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black uppercase tracking-wide text-sm rounded-xl transition-all"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <Save size={16} />
              }
              {editing ? 'Guardar cambios' : 'Crear promoción'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-11 bg-secondary hover:bg-secondary/70 text-secondary-foreground font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function PromotionsAdmin() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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
      .then((r) => setProducts(Array.isArray(r) ? r : r?.data ?? []))
      .catch(console.error);
    getCategories()
      .then((r) => setCategories(Array.isArray(r) ? r : r?.data ?? []))
      .catch(console.error);
  }, [fetchPromos]);

  const handleDelete = async (promo: Promotion) => {
    if (!confirm(`¿Eliminar la promoción "${promo.title}"?`)) return;
    try {
      await deletePromotion(promo.id);
      toast.success('Promoción eliminada');
      await fetchPromos();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al eliminar');
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
          <h2 className="text-2xl font-black text-foreground">Gestión de Promociones</h2>
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
          { label: 'Activas', value: promos.filter((p) => p.isActive).length, color: 'text-emerald-500' },
          { label: 'Inactivas', value: promos.filter((p) => !p.isActive).length, color: 'text-muted-foreground' },
          { label: '% Descuento', value: promos.filter((p) => p.discountType === 'percentage').length, color: 'text-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
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
                <th className="px-4 py-3.5 font-bold hidden md:table-cell">Aplica a</th>
                <th className="px-4 py-3.5 font-bold hidden lg:table-cell">Vigencia</th>
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
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <Flame size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No hay promociones registradas</p>
                    <p className="text-xs mt-1">Crea tu primera promoción con el botón de arriba.</p>
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
                          <p className="font-bold text-foreground leading-tight">{promo.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{promo.description}</p>
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
                        {promo.applyTo === 'product' && (promo.product?.name ?? '—')}
                        {promo.applyTo === 'category' && (promo.category?.name ?? '—')}
                      </span>
                    </td>

                    {/* Vigencia */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={11} />
                        {formatPromoDates(promo.startDate, promo.endDate)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs border ${
                          promo.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-secondary text-muted-foreground border-border'
                        }`}
                      >
                        {promo.isActive
                          ? <><CheckCircle2 size={11} /> Activa</>
                          : <><XCircle size={11} /> Inactiva</>
                        }
                      </span>
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