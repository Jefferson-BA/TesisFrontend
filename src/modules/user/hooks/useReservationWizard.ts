import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
// 🔥 IMPORTAMOS createOrder AQUÍ TAMBIÉN
import { createReservation, createOrder } from "@/modules/admin/pedidos/services/order.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

export const useReservationWizard = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

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

        try {
            // 1️⃣ PRIMERO: Armamos la reserva SIN 'phone' ni 'notes' para cumplir con el DTO del backend
            const reservationPayload = {
                eventDate: formData.date,
                serviceStartTime: formData.time || "12:00",
                guestsCount: Number(formData.guests) || 1,
                venueAddress: formData.address || "Dirección pendiente",
                city: formData.city || "Ciudad pendiente",
                items: items,
            };

            console.log("📦 PAYLOAD DE RESERVA LIMPÍO:", JSON.stringify(reservationPayload, null, 2));
            const newReservation = await createReservation(reservationPayload);

            // 2️⃣ SEGUNDO: Creamos la orden vinculándola al ID obtenido. 
            // Aquí SÍ enviamos el teléfono y las notas incrustadas en la dirección.
            const orderData = {
                reservationId: newReservation.id, // Enlace de las dos tablas
                shippingAddress: `${formData.address} | EVENTO: ${formData.date} a las ${formData.time} | Asistentes: ${formData.guests} | Tipo: ${formData.eventType} ${formData.notes ? `| Notas: ${formData.notes}` : ''}`,
                city: formData.city || "Ciudad pendiente",
                postalCode: "00000",
                phone: formData.phone, // 🔥 El teléfono se guarda aquí de forma segura
                paymentMethod: formData.paymentMethod,
                items,
            };

            console.log("📦 PAYLOAD DE ORDEN:", JSON.stringify(orderData, null, 2));
            await createOrder(orderData);

            // 3️⃣ Limpieza y redirección
            clearCart();
            toast.success("¡Reserva enviada exitosamente!");

            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

        } catch (error: any) {
            console.error("Error al procesar reserva:", error);
            const backendMessage = error.response?.data?.message;
            const alertMessage = Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage;
            toast.error(alertMessage || "Error al enviar la reserva");
        }
    };

    return {
        currentStep,
        formData,
        products,
        isLoadingProducts,
        handleChange,
        setFormData,
        nextStep,
        prevStep,
        submitReservation,
    };
};