// src/modules/payments/components/CulqiPayment.tsx

import { useEffect, useState, useRef } from "react";
import { usePayOrder } from "../hooks/usePayOrder";
import { toast } from "sonner";
import { QueryProvider } from "@/components/shared/QueryProvider";

declare global {
  interface Window {
    CulqiCheckout: any;
  }
}

interface CulqiPaymentProps {
  orderId: string;
  amount: number;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessCallback?: () => void;
}

function CulqiPaymentInner({
  orderId,
  amount,
  userEmail,
  isOpen,
  onClose,
  onSuccessCallback,
}: CulqiPaymentProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isBackendProcessing, setIsBackendProcessing] = useState(false);
  const { mutate: payOrder } = usePayOrder();
  
  const culqiInstanceRef = useRef<any>(null);
  const isProcessingPaymentRef = useRef(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerId = useRef(`culqi-container-${Date.now()}`).current;

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (culqiInstanceRef.current?.close) {
        culqiInstanceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const existingScript = document.getElementById("culqi-checkout-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://js.culqi.com/checkout-js";
      script.id = "culqi-checkout-js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isScriptLoaded && orderId) {
      isProcessingPaymentRef.current = false;
      setIsBackendProcessing(false);
      setTimeout(() => {
        openCulqiCheckout();
      }, 150);
    }
  }, [isOpen, isScriptLoaded, orderId]);

  const handlePaymentToBackend = (tokenId: string) => {
    if (isProcessingPaymentRef.current) return;
    
    isProcessingPaymentRef.current = true;
    setIsBackendProcessing(true);
    
    if (culqiInstanceRef.current?.close) {
      culqiInstanceRef.current.close();
    }

    toast.loading("Procesando pago de forma segura...", {
      id: "payment-toast",
      duration: Infinity,
    });

    payOrder(
      { orderId, tokenId, email: userEmail, amount },
      {
        onSuccess: (data) => {
          console.log("✅ Pago exitoso:", data);
          
          processingTimeoutRef.current = setTimeout(() => {
            toast.success("¡Pago exitoso! Tu reserva ha sido confirmada.", {
              id: "payment-toast",
              duration: 3000,
            });
            
            setIsBackendProcessing(false);
            
            if (onSuccessCallback) {
              onSuccessCallback();
            }
            
            onClose();
            isProcessingPaymentRef.current = false;
          }, 2000);
        },
        onError: (error: any) => {
          console.error("❌ Error en pago:", error);
          
          const errorMessage =
            error.response?.data?.message ||
            "La tarjeta fue rechazada o hubo un error.";
          
          toast.error(`Error en el pago: ${errorMessage}`, {
            id: "payment-toast",
            duration: 5000,
          });
          
          setIsBackendProcessing(false);
          isProcessingPaymentRef.current = false;
          onClose();
        },
      },
    );
  };

  const openCulqiCheckout = () => {
    if (!window.CulqiCheckout) {
      toast.error("El entorno de pago aún se está cargando. Intenta de nuevo.");
      onClose();
      return;
    }

    const publicKey = import.meta.env.PUBLIC_CULQI_KEY;
    if (!publicKey) {
      toast.error("Falta configurar la llave pública de Culqi.");
      onClose();
      return;
    }

    const paymentMethods = {
      tarjeta: true,
      yape: true,
      billetera: false,
      bancaMovil: false,
      agente: false,
      cuotealo: false,
    };

    const config = {
      settings: {
        title: "DeParraSpitz Catering",
        currency: "PEN",
        amount: Math.round(amount * 100),
      },
      client: {
        email: userEmail,
      },
      options: {
        lang: "auto",
        installments: false,
        modal: false,
        container: `#${containerId}`,
        paymentMethods: paymentMethods,
        paymentMethodsSort: Object.keys(paymentMethods),
      },
      appearance: {
        theme: "dark",
        hiddenCulqiLogo: true,
        hiddenBannerContent: false,
        hiddenBanner: false,
        hiddenToolBarAmount: false,
        menuType: "select",
        buttonCardPayText: "Pagar Ahora",
        logo: null,
        defaultStyle: {
          bannerColor: "#C9974A",
          buttonBackground: "#C9974A",
          menuColor: "#C9974A",
          linksColor: "#C9974A",
          buttonTextColor: "#FFFFFF",
          priceColor: "#C9974A",
        },
        variables: {
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeightNormal: "500",
          borderRadius: "8px",
          colorBackground: "#0b0806",
          colorPrimary: "#C9974A",
          colorPrimaryText: "#FFFFFF",
          colorText: "#FFFFFF",
          colorTextSecondary: "#A1A1AA",
          colorTextPlaceholder: "#727F96",
          colorIconTab: "#C9974A",
          colorLogo: "dark",
        },
        rules: {
          ".Culqi-Main-Container": {
            background: "transparent",
            fontFamily: "var(--fontFamily)",
          },
          ".Culqi-ToolBanner": {
            background: "linear-gradient(to right, #C9974A, #b38137)",
            fontFamily: "var(--fontFamily)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          },
          ".Culqi-Toolbar-Price": {
            color: "white",
            fontFamily: "var(--fontFamily)",
          },
          ".Culqi-Main-Method": {
            background: "transparent",
            padding: "10px 20px",
            color: "white",
          },
          ".Culqi-Text-Link": {
            color: "#C9974A",
          },
          ".Culqi-Label": {
            color: "#D4D4D8",
            marginBottom: "8px",
          },
          ".Culqi-Input": {
            border: "1px solid #3d2c1f",
            color: "white",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
          },
          ".Culqi-Input:focus": {
            border: "2px solid #C9974A",
            boxShadow: "0 0 0 3px rgba(201, 151, 74, 0.2)",
          },
          ".Culqi-Input.input-valid": {
            border: "1px solid #22c55e",
            background: "rgba(34, 197, 94, 0.1)",
          },
          ".Culqi-Button": {
            background: "linear-gradient(to right, #C9974A, #b38137)",
            borderRadius: "8px",
            fontWeight: "600",
            fontFamily: "var(--fontFamily)",
            padding: "12px",
          },
          ".Culqi-Button:hover": {
            background: "linear-gradient(to right, #b38137, #966b2d)",
            transform: "translateY(-1px)",
          },
          ".Culqi-Menu": {
            color: "#A1A1AA",
          },
          ".Culqi-Menu-Item.active": {
            color: "#C9974A",
          },
          ".Culqi-Menu-Item.active .Culqi-Bar": {
            background: "#C9974A",
          },
        },
      },
    };

    culqiInstanceRef.current = new window.CulqiCheckout(publicKey, config);

    culqiInstanceRef.current.culqi = () => {
      if (culqiInstanceRef.current.token) {
        handlePaymentToBackend(culqiInstanceRef.current.token.id);
      } else if (culqiInstanceRef.current.order) {
        toast.success("Orden procesada correctamente.");
        culqiInstanceRef.current.close();
        onClose();
        if (onSuccessCallback) onSuccessCallback();
      } else if (culqiInstanceRef.current.error) {
        toast.error(
          culqiInstanceRef.current.error.user_message || "Error al procesar la tarjeta",
        );
        culqiInstanceRef.current.close();
        onClose();
      }
    };

    culqiInstanceRef.current.open();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Loader de procesamiento */}
      {isBackendProcessing && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-amber-500/30 p-8 rounded-2xl flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-16 h-16 border-4 border-amber-500/20 rounded-full animate-ping" />
              <div className="w-16 h-16 border-4 border-amber-500 rounded-full flex items-center justify-center relative bg-neutral-900">
                <svg className="w-8 h-8 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-white text-xl font-bold mb-3 text-center">Validando Transacción</h3>
            
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-progress-bar" />
            </div>
            
            <p className="text-neutral-400 text-sm text-center">
              Estamos procesando tu pago de forma segura con Culqi. 
              Por favor, no cierres esta ventana.
            </p>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Conexión segura SSL/TLS
            </div>
          </div>
        </div>
      )}

      {/* 🔥 SECCIÓN DE PAGO EMBEBIDA - Sin modal, sin overlay */}
      <div className="w-full bg-white dark:bg-[#140d0b] border border-stone-200 dark:border-[#3d2c1f] rounded-2xl shadow-sm overflow-hidden">
        {/* Header de la sección */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Completar Pago</h3>
            <p className="text-amber-100 text-xs">DeParraSpitz Catering</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-lg flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        {/* Contenedor de Culqi */}
        <div className="p-6">
          <div 
            id={containerId}
            className="w-full min-h-[300px]"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 dark:bg-neutral-950/50 border-t border-stone-200 dark:border-neutral-800 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xs text-stone-500 dark:text-neutral-400">
            Pago seguro procesado por Culqi
          </span>
        </div>
      </div>
    </>
  );
}

export function CulqiPayment(props: CulqiPaymentProps) {
  return (
    <QueryProvider>
      <CulqiPaymentInner {...props} />
    </QueryProvider>
  );
}