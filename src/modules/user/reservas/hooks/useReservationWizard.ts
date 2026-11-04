import { getErrorMessage } from '@/lib/errors';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { useCatalog } from '@/modules/catalog/hooks/useCatalog';
import type { ReservationFormData } from '@/modules/reservations/interfaces/reservation.interface';
import {
  buildReservationPayload,
  contactSchema,
  logisticsSchema,
  reservationSchema,
} from '@/modules/reservations/schemas/reservation.schema';
import { createReservation } from '@/modules/reservations/services/reservation.service';
import { useUser } from '@/modules/user/hooks/useUser';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';

export const useReservationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const submitting = useRef(false);
  const { user, loadingUser } = useUser();
  const { products: productsQuery, promotions: promosQuery } = useCatalog();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const syncPromotions = useCartStore((state) => state.syncPromotions);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    date: '',
    time: '',
    guests: '',
    eventType: 'Boda',
    notes: '',
    paymentMethod: 'card',
    acceptedTerms: false,
    acceptedPrivacy: false,
  });
  useEffect(() => {
    if (user)
      setFormData((previous) => ({
        ...previous,
        name: previous.name || user.name || '',
        email: previous.email || user.email,
        phone: previous.phone || user.phone || '',
        address: previous.address || user.address || '',
      }));
  }, [user]);
  useEffect(() => {
    if (promosQuery.data) syncPromotions(promosQuery.data);
  }, [promosQuery.data, syncPromotions]);
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };
  const nextStep = () => {
    const result =
      currentStep === 1
        ? contactSchema.safeParse(formData)
        : currentStep === 3
          ? logisticsSchema.safeParse(formData)
          : null;
    if (result && !result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (
      currentStep === 2 &&
      (!cart.length || productsQuery.isError || promosQuery.isError)
    ) {
      toast.error(
        cart.length
          ? 'Actualiza el catálogo antes de continuar'
          : 'Agrega productos al carrito',
      );
      return;
    }
    setCurrentStep((previous) => Math.min(previous + 1, 4));
  };
  const prevStep = () =>
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  const submitReservation = async () => {
    if (submitting.current) return;
    if (loadingUser) return;
    if (!user) {
      toast.error('Inicia sesión para reservar');
      window.location.assign('/login');
      return;
    }
    const result = reservationSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (!cart.length) {
      toast.error('Agrega productos al carrito');
      setCurrentStep(2);
      return;
    }
    if (promosQuery.isError || productsQuery.isError) {
      toast.error('Actualiza el catálogo antes de reservar');
      return;
    }
    submitting.current = true;
    setIsLoadingSubmit(true);
    try {
      await createReservation(buildReservationPayload(formData, cart));
      clearCart();
      toast.success('Reserva creada. Podr?s pagar cuando sea aprobada.');
      window.location.assign('/user/profile');
    } catch (error) {
      toast.error(getErrorMessage(error, 'No se pudo enviar la reserva'));
    } finally {
      submitting.current = false;
      setIsLoadingSubmit(false);
    }
  };
  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    products: productsQuery.data ?? [],
    activePromos: promosQuery.data ?? [],
    isLoadingProducts: productsQuery.isPending || promosQuery.isPending,
    isLoadingSubmit,
    cart,
    cartTotal:
      cart.reduce(
        (total, item) => total + Math.round(item.price * 100) * item.quantity,
        0,
      ) / 100,
    catalogError: productsQuery.isError || promosQuery.isError,
    retryCatalog: () => {
      void productsQuery.refetch();
      void promosQuery.refetch();
    },
    handleChange,
    nextStep,
    prevStep,
    submitReservation,
  };
};
