let loading: Promise<void> | undefined;
export function loadCulqi(): Promise<void> {
  if (window.CulqiCheckout) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    let script = document.getElementById(
      'culqi-checkout-js',
    ) as HTMLScriptElement | null;
    const timer = window.setTimeout(() => fail(), 20000);
    const clean = () => {
      window.clearTimeout(timer);
      script?.removeEventListener('load', ready);
      script?.removeEventListener('error', fail);
    };
    const ready = () => {
      clean();
      if (window.CulqiCheckout) resolve();
      else {
        script?.remove();
        reject(new Error('Pasarela no disponible'));
      }
    };
    const fail = () => {
      clean();
      script?.remove();
      reject(new Error('No se pudo cargar la pasarela'));
    };
    if (!script) {
      script = document.createElement('script');
      script.id = 'culqi-checkout-js';
      script.src = 'https://js.culqi.com/checkout-js';
      script.async = true;
      script.addEventListener('load', ready);
      script.addEventListener('error', fail);
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', ready);
      script.addEventListener('error', fail);
    }
  }).catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
