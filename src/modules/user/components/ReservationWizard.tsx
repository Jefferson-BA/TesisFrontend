import React from "react";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

export default function ReservationWizard() {
    const wizard = useReservationWizard();

    return (
        <div className="bg-[#15100e] border border-[#4a3824] p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl">
            {/* Indicador Visual de Pasos */}
            <div className="mb-8 flex justify-between items-center border-b border-[#4a3824] pb-4">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${wizard.currentStep >= step
                                ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                                : "bg-black border border-[#4a3824] text-zinc-500"
                            }`}>
                            {step}
                        </div>
                        <span className="text-xs text-zinc-400 mt-2 hidden md:block font-medium">
                            {step === 1 ? "1. Contacto" : step === 2 ? "2. Carta y Promos" : step === 3 ? "3. Logística" : "4. Garantía"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Cuerpo Inyectado Dinámicamente */}
            <div className="min-h-[380px]">
                {wizard.currentStep === 1 && (
                    <Step1Contact formData={wizard.formData} handleChange={wizard.handleChange} />
                )}
                {wizard.currentStep === 2 && (
                    <Step2Menu products={wizard.products} isLoading={wizard.isLoadingProducts} />
                )}
                {wizard.currentStep === 3 && (
                    <Step3Logistics formData={wizard.formData} handleChange={wizard.handleChange} />
                )}
                {wizard.currentStep === 4 && (
                    <Step4Payment formData={wizard.formData} setFormData={wizard.setFormData} />
                )}
            </div>

            {/* Botoneras Inferiores de Control */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#4a3824]">
                {wizard.currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={wizard.prevStep}
                        className="px-6 py-3 bg-[#211814] text-white rounded-lg hover:bg-[#3a2a1e] transition font-bold"
                    >
                        ← Volver
                    </button>
                ) : (
                    <div />
                )}

                {wizard.currentStep < 4 ? (
                    <button
                        type="button"
                        onClick={wizard.nextStep}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition font-extrabold shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    >
                        Siguiente Paso →
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={wizard.submitReservation}
                        className="px-8 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition font-extrabold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        Finalizar Reserva ✓
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// VISTAS INTERNAS COMPONENTIZADAS (Buenas prácticas de legibilidad)
// ============================================================================

const Step1Contact = ({ formData, handleChange }: any) => (
    <div className="space-y-4 animate-fade-in">
        <div>
            <h2 className="text-2xl font-bold text-white">Datos del Contacto</h2>
            <p className="text-sm text-zinc-400 mt-1">Por favor dinos a quién dirigir la propuesta comercial.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
            <Input label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" />
            <Input label="Teléfono / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 987654321" />
            <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} placeholder="Ej. Lima" />
        </div>
    </div>
);

const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const cart = useCartStore((state) => state.cart);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-yellow-500 font-bold">Consultando platos y promociones en tiempo real...</p>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="text-center text-zinc-500 py-20">
                No se encontraron buffets o parrillas activos en el panel de administración.
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Nuestra Carta y Promociones</h2>
                    <p className="text-sm text-zinc-400 mt-1">Selecciona los servicios que deseas incluir en tu banquete.</p>
                </div>
                <div className="bg-[#211814] px-4 py-2 rounded-xl border border-[#4a3824]">
                    <span className="text-sm text-yellow-500 font-bold">Items añadidos: {cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar pt-2">
                {products.map((p) => {
                    const cartItem = cart.find((item) => item.id === p.id);
                    return (
                        <div
                            key={p.id}
                            className={`p-4 rounded-xl flex flex-col justify-between bg-black border transition-all duration-300 ${p.isPromo ? "border-red-900/60 bg-gradient-to-b from-black to-[#211010]" : "border-[#4a3824]"
                                } hover:border-yellow-500`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {p.name}
                                        {p.isPromo && <span className="bg-red-600 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded animate-pulse">PROMO</span>}
                                    </h3>
                                    {p.category && (
                                        <span className="text-[11px] bg-[#211814] text-yellow-500 px-2 py-0.5 rounded-full border border-[#4a3824]">
                                            {/* Extraemos el nombre de la categoría si es un objeto, o lo mostramos directo si es un string */}
                                            {typeof p.category === 'object' ? (p.category as any).name : p.category}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{p.description || "Servicio gastronómico exclusivo listo para tu evento."}</p>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xl font-extrabold text-yellow-500">S/ {p.price}</span>
                                <button
                                    type="button"
                                    onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                >
                                    Agregar {cartItem && `(${cartItem.quantity})`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Step3Logistics = ({ formData, handleChange }: any) => (
    <div className="space-y-4 animate-fade-in">
        <div>
            <h2 className="text-2xl font-bold text-white">Logística del Evento</h2>
            <p className="text-sm text-zinc-400 mt-1">Configura las coordenadas y horarios donde se desplegará el catering.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="md:col-span-2">
                <Input label="Dirección Exacta del Local / Finca" name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Av. Primavera 123, Chacarilla" />
            </div>
            <Input label="Fecha Programada" name="date" type="date" value={formData.date} onChange={handleChange} />
            <Input label="Hora de Inicio" name="time" type="time" value={formData.time} onChange={handleChange} />
            <Input label="Aforo / Cantidad de Invitados" name="guests" type="number" value={formData.guests} onChange={handleChange} placeholder="Ej. 150" />
            <div className="flex flex-col">
                <label className="text-sm font-bold text-zinc-300 mb-2">Tipo de Celebración</label>
                <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none transition-all h-[46px]"
                >
                    <option value="Boda">💍 Boda / Matrimonio</option>
                    <option value="Corporativo">💼 Evento Corporativo</option>
                    <option value="Cumpleaños">🎉 Cumpleaños / Fiesta Privada</option>
                    <option value="Aniversario">✨ Aniversario / Gala</option>
                </select>
            </div>
        </div>
    </div>
);

const Step4Payment = ({ formData, setFormData }: any) => (
    <div className="space-y-4 animate-fade-in flex flex-col items-center text-center justify-center pt-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Método de Garantía</h2>
            <p className="text-sm text-zinc-400 mt-1">Elige la pasarela o plataforma con la que asegurarás la fecha del calendario.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg pt-6">
            {[
                ["card", "💳 Tarjeta Crédito/Débito"],
                ["yape", "🟣 Código Yape"],
                ["plin", "🔵 Transferencia Plin"]
            ].map(([val, label]) => (
                <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: val })}
                    className={`py-4 px-2 rounded-xl font-bold text-sm transition-all duration-300 border ${formData.paymentMethod === val
                            ? "bg-yellow-500 text-black scale-105 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                            : "bg-[#211814] text-zinc-400 border-[#4a3824] hover:border-yellow-500 hover:text-white"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
        <p className="text-xs text-zinc-500 max-w-md mt-6">
            * Al finalizar, el sistema bloqueará preventivamente la fecha y un asesor comercial validará los detalles finales de tu menú en las próximas 24 horas.
        </p>
    </div>
);

const Input = ({ label, ...props }: any) => (
    <div className="flex flex-col">
        <label className="text-sm font-bold text-zinc-300 mb-2">{label}</label>
        <input
            className="bg-black border border-[#4a3824] rounded-lg p-3 text-white placeholder-zinc-600 focus:border-yellow-500 outline-none transition-all w-full text-sm"
            {...props}
        />
    </div>
);