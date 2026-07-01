import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { createReservation } from "@/modules/admin/pedidos/services/order.service"; // 🗑️ Quitamos createOrder
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/menu/interfaces/product.interface";

export const useReservationWizard = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
    
    // Solo necesitamos el estado de carga
    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    
    // 🗑️ Quitamos los estados de Culqi (pendingOrderId y isCulqiModalOpen) porque ya no se paga aquí.

    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);

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
    });

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await getProducts();
                const data = Array.isArray(res) ? res : res.data || [];
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos:", error);
                toast.error("Error al cargar la carta y promociones reales.");
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchMenu();
    }, []);

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
                items: items,
            };

            await createReservation(reservationPayload);

            // 2️⃣ Éxito: Limpiamos y redirigimos
            toast.success("¡Reserva creada con éxito! Esperando aprobación del administrador para proceder al pago.");
            
            clearCart(); 

            // Redirigir al usuario (Ajusta la URL "/perfil/reservas" a la ruta real de tu proyecto)
            setTimeout(() => {
                window.location.href = "/"; 
            }, 2500);

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
        formData,
        products,
        isLoadingProducts,
        isLoadingSubmit,
        handleChange,
        setFormData,
        nextStep,
        prevStep,
        submitReservation,
    };
};