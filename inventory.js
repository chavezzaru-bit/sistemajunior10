// inventory.js

let inventoryProducts = [];

window.renderInventory = async function() {
    const container = document.getElementById('module-inventory');
    if (!container) return;

    container.innerHTML = `
        <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900/50">
            <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h2>
                    <p class="text-sm text-gray-500">Gestiona tus productos y stock</p>
                </div>
                <button onclick="openProductModal()" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Nuevo Producto
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar" id="inventory-list">
                <div class="text-center text-gray-500 mt-10">Cargando inventario...</div>
            </div>
        </div>

        <!-- Modal Producto -->
        <div id="product-modal" class="hidden fixed inset-0 z-[100] bg-gray-900/50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white" id="modal-title">Nuevo Producto</h3>
                    <button onclick="closeProductModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <input type="hidden" id="prod-id">
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto del Producto</label>
                        <div class="flex items-center gap-4">
                            <div id="img-preview" class="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center bg-cover bg-center">
                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <input type="file" id="prod-image" accept="image/*" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer">
                        </div>
                        <input type="hidden" id="prod-image-url">
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input type="text" id="prod-name" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio ($)</label>
                            <input type="number" step="0.01" id="prod-price" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                            <input type="number" id="prod-stock" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                        <input type="text" id="prod-category" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    </div>
                </div>
                <div class="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
                    <button onclick="closeProductModal()" class="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Cancelar</button>
                    <button onclick="saveProduct()" id="btn-save-prod" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">Guardar</button>
                </div>
            </div>
        </div>
    `;

    await loadInventory();

    // Preview image locally
    const imgInput = document.getElementById('prod-image');
    if(imgInput) {
        imgInput.addEventListener('change', function() {
            if(this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('img-preview');
                    preview.style.backgroundImage = `url('${e.target.result}')`;
                    preview.innerHTML = '';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
};

async function loadInventory() {
    if (!supabaseClient) return;
    const list = document.getElementById('inventory-list');
    
    try {
        const { data, error } = await supabaseClient.from('productos').select('*').order('id', { ascending: false });
        if (error) throw error;

        inventoryProducts = data;

        if(data.length === 0) {
            list.innerHTML = '<div class="text-center text-gray-500 mt-10">No hay productos. Agrega uno nuevo.</div>';
            return;
        }

        list.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th class="px-4 py-3 font-medium">Producto</th>
                            <th class="px-4 py-3 font-medium">Categoría</th>
                            <th class="px-4 py-3 font-medium text-right">Precio</th>
                            <th class="px-4 py-3 font-medium text-center">Stock</th>
                            <th class="px-4 py-3 font-medium text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        ${data.map(p => `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="px-4 py-3 flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 bg-cover bg-center flex-shrink-0" style="background-image: url('${p.image_url || ''}')">
                                        ${!p.image_url ? '<svg class="w-5 h-5 text-gray-400 m-auto mt-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>' : ''}
                                    </div>
                                    <span class="font-medium text-gray-900 dark:text-gray-200">${p.nombre}</span>
                                </td>
                                <td class="px-4 py-3 text-gray-500">${p.categoria || '-'}</td>
                                <td class="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-200">$${Number(p.precio).toFixed(2)}</td>
                                <td class="px-4 py-3 text-center">
                                    <span class="px-2.5 py-1 rounded-full text-xs font-medium ${p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                                        ${p.stock}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-center gap-2">
                                        <button onclick="editProduct(${p.id})" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                        <button onclick="deleteProduct(${p.id})" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        console.error(err);
        list.innerHTML = `<div class="text-center text-red-500 mt-10">Error al cargar productos.</div>`;
    }
}

window.openProductModal = function() {
    document.getElementById('modal-title').innerText = 'Nuevo Producto';
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-stock').value = '10';
    document.getElementById('prod-category').value = '';
    document.getElementById('prod-image-url').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('img-preview').style.backgroundImage = '';
    document.getElementById('img-preview').innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
    
    document.getElementById('product-modal').classList.remove('hidden');
}

window.closeProductModal = function() {
    document.getElementById('product-modal').classList.add('hidden');
}

window.editProduct = function(id) {
    const p = inventoryProducts.find(x => x.id === id);
    if(!p) return;

    document.getElementById('modal-title').innerText = 'Editar Producto';
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-name').value = p.nombre;
    document.getElementById('prod-price').value = p.precio;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-category').value = p.categoria || '';
    document.getElementById('prod-image-url').value = p.image_url || '';
    document.getElementById('prod-image').value = '';
    
    const preview = document.getElementById('img-preview');
    if (p.image_url) {
        preview.style.backgroundImage = `url('${p.image_url}')`;
        preview.innerHTML = '';
    } else {
        preview.style.backgroundImage = '';
        preview.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
    }

    document.getElementById('product-modal').classList.remove('hidden');
}

window.deleteProduct = async function(id) {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            const { error } = await supabaseClient.from('productos').delete().eq('id', id);
            if (error) throw error;
            loadInventory();
            if(window.renderSales && document.getElementById('module-sales').classList.contains('active')) window.renderSales();
        } catch(err) {
            Swal.fire('Error', err.message, 'error');
        }
    }
}

window.saveProduct = async function() {
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const stock = document.getElementById('prod-stock').value;
    const category = document.getElementById('prod-category').value;
    const fileInput = document.getElementById('prod-image');
    let imageUrl = document.getElementById('prod-image-url').value;

    if(!name || !price || !stock) return Swal.fire('Atención', 'Nombre, Precio y Stock son obligatorios', 'warning');

    const btn = document.getElementById('btn-save-prod');
    btn.disabled = true;
    btn.innerText = 'Guardando...';

    try {
        // Si hay archivo, subir a Supabase Storage
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('productos')
                .upload(filePath, file);
                
            if (uploadError) {
                if (uploadError.message.includes('bucket')) {
                    throw new Error("El almacenamiento no está configurado. Revisa la base de datos.");
                }
                throw uploadError;
            }
            
            const { data: publicUrlData } = supabaseClient.storage
                .from('productos')
                .getPublicUrl(filePath);
                
            imageUrl = publicUrlData.publicUrl;
        }

        const payload = {
            nombre: name,
            precio: parseFloat(price),
            stock: parseInt(stock),
            categoria: category,
            image_url: imageUrl || null
        };

        if (id) {
            // Actualizar
            const { error } = await supabaseClient.from('productos').update(payload).eq('id', id);
            if (error) throw error;
        } else {
            // Crear
            const { error } = await supabaseClient.from('productos').insert([payload]);
            if (error) throw error;
        }

        closeProductModal();
        loadInventory();
        
        // Recargar productos en el POS si está cargado
        if(window.renderSales) window.renderSales();
        
        Swal.fire('Éxito', 'Producto guardado correctamente', 'success');
        
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Guardar';
    }
}
