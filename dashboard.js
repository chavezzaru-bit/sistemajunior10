// dashboard.js

window.renderDashboard = async function() {
    const container = document.getElementById('module-dashboard');
    if (!container) return;

    container.innerHTML = `
        <div class="p-6 md:p-10 h-full overflow-y-auto custom-scrollbar">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resumen de Negocio</h2>
            
            <!-- KPIs -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ventas de Hoy</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white" id="dash-today-total">S/0.00</h3>
                        <p class="text-xs text-emerald-500 mt-2 font-medium" id="dash-today-count">0 comprobantes</p>
                    </div>
                    <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ventas de la Semana</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white" id="dash-week-total">S/0.00</h3>
                        <p class="text-xs text-blue-500 mt-2 font-medium" id="dash-week-count">0 comprobantes</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ventas del Mes</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white" id="dash-month-total">S/0.00</h3>
                        <p class="text-xs text-purple-500 mt-2 font-medium" id="dash-month-count">0 comprobantes</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                </div>
            </div>

            <!-- Gráfico y Top Productos -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Gráfico de Ventas -->
                <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Ventas Últimos 7 Días</h3>
                    <div class="relative h-[300px] w-full">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>

                <!-- Top Productos -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Top 5 Productos Vendidos</h3>
                    <div class="flex-1 overflow-y-auto custom-scrollbar" id="dash-top-products">
                        <div class="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg class="w-10 h-10 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Cargando datos...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    await loadDashboardData();
};

async function loadDashboardData() {
    if (!supabaseClient) return;

    try {
        // Fetch all sales
        const { data: ventas, error } = await supabaseClient
            .from('ventas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayTotal = 0, todayCount = 0;
        let weekTotal = 0, weekCount = 0;
        let monthTotal = 0, monthCount = 0;

        // Para el gráfico (últimos 7 días)
        const daysMap = {};
        for (let i = 6; i >= 0; i--) {
            let d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            let dateStr = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
            daysMap[dateStr] = 0;
        }

        ventas.forEach(v => {
            let date = new Date(v.created_at);
            
            if (date >= startOfToday) {
                todayTotal += v.total;
                todayCount++;
            }
            if (date >= startOfWeek) {
                weekTotal += v.total;
                weekCount++;
                
                let dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
                if (daysMap[dateStr] !== undefined) {
                    daysMap[dateStr] += v.total;
                }
            }
            if (date >= startOfMonth) {
                monthTotal += v.total;
                monthCount++;
            }
        });

        // Actualizar KPIs
        document.getElementById('dash-today-total').innerText = 'S/' + todayTotal.toFixed(2);
        document.getElementById('dash-today-count').innerText = todayCount + ' comprobantes';
        
        document.getElementById('dash-week-total').innerText = 'S/' + weekTotal.toFixed(2);
        document.getElementById('dash-week-count').innerText = weekCount + ' comprobantes';
        
        document.getElementById('dash-month-total').innerText = 'S/' + monthTotal.toFixed(2);
        document.getElementById('dash-month-count').innerText = monthCount + ' comprobantes';

        // Renderizar Gráfico
        renderChart(daysMap);

        // Fetch detalles para Top Productos
        const { data: detalles, error: errDetalles } = await supabaseClient
            .from('ventas_detalle')
            .select('producto_id, cantidad, productos(nombre)');

        if (!errDetalles && detalles) {
            let productCounts = {};
            detalles.forEach(d => {
                const nombre = d.productos ? d.productos.nombre : 'Producto Desconocido';
                if (!productCounts[nombre]) {
                    productCounts[nombre] = 0;
                }
                productCounts[nombre] += d.cantidad;
            });

            // Sort and take top 5
            let topProducts = Object.keys(productCounts).map(name => {
                return { name: name, qty: productCounts[name] };
            }).sort((a, b) => b.qty - a.qty).slice(0, 5);

            const topContainer = document.getElementById('dash-top-products');
            if (topProducts.length === 0) {
                topContainer.innerHTML = '<p class="text-sm text-gray-500 text-center mt-10">No hay ventas registradas aún.</p>';
            } else {
                topContainer.innerHTML = '<div class="space-y-4"></div>';
                const wrapper = topContainer.querySelector('div');
                
                let maxQty = topProducts[0].qty;

                topProducts.forEach((p, index) => {
                    let percentage = (p.qty / maxQty) * 100;
                    let color = index === 0 ? 'bg-emerald-500' : (index === 1 ? 'bg-blue-500' : 'bg-gray-400');
                    wrapper.innerHTML += `
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-gray-800 dark:text-gray-200 truncate pr-2">${p.name}</span>
                                <span class="font-bold text-gray-600 dark:text-gray-400">${p.qty} unid.</span>
                            </div>
                            <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div class="${color} h-2 rounded-full" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                });
            }
        }

    } catch (err) {
        console.error("Error cargando dashboard:", err);
    }
}

let chartInstance = null;
function renderChart(daysMap) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = Object.keys(daysMap);
    const data = Object.values(daysMap);

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#9ca3af' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#f3f4f6';

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Diarias (S/)',
                data: data,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                hoverBackgroundColor: 'rgba(5, 150, 105, 1)',
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    titleColor: isDark ? '#f3f4f6' : '#111827',
                    bodyColor: isDark ? '#d1d5db' : '#4b5563',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'S/' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor, drawBorder: false },
                    ticks: {
                        color: textColor,
                        callback: function(value) { return 'S/' + value; }
                    }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: textColor }
                }
            }
        }
    });
}
