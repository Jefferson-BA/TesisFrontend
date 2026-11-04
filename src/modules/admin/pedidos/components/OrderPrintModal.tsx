import type { Order } from '@/modules/orders/interfaces/order.interface';
import type { Reservation } from '@/modules/reservations/interfaces/reservation.interface';
import { ChefHat, Printer, X } from 'lucide-react';
export interface ConsolidatedItem {
  name: string;
  category: string;
  baseUnits: number;
  totalPortions: number;
  ordersCount: number;
}
interface Props {
  orderCount: number;
  selectedReservation: Reservation | null;
  printingOrder: Order | null;
  isConsolidatedPrint: boolean;
  consolidatedItems: ConsolidatedItem[];
  getLinkedReservation: (order: Order) => Reservation | null;
  formatDisplayDate: (date?: string) => string;
  onClose: () => void;
}
export function OrderPrintModal({
  orderCount,
  selectedReservation,
  printingOrder,
  isConsolidatedPrint,
  consolidatedItems,
  getLinkedReservation,
  formatDisplayDate,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabecera del Modal (No se imprime) */}
        <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              {isConsolidatedPrint
                ? 'Vista Previa: Comanda Consolidada de Cocina'
                : `Vista Previa: Comanda de Producción #${printingOrder?.id}`}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-black uppercase hover:bg-primary/90 transition-all cursor-pointer shadow-md hover:shadow-primary/30"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Comanda</span>
            </button>
            <button
              type="button"
              onClick={() => onClose()}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenedor del documento imprimible */}
        <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900 dark:bg-card dark:text-card-foreground">
          <div
            id="kitchen-production-ticket"
            className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-xs"
          >
            {/* Membrete Oficial de Cocina Central */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
                  COMANDA DE PRODUCCIÓN - COCINA CENTRAL
                </h1>
                <p className="text-xs uppercase font-bold text-slate-600 mt-0.5 tracking-wider">
                  Catering, Buffets & Eventos Gastronómicos Especiales
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-bold text-slate-900">
                  Fecha Impresión: {new Date().toLocaleDateString('es-PE')}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Hora:{' '}
                  {new Date().toLocaleTimeString('es-PE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Datos de Montaje y Despacho del Evento */}
            {!isConsolidatedPrint && printingOrder ? (
              (() => {
                const printRes = getLinkedReservation(printingOrder);
                const safePax =
                  Number(
                    printRes?.guestsCount || printingOrder.guestsCount || 1,
                  ) || 1;
                const printEventDate =
                  printRes?.eventDate ||
                  printingOrder.eventDate ||
                  'Por confirmar';
                const printServiceTime =
                  printRes?.serviceStartTime ||
                  printingOrder.serviceStartTime ||
                  '12:00 PM';
                const printAddress =
                  printRes?.venueAddress ||
                  printingOrder.shippingAddress ||
                  printingOrder.address ||
                  'Dirección no provista';
                const printNotes =
                  printRes?.notes ||
                  printRes?.additionalNotes ||
                  printingOrder.notes ||
                  'Sin especificaciones especiales.';

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          N° Pedido
                        </span>
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{printingOrder.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Reserva Vinculada
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {printRes?.id ? `#${printRes.id}` : 'Venta Directa'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Fecha Evento
                        </span>
                        <span className="font-bold text-slate-900">
                          {formatDisplayDate(printEventDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Hora Despacho
                        </span>
                        <span className="font-bold text-slate-900">
                          {printServiceTime}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Cliente / Teléfono
                        </span>
                        <span className="font-bold text-slate-900">
                          {printingOrder.fullName ||
                            printRes?.customerName ||
                            'Cliente'}{' '}
                          ({printingOrder.phone || printRes?.phone || 'S/T'})
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Destino de Montaje
                        </span>
                        <span className="font-bold text-slate-900 truncate block">
                          {printAddress} (
                          {printingOrder.city || printRes?.city || 'Lima'})
                        </span>
                      </div>
                    </div>

                    {/* Banner de Invitados Asignados (PAX) */}
                    <div className="p-3 bg-slate-100 border-l-4 border-slate-900 rounded-r-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 block">
                          Escala de Producción Asignada
                        </span>
                        <span className="text-xl font-black text-slate-950 font-mono">
                          {safePax} INVITADOS (PAX)
                        </span>
                      </div>
                      <div className="text-right text-xs text-slate-600 font-medium">
                        Multiplicador de Cocina:{' '}
                        <strong>x{safePax} porciones base</strong>
                      </div>
                    </div>

                    {/* Notas e Indicaciones para el Chef */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <strong className="uppercase font-black text-[10px] tracking-wider block text-amber-950 mb-0.5">
                        Indicaciones Especiales y Requerimientos de Cocina:
                      </strong>
                      <p className="italic">{printNotes}</p>
                    </div>

                    {/* Tabla de Platillos y Porciones */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                        Lista Detallada de Producción de Platillos
                      </h4>
                      <table className="w-full text-left border-collapse text-xs border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                            <th className="p-2 border-r border-slate-300">#</th>
                            <th className="p-2 border-r border-slate-300">
                              Platillo / Preparación
                            </th>
                            <th className="p-2 border-r border-slate-300">
                              Categoría
                            </th>
                            <th className="p-2 text-center border-r border-slate-300">
                              Unid. Base
                            </th>
                            <th className="p-2 text-center border-r border-slate-300">
                              Escala PAX
                            </th>
                            <th className="p-2 text-center font-black bg-slate-200 text-slate-900 border-r border-slate-300">
                              TOTAL PORCIONES A PREPARAR
                            </th>
                            <th className="p-2 text-center">Pase Cocina</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {(printingOrder.items || []).map(
                            (item, idx: number) => {
                              const qty = Number(item.quantity || 1);
                              const totalP = qty * safePax;
                              return (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-2 font-mono border-r border-slate-300 text-slate-500">
                                    {idx + 1}
                                  </td>
                                  <td className="p-2 font-bold text-slate-950 border-r border-slate-300">
                                    {item.name || 'Plato sin nombre'}
                                  </td>
                                  <td className="p-2 border-r border-slate-300 text-slate-600">
                                    {item.category || 'Principal'}
                                  </td>
                                  <td className="p-2 text-center font-mono border-r border-slate-300">
                                    x{qty}
                                  </td>
                                  <td className="p-2 text-center font-mono border-r border-slate-300 text-slate-600">
                                    × {safePax}
                                  </td>
                                  <td className="p-2 text-center font-mono font-black text-sm bg-slate-50 border-r border-slate-300 text-slate-950">
                                    {totalP} porciones
                                  </td>
                                  <td className="p-2 text-center">
                                    <span className="inline-block w-5 h-5 border border-slate-400 rounded-sm"></span>
                                  </td>
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* VISTA CONSOLIDADA */
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Alcance del Reporte
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedReservation
                        ? `Consolidado para Reserva #${selectedReservation.id} (${selectedReservation.guestsCount || 0} PAX)`
                        : `Consolidado Global: ${orderCount} pedidos seleccionados`}
                    </span>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-900">
                    {consolidatedItems.reduce(
                      (acc, it) => acc + it.totalPortions,
                      0,
                    )}{' '}
                    PORCIONES TOTALES
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                    Tabla Consolidada de Preparación en Cocina
                  </h4>
                  <table className="w-full text-left border-collapse text-xs border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300">#</th>
                        <th className="p-2 border-r border-slate-300">
                          Platillo / Receta
                        </th>
                        <th className="p-2 border-r border-slate-300">
                          Categoría
                        </th>
                        <th className="p-2 text-center border-r border-slate-300">
                          Órdenes
                        </th>
                        <th className="p-2 text-center border-r border-slate-300">
                          Unidades Base
                        </th>
                        <th className="p-2 text-center font-black bg-slate-200 text-slate-900 border-r border-slate-300">
                          TOTAL PORCIONES A PRODUCIR
                        </th>
                        <th className="p-2 text-center">Check Jefe Cocina</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {consolidatedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-mono border-r border-slate-300 text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="p-2 font-bold text-slate-950 border-r border-slate-300">
                            {item.name}
                          </td>
                          <td className="p-2 border-r border-slate-300 text-slate-600">
                            {item.category}
                          </td>
                          <td className="p-2 text-center font-mono border-r border-slate-300">
                            {item.ordersCount}
                          </td>
                          <td className="p-2 text-center font-mono border-r border-slate-300">
                            x{item.baseUnits}
                          </td>
                          <td className="p-2 text-center font-mono font-black text-sm bg-slate-50 border-r border-slate-300 text-slate-950">
                            {item.totalPortions} porciones
                          </td>
                          <td className="p-2 text-center">
                            <span className="inline-block w-5 h-5 border border-slate-400 rounded-sm"></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-900 font-bold bg-slate-100 text-xs">
                      <tr>
                        <td
                          colSpan={5}
                          className="p-2 text-slate-700 uppercase"
                        >
                          Gran Total de Producción en Cocina Central:
                        </td>
                        <td className="p-2 text-center font-black text-slate-950 text-base font-mono">
                          {consolidatedItems.reduce(
                            (acc, it) => acc + it.totalPortions,
                            0,
                          )}{' '}
                          porciones
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Bloque de Firmas de Validación Operativa */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-[10px] text-slate-600 uppercase font-bold">
              <div className="space-y-12">
                <div className="border-b border-slate-400 mx-4"></div>
                <p>
                  Jefe de Cocina Central
                  <br />
                  <span className="text-[9px] font-normal text-slate-500">
                    Preparación & Calidad
                  </span>
                </p>
              </div>
              <div className="space-y-12">
                <div className="border-b border-slate-400 mx-4"></div>
                <p>
                  Responsable de Empaque
                  <br />
                  <span className="text-[9px] font-normal text-slate-500">
                    Control de Despacho
                  </span>
                </p>
              </div>
              <div className="space-y-12">
                <div className="border-b border-slate-400 mx-4"></div>
                <p>
                  Chofer / Logística de Campo
                  <br />
                  <span className="text-[9px] font-normal text-slate-500">
                    Entrega en Local
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
