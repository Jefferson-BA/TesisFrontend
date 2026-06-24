import { useEffect, useState } from "react";
import { usePayOrder } from "../hooks/usePayOrder";
import { toast } from "sonner";
import { QueryProvider } from "@/components/shared/QueryProvider";

// Declaramos la variable global para el nuevo Custom Checkout de Culqi
declare global {
  interface Window {
    CulqiCheckout: any;
  }
}

interface CulqiPaymentProps {
  orderId: string | number | null;
  amount: number;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessCallback?: () => void;
}

// 1. COMPONENTE INTERNO
function CulqiPaymentInner({
  orderId,
  amount,
  userEmail,
  isOpen,
  onClose,
  onSuccessCallback
}: CulqiPaymentProps) {

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { mutate: payOrder } = usePayOrder();

  // 🔥 1. Inyectar el NUEVO Script de Culqi (Custom Checkout)
  useEffect(() => {
    const existingScript = document.getElementById("culqi-checkout-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://js.culqi.com/checkout-js"; // NUEVA URL OFICIAL
      script.id = "culqi-checkout-js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Reaccionar a la prop isOpen para abrir el modal
  useEffect(() => {
    if (isOpen && isScriptLoaded && orderId) {
      openCulqiModal();
    }
  }, [isOpen, isScriptLoaded, orderId]);

  const handlePaymentToBackend = (tokenId: string) => {
    toast.loading("Procesando pago con el servidor...", { id: "payment-toast" });

    payOrder(
      // 🔥 AQUÍ: agregamos el 'amount' al payload
      { orderId: orderId!.toString(), tokenId, amount },
      {
        onSuccess: () => {
          toast.success("¡Pago exitoso! Tu orden ha sido procesada.", { id: "payment-toast" });
          onClose();
          if (onSuccessCallback) {
            setTimeout(() => onSuccessCallback(), 1500);
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || "La tarjeta fue rechazada.";
          toast.error(`Error en el pago: ${errorMessage}`, { id: "payment-toast" });
          onClose();
        },
      }
    );
  };

  // 🔥 2. Configurar y Abrir Modal (Nueva sintaxis basada en tu documentación)
  const openCulqiModal = () => {
    if (!window.CulqiCheckout) {
      toast.error("El entorno de pago aún se está cargando. Intenta en un segundo.");
      onClose();
      return;
    }

    const publicKey = import.meta.env.PUBLIC_CULQI_KEY;
    if (!publicKey) {
      toast.error("Falta configurar la llave pública de Culqi.");
      onClose();
      return;
    }

    // Estructura estricta requerida por Culqi Custom Checkout
    const config = {
      settings: {
        title: "DeParraSpitz Catering",
        currency: "PEN",
        amount: Math.round(amount * 100),
        order: orderId!.toString(),
      },
      client: {
        email: userEmail
      },
      options: {
        lang: "auto",
        installments: false,
        modal: true,
        paymentMethods: {
          tarjeta: true,
          yape: true,
          billetera: false,
          bancaMovil: false,
          agente: false,
          cuotealo: false
        }
      }
    };

    // Creamos la instancia
    const culqiInstance = new window.CulqiCheckout(publicKey, config);

    // Asignamos el manejador de eventos DIRECTAMENTE a la instancia
    culqiInstance.culqi = () => {
      if (culqiInstance.token) {
        // Éxito: tenemos token
        const tokenId = culqiInstance.token.id;
        handlePaymentToBackend(tokenId);
      } else if (culqiInstance.order) {
        // Éxito: pago efectivo/yape directo
        console.log("Orden pagada directamente:", culqiInstance.order);
        toast.success("Orden procesada correctamente.");
        onClose();
        if (onSuccessCallback) onSuccessCallback();
      } else if (culqiInstance.error) {
        // Error de usuario/tarjeta
        toast.error(culqiInstance.error.user_message || "Error al procesar la tarjeta");
        onClose();
      }
    };

    // Abrimos el modal
    culqiInstance.open();
  };

  const isDev = import.meta.env.DEV;

  if (!isDev || !isOpen) return null;

  return (
    <div className="mt-4 p-4 border border-[#3d2c1f] rounded-lg text-xs text-center text-zinc-400 bg-black/20">
      <p className="font-bold mb-1 text-zinc-300">Datos de prueba sugeridos (Modo Desarrollo)</p>
      <p>Tarjeta: 4242 4242 4242 4242</p>
      <p>CVV: 123 | Vencimiento: 12/28</p>
    </div>
  );
}

// 2. COMPONENTE EXPORTADO
export function CulqiPayment(props: CulqiPaymentProps) {
  return (
    <QueryProvider>
      <CulqiPaymentInner {...props} />
    </QueryProvider>
  );
}