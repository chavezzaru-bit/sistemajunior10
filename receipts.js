let historyDB = [];

async function fetchHistory() {
    if (!supabaseClient) return [];
    try {
        // Obtenemos ventas y cotizaciones en paralelo
        const [ventasRes, cotiRes] = await Promise.all([
            supabaseClient.from('ventas').select('*').order('created_at', { ascending: false }).limit(20),
            supabaseClient.from('cotizaciones').select('*').order('created_at', { ascending: false }).limit(20)
        ]);

        if (ventasRes.error) throw ventasRes.error;
        if (cotiRes.error) throw cotiRes.error;

        // Formatear ventas
        const ventasFormatted = ventasRes.data.map(v => ({
            id: v.numero_ticket,
            type: 'Venta',
            date: new Date(v.created_at).toLocaleString(),
            total: v.total,
            client: v.cliente || 'Consumidor Final',
            raw_date: new Date(v.created_at)
        }));

        // Formatear cotizaciones
        const cotiFormatted = cotiRes.data.map(c => ({
            id: c.numero_cotizacion,
            type: 'Cotización',
            date: new Date(c.created_at).toLocaleString(),
            total: c.total,
            client: c.cliente,
            raw_date: new Date(c.created_at)
        }));

        // Unir y ordenar por fecha más reciente
        const allHistory = [...ventasFormatted, ...cotiFormatted];
        allHistory.sort((a, b) => b.raw_date - a.raw_date);

        return allHistory;

    } catch (err) {
        console.error("Error cargando historial:", err);
        return [];
    }
}

async function renderReceipts() {
    const container = document.getElementById('module-history');
    
    // Mostramos estado de carga
    container.innerHTML = `
        <div class="p-10 flex justify-center items-center h-full">
            <div class="animate-pulse flex flex-col items-center">
                <div class="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
                <div class="text-gray-400">Cargando datos desde la nube...</div>
            </div>
        </div>
    `;

    historyDB = await fetchHistory();

    if (historyDB.length === 0) {
        container.innerHTML = `
            <div class="p-10 flex justify-center items-center h-full">
                <div class="text-gray-400 text-center">
                    <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    Aún no hay ventas ni cotizaciones registradas.
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="p-4 md:p-10 h-full overflow-y-auto custom-scrollbar pb-24 md:pb-10">
            <div class="max-w-5xl mx-auto">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Historial y Recibos</h2>
                <p class="text-gray-500 mb-6 text-sm">Consulta las ventas y cotizaciones emitidas.</p>
                
                <!-- Vista Desktop (Tabla) -->
                <div class="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold">
                            <tr>
                                <th class="px-6 py-4">Documento</th>
                                <th class="px-6 py-4">Tipo</th>
                                <th class="px-6 py-4">Cliente</th>
                                <th class="px-6 py-4">Fecha</th>
                                <th class="px-6 py-4 text-right">Total</th>
                                <th class="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            ${historyDB.map(doc => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">${doc.id}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.type === 'Venta' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}">
                                            ${doc.type}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-gray-600 dark:text-gray-300">${doc.client}</td>
                                    <td class="px-6 py-4 text-gray-500">${doc.date}</td>
                                    <td class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">$${doc.total.toFixed(2)}</td>
                                    <td class="px-6 py-4 text-center">
                                        <button onclick="reprint('${doc.id}')" class="text-gray-400 hover:text-emerald-500 transition-colors p-2">
                                            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Vista Mobile (Tarjetas) -->
                <div class="md:hidden space-y-4">
                    ${historyDB.map(doc => `
                        <div class="bg-white dark:bg-[#1a2332] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h3 class="font-bold text-gray-900 dark:text-white text-lg">${doc.client}</h3>
                                    <p class="text-xs text-gray-500 mt-1 uppercase tracking-wider">${doc.date}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.type === 'Venta' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}">
                                    ${doc.type}
                                </span>
                            </div>
                            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                $${doc.total.toFixed(2)}
                            </div>
                            <div class="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span class="text-xs font-semibold text-gray-500 flex-1">${doc.id}</span>
                                <button onclick="reprint('${doc.id}')" class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function reprint(id) {
    // Para simplificar, la reimpresión real desde DB requeriría hacer fetch de los detalles.
    // Aquí mandamos el mensaje visual por ahora.
    Swal.fire({
        title: 'Reimprimiendo',
        text: 'Generando PDF del documento ' + id,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
}

// Función global para generar PDF (usada por sales y quotes)
window.generateReceiptPDF = function(items, type, id, client = "Consumidor Final") {
    const { jsPDF } = window.jspdf;
    
    // Formato Ticket 80mm (80x200 aprox)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
    });

    let y = 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SUPER VENTAS", 40, y, { align: "center" });
    
    y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("RUC: 10203040506", 40, y, { align: "center" });
    
    y += 5;
    doc.text("Av. Principal 123, Ciudad", 40, y, { align: "center" });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`${type.toUpperCase()} ${id}`, 40, y, { align: "center" });

    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 5, y);
    y += 5;
    doc.text(`Cliente: ${client}`, 5, y);

    y += 5;
    doc.text("------------------------------------------------", 40, y, { align: "center" });

    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CANT  DESCRIPCION       TOTAL", 5, y);
    
    y += 4;
    doc.setFont("helvetica", "normal");
    
    let total = 0;
    items.forEach(item => {
        let lineTotal = (item.precio || item.price) * item.qty;
        total += lineTotal;
        
        let desc = (item.nombre || item.name).substring(0, 15);
        doc.text(`${item.qty}`, 5, y);
        doc.text(`${desc}`, 15, y);
        doc.text(`$${lineTotal.toFixed(2)}`, 65, y);
        y += 4;
    });

    y += 2;
    doc.text("------------------------------------------------", 40, y, { align: "center" });

    y += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 65, y, { align: "right" });

    y += 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su preferencia!", 40, y, { align: "center" });

    doc.save(`${type}_${id}.pdf`);
    
    if (document.getElementById('module-history').classList.contains('active')) {
        renderReceipts(); // Recargar desde DB
    }
}
