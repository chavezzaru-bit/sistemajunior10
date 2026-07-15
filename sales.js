let productsDB = [];
let cart = [];

async function fetchProducts() {
    if (!supabaseClient) return [];
    try {
        const { data, error } = await supabaseClient.from('productos').select('*').order('nombre');
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error cargando productos:", err);
        return [];
    }
}

async function renderSales() {
    const container = document.getElementById('module-sales');
    
    // Cargar productos de la base de datos
    productsDB = await fetchProducts();

    container.innerHTML = `
        <div class="flex flex-col md:flex-row h-full">
            <!-- Panel Principal: Productos -->
            <div class="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Nueva Venta</h2>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" id="search-product" placeholder="Buscar producto..." class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50 dark:bg-gray-900/50">
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4" id="products-grid">
                        <!-- Cargando... -->
                        <div class="col-span-full text-center text-gray-500 py-10">Cargando productos...</div>
                    </div>
                </div>
            </div>

            <!-- Panel Lateral: Carrito -->
            <div class="w-full md:w-96 bg-white dark:bg-gray-900 flex flex-col h-full shadow-lg z-10">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Resumen de Venta
                    </h3>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" id="cart-items">
                    <div class="text-center text-gray-400 mt-10 text-sm">
                        El carrito está vacío
                    </div>
                </div>

                <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div class="space-y-2 mb-4 text-sm">
                        <div class="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between text-gray-500">
                            <span>IGV (18%)</span>
                            <span id="cart-tax">$0.00</span>
                        </div>
                        <div class="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span id="cart-total">$0.00</span>
                        </div>
                    </div>
                    
                    <button onclick="processSale()" id="btn-cobrar" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                        Cobrar Venta
                    </button>
                </div>
            </div>
        </div>
    `;

    renderProductsGrid();
}

function renderProductsGrid() {
    const grid = document.getElementById('products-grid');
    if (productsDB.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay productos en la base de datos. Ejecuta el script SQL en Supabase.</div>';
        return;
    }
    
    grid.innerHTML = productsDB.map(p => `
        <div onclick="addToCart(${p.id})" class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-500 cursor-pointer transition-all active:scale-95 group">
            <div class="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-1">${p.categoria || 'Sin categoría'}</div>
            <h4 class="text-sm font-semibold text-gray-800 dark:text-white leading-tight mb-2 h-10 overflow-hidden">${p.nombre}</h4>
            <div class="flex items-end justify-between mt-auto">
                <span class="text-lg font-bold text-gray-900 dark:text-white">$${p.precio.toFixed(2)}</span>
                <span class="text-xs text-gray-500">Stock: ${p.stock}</span>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = productsDB.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateItemQty(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += change;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="text-center text-gray-400 mt-10 text-sm">El carrito está vacío</div>`;
        document.getElementById('cart-subtotal').innerText = '$0.00';
        document.getElementById('cart-tax').innerText = '$0.00';
        document.getElementById('cart-total').innerText = '$0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
            <div class="flex-1">
                <h5 class="text-sm font-semibold text-gray-800 dark:text-white leading-tight">${item.nombre}</h5>
                <p class="text-xs text-emerald-600 font-bold">$${item.precio.toFixed(2)}</p>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button onclick="updateItemQty(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors">-</button>
                <span class="w-6 text-center text-sm font-bold">${item.qty}</span>
                <button onclick="updateItemQty(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;
}

async function processSale() {
    if (cart.length === 0) return Swal.fire('Carrito vacío', 'Agrega productos.', 'warning');
    if (!supabaseClient) return Swal.fire('Error', 'No hay conexión a la base de datos.', 'error');

    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const ticketId = "TK-" + Math.floor(1000 + Math.random() * 9000);

    const btn = document.getElementById('btn-cobrar');
    btn.disabled = true;
    btn.innerText = "Procesando...";

    try {
        // Guardar cabecera de venta
        const { data: ventaData, error: ventaError } = await supabaseClient.from('ventas').insert([{
            numero_ticket: ticketId,
            subtotal: subtotal,
            igv: tax,
            total: total
        }]).select();

        if (ventaError) throw ventaError;

        // Guardar detalles
        const detalles = cart.map(item => ({
            venta_id: ventaData[0].id,
            producto_id: item.id,
            cantidad: item.qty,
            precio_unitario: item.precio,
            subtotal: item.precio * item.qty
        }));

        const { error: detallesError } = await supabaseClient.from('ventas_detalle').insert(detalles);
        if (detallesError) throw detallesError;

        Swal.fire('Venta Guardada', 'Se registró en la nube correctamente.', 'success').then(() => {
            if (window.generateReceiptPDF) {
                window.generateReceiptPDF(cart, "Venta", ticketId);
            }
            cart = [];
            updateCartUI();
        });
        
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Hubo un error al guardar la venta: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `Cobrar Venta`;
    }
}
