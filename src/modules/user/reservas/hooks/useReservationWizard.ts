import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { createReservation } from "@/modules/admin/pedidos/services/order.service"; // 🗑️ Quitamos createOrder
import { getActivePromotions } from "@/modules/admin/promociones/services/promotion.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/menu/interfaces/product.interface";
import type { Promotion } from "@/modules/admin/promociones/interfaces/promotion.interface";

export const useReservationWizard = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [activePromos, setActivePromos] = useState<Promotion[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
    
    // Solo necesitamos el estado de carga
    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);

    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);
    const syncPromotions = useCartStore((state) => state.syncPromotions);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        date: "",
        time: "",
        guests: "",
        eventType: "Boda",
        notes: "",
        paymentMethod: "card",
        acceptedTerms: false,
        acceptedPrivacy: false,
    });

    const cartTotal = cart.reduce(
        (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
    );

    useEffect(() => {
        const fetchMenuAndPromos = async () => {
            try {
                const [resProducts, resPromos] = await Promise.allSettled([
                    getProducts(),
                    getActivePromotions(),
                ]);

                if (resProducts.status === "fulfilled") {
                    const res = resProducts.value;
                    const data = Array.isArray(res) ? res : (res as any).data || [];
                    setProducts(data);
                }

                if (resPromos.status === "fulfilled") {
                    const promos = Array.isArray(resPromos.value) ? resPromos.value : [];
                    setActivePromos(promos);
                    syncPromotions(promos);
                }
            } catch (error) {
                console.error("Error cargando productos o promociones:", error);
                toast.error("Error al cargar la carta y promociones.");
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchMenuAndPromos();
    }, [syncPromotions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const submitReservation = async () => {
        if (cart.length === 0) {
            toast.error("Tu carrito está vacío. Agrega buffets o parrillas en el Paso 2.");
            setCurrentStep(2);
            return;
        }

        if (!formData.date) {
            toast.error("Por favor completa la fecha del evento en el Paso 3.");
            setCurrentStep(3);
            return;
        }

        const items = cart.map((item) => ({
            productId: String(item.id),
            quantity: Number(item.quantity),
        }));

        setIsLoadingSubmit(true);

        try {
            // 1️⃣ Solo armamos y enviamos la reserva
            const reservationPayload = {
                eventDate: formData.date,
                serviceStartTime: formData.time || "12:00",
                guestsCount: Number(formData.guests) || 1,
                venueAddress: formData.address || "Dirección pendiente",
                city: formData.city || "Ciudad pendiente",
                additionalNotes: formData.notes || "",
                items: items,
                acceptedTerms: (formData as any).acceptedTerms ?? true,
                acceptedPrivacy: (formData as any).acceptedPrivacy ?? true,
            };

            await createReservation(reservationPayload);

            // 2️⃣ Éxito: Limpiamos y redirigimos
            toast.success("¡Reserva creada con éxito! Esperando aprobación del administrador para proceder al pago.");
            
            clearCart(); 

            // Redirigir al usuario al perfil
            setTimeout(() => {
                window.location.href = "/user/profile"; 
            }, 2000);

        } catch (error: any) {
            console.error("Error al procesar reserva:", error);
            const backendMessage = error.response?.data?.message;
            const alertMessage = Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage;
            toast.error(alertMessage || "Error al enviar la reserva");
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    return {
        currentStep,
        setCurrentStep,
        formData,
        products,
        activePromos,
        isLoadingProducts,
        isLoadingSubmit,
        cart,
        cartTotal,
        handleChange,
        setFormData,
        nextStep,
        prevStep,
        submitReservation,
    };
};