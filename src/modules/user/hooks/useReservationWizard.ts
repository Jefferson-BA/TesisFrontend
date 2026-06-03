import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { createReservation } from "@/modules/admin/pedidos/services/order.service";
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

    // Carga los productos y promociones de la base de datos al montar el componente
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await getProducts();
                // Si tu backend responde directamente el array o dentro de un objeto .data
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

        // 2. Mapeamos los items: 'productId' como String (UUID) y 'quantity' como Número
        const items = cart.map((item) => ({
            productId: String(item.id),
            quantity: Number(item.quantity),
        }));

        // 3. Armamos el JSON final tal como lo pide el DTO del backend
        const safeDate = formData.date ? new Date(formData.date) : new Date();

        const reservationPayload = {
            // Convertimos la fecha segura a ISO 8601
            eventDate: safeDate.toISOString(),

            serviceStartTime: formData.time || "12:00", // Blindaje para la hora también
            guestsCount: Number(formData.guests) || 1, // Blindaje (min 1 invitado)
            venueAddress: formData.address || "Dirección pendiente",
            city: formData.city || "Ciudad pendiente",
            items: items,
        };
        console.log("📦 PAYLOAD ENVIADO AL BACKEND:", JSON.stringify(reservationPayload, null, 2));
        try {
            // 4. LLAMAMOS AL NUEVO ENDPOINT /reservations
            await createReservation(reservationPayload);

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