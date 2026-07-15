let quoteCart = [];

async function renderQuotes() {
    const container = document.getElementById('module-quotes');
    
    // Si productsDB está vacío, intentar cargar de nuevo
    if (typeof productsDB === 'undefined' || productsDB.length === 0) {
        if(window.fetchProducts) {
            productsDB = await window.fetchProducts();
        }
    }

    container.innerHTML = `
        <div class="flex flex-col md:flex-row h-auto min-h-full md:h-full md:overflow-hidden">
            <div class="flex-1 flex flex-col min-h-[60vh] md:h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-1">Nueva Cotización</h2>
                        <p class="text-sm text-gray-500">Agrega cliente y productos a cotizar</p>
                    </div>
                </div>

                <div class="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Nombre del Cliente</label>
                            <input type="text" id="quote-client" placeholder="Ej. Juan Pérez" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">RUC / DNI (Opcional)</label>
                            <input type="text" id="quote-doc" placeholder="Número de documento" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                        </div>
                    </div>
                </div>
                
                <div class="flex-1 overflow-visible md:overflow-y-auto p-4 custom-scrollbar bg-gray-50 dark:bg-gray-900/50">
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4" id="quotes-products-grid">
                        <!-- Renderizado -->
                    </div>
                </div>
            </div>

            <div class="w-full md:w-96 bg-white dark:bg-gray-900 flex flex-col h-full shadow-lg z-10">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 bg-emerald-50 dark:bg-emerald-900/10">
                    <h3 class="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        Resumen Cotización
                    </h3>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" id="quote-items">
                    <div class="text-center text-gray-400 mt-10 text-sm">
                        Agrega productos a la cotización
                    </div>
                </div>

                <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div class="space-y-2 mb-4 text-sm">
                        <div class="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                            <span>Total Estimado</span>
                            <span id="quote-total">S/0.00</span>
                        </div>
                    </div>
                    
                    <button onclick="processQuote()" id="btn-cotizar" class="w-full bg-gray-800 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                        Generar Cotización
                    </button>
                </div>
            </div>
        </div>
    `;

    renderQuotesGrid();
}

function renderQuotesGrid() {
    const grid = document.getElementById('quotes-products-grid');
    if (!grid) return;
    
    if (typeof productsDB === 'undefined' || productsDB.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">Cargando base de datos...</div>';
        return;
    }
    
    grid.innerHTML = productsDB.map(p => `
        <div onclick="addToQuote(${p.id})" class="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-500 cursor-pointer transition-all active:scale-95">
            <h4 class="text-xs font-semibold text-gray-800 dark:text-white mb-1 truncate">${p.nombre}</h4>
            <div class="text-sm font-bold text-emerald-600">S/${p.precio.toFixed(2)}</div>
        </div>
    `).join('');
}

function addToQuote(id) {
    const product = productsDB.find(p => p.id === id);
    const existing = quoteCart.find(i => i.id === id);
    if(existing) {
        existing.qty++;
    } else {
        quoteCart.push({ ...product, qty: 1 });
    }
    updateQuoteUI();
}

function updateQuoteUI() {
    const container = document.getElementById('quote-items');
    if(quoteCart.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-400 mt-10 text-sm">Agrega productos a la cotización</div>`;
        document.getElementById('quote-total').innerText = 'S/0.00';
        return;
    }

    container.innerHTML = quoteCart.map(item => `
        <div class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm">
            <div class="flex-1 truncate pr-2">
                <span class="font-bold">${item.qty}x</span> ${item.nombre}
            </div>
            <div class="font-bold text-emerald-600">S/${(item.precio * item.qty).toFixed(2)}</div>
        </div>
    `).join('');

    const total = quoteCart.reduce((acc, item) => acc + (item.precio * item.qty), 0);
    document.getElementById('quote-total').innerText = `S/${total.toFixed(2)}`;
}

async function processQuote() {
    if(quoteCart.length === 0) return Swal.fire('Vacío', 'Agrega productos a la cotización.', 'warning');
    if (!supabaseClient) return Swal.fire('Error', 'No hay conexión a la base de datos.', 'error');
    
    const client = document.getElementById('quote-client').value || 'Cliente Generico';
    const documentStr = document.getElementById('quote-doc').value || '';
    const total = quoteCart.reduce((acc, item) => acc + (item.precio * item.qty), 0);
    const quoteId = "CT-" + Math.floor(1000 + Math.random() * 9000);

    const btn = document.getElementById('btn-cotizar');
    btn.disabled = true;
    btn.innerText = "Procesando...";

    try {
        const { data: cotiData, error: cotiError } = await supabaseClient.from('cotizaciones').insert([{
            numero_cotizacion: quoteId,
            cliente: client,
            documento: documentStr,
            total: total
        }]).select();

        if (cotiError) throw cotiError;

        const detalles = quoteCart.map(item => ({
            cotizacion_id: cotiData[0].id,
            producto_id: item.id,
            cantidad: item.qty,
            precio_unitario: item.precio,
            subtotal: item.precio * item.qty
        }));

        const { error: detallesError } = await supabaseClient.from('cotizaciones_detalle').insert(detalles);
        if (detallesError) throw detallesError;

        Swal.fire('Cotización Guardada', 'Se registró correctamente en la nube.', 'success').then(() => {
            if (window.generateReceiptPDF) {
                window.generateReceiptPDF(quoteCart, "Cotización", quoteId, client);
            }
            quoteCart = [];
            document.getElementById('quote-client').value = '';
            document.getElementById('quote-doc').value = '';
            updateQuoteUI();
        });
        
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Hubo un error al guardar la cotización: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = "Generar Cotización";
    }
}
