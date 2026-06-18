import React, { useEffect, useState } from "react";
import { processPayment } from "../services/payment.service";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

// Declaraciones de tipos para evitar que TypeScript se queje de Culqi en el objeto window
declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

interface CheckoutPageProps {
  orderId: string;
  totalAmount: number;
}

export default function CheckoutPage({ orderId, totalAmount }: CheckoutPageProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Cargar el script de Culqi dinámicamente si no existe
    const existingScript = document.getElementById("culqi-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.id = "culqi-js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }

    // 2. Configurar la función global de escucha obligatoria que Culqi llama al cerrar el formulario
    window.culqi = async () => {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        setIsProcessing(true);
        toast.loading("Procesando pago con el servidor...", { id: "payment-toast" });

        try {
          // Enviamos el token al endpoint del Backend
          await processPayment(orderId, token);
          
          toast.success("¡Pago exitoso! Tu orden ha sido procesada.", { id: "payment-toast" });
          
          // Redirección inmediata al perfil del usuario para que vea sus órdenes (UserOrders.tsx)
          setTimeout(() => {
            window.location.href = "/user/profile";
          }, 1500);

        } catch (error: any) {
          setIsProcessing(false);
          // Si la tarjeta fue rechazada o hubo un Bad Request (400), alertamos al usuario
          const errorMessage = error.response?.data?.message || "La tarjeta fue rechazada. Intenta con otra.";
          toast.error(`Error en el pago: ${errorMessage}`, { id: "payment-toast" });
        }
      } else if (window.Culqi.error) {
        // Captura errores del formulario flotante de Culqi (ej. cerró el modal o datos inválidos en el front)
        setIsProcessing(false);
        toast.error(window.Culqi.error.user_message || "Error al generar el token de la tarjeta.");
      }
    };

    return () => {
      // Limpieza preventiva si se desmonta el componente
      window.culqi = () => {};
    };
  }, [orderId]);

  const handlePayClick = () => {
    if (!isScriptLoaded || !window.Culqi) {
      toast.error("La pasarela de pago aún se está cargando. Por favor espera.");
      return;
    }

    // Inicializamos con la llave de pruebas provista por tu backend
    window.Culqi.publicKey = "pk_test_AQUI_PEGAS_TU_LLAVE_PUBLICA";

    // Configuramos los ajustes del modal de pago
    window.Culqi.settings({
      title: "DeParraSpitz Catering",
      currency: "PEN", // Soles peruanos (S/)
      amount: totalAmount * 100, // Culqi recibe el dinero en céntimos (Ej: S/. 50.00 -> 5000)
      order: orderId
    });

    // Abrimos el formulario de Culqi
    window.Culqi.open();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#120d0a] border border-[#3d2c1f] rounded-2xl shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4 border-b border-[#3d2c1f] pb-2 font-serif text-yellow-500">
        Resumen de Pago
      </h2>
      
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">ID de la Orden:</span>
          <span className="font-mono text-zinc-200">#{orderId}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-[#3d2c1f] pt-3">
          <span>Total a pagar:</span>
          <span className="text-yellow-500">S/ {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayClick}
        disabled={isProcessing || !isScriptLoaded}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar con Tarjeta (Culqi)
          </>
        )}
      </button>

      <p className="text-[11px] text-zinc-500 text-center mt-4">
        🔒 Conexión segura encriptada. Cumple con normativas PCI-DSS.
      </p>
    </div>
  );
}