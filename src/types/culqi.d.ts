export interface CulqiError {
  user_message?: string;
}
export interface CulqiInstance {
  token?: { id: string } | null;
  order?: unknown;
  error?: CulqiError;
  culqi?: () => void;
  open: () => void;
  close: () => void;
}
export interface CulqiConfig {
  settings: { title: string; currency: string; amount: number };
  client: { email: string };
  options: {
    lang: string;
    installments: boolean;
    modal: boolean;
    container: string;
    paymentMethods: Record<string, boolean>;
    paymentMethodsSort: string[];
  };
  appearance?: Record<string, unknown>;
}
declare global {
  interface Window {
    Culqi?: Partial<CulqiInstance>;
    culqi?: () => void;
    CulqiCheckout?: new (key: string, config: CulqiConfig) => CulqiInstance;
    Culqi3DS?: unknown;
    culqi3ds?: () => void;
  }
}
