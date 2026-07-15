// Configuración de Supabase
const SUPABASE_URL = 'https://jadarpxpronzyzqsowsr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZGFycHhwcm9uenl6cXNvd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNTgxNzEsImV4cCI6MjA5OTYzNDE3MX0.X_Qd_mhKBSIrdAxwEYZ0oJ-5XyKsh08BD8YgmKanass';

// Inicializar cliente
let supabaseClient = null;
if (window.supabase) {
    try {
        // En file:// Chrome puede bloquear el acceso a localStorage y lanzar excepción
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (err) {
        console.warn("No se pudo inicializar Supabase (posible bloqueo de seguridad local):", err);
    }
}

// Variables Globales
let currentModule = 'sales';

// Inicialización
async function initApp() {
    // Ocultar splash screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.classList.add('hidden'), 500);
        }
    }, 1000);
    
    if (supabaseClient) {
        try {
            // Verificar si hay sesión activa
            const { data: { session } } = await supabaseClient.auth.getSession();
            
            if (session) {
                iniciarSistema();
            } else {
                document.getElementById('auth-section').classList.remove('hidden');
            }

            // Escuchar cambios de sesión
            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    document.getElementById('auth-section').classList.add('hidden');
                    iniciarSistema();
                } else if (event === 'SIGNED_OUT') {
                    document.getElementById('auth-section').classList.remove('hidden');
                    const appSection = document.getElementById('app-section');
                    if (appSection) appSection.classList.add('hidden');
                }
            });
        } catch (err) {
            console.error("Error al iniciar sesión de Supabase:", err);
            // Fallback en caso de error de localStorage en file://
            document.getElementById('auth-section').classList.remove('hidden');
        }
    } else {
        document.getElementById('auth-section').classList.remove('hidden');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function iniciarSistema() {
    // Cargar vistas de módulos
    if(window.renderSales) window.renderSales();
    if(window.renderQuotes) window.renderQuotes();
    if(window.renderReceipts) window.renderReceipts();
    changeModule('sales');
}

// Cambiar de módulo
function changeModule(module) {
    currentModule = module;
    
    // Ocultar todos
    document.querySelectorAll('.module-section').forEach(el => el.classList.remove('active'));
    
    // Mostrar el seleccionado
    const selected = document.getElementById(`module-${module}`);
    if(selected) selected.classList.add('active');
    
    // Actualizar sidebar (Desktop)
    document.querySelectorAll('[id^="nav-"]').forEach(el => {
        if (!el.id.includes('mobile')) {
            el.classList.remove('text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-900/20');
            el.classList.add('text-gray-500');
        }
    });
    
    const navBtn = document.getElementById(`nav-${module}`);
    if (navBtn) {
        navBtn.classList.remove('text-gray-500');
        navBtn.classList.add('text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-900/20');
    }

    // Actualizar sidebar (Mobile)
    document.querySelectorAll('[id^="nav-"][id$="-mobile"]').forEach(el => {
        el.classList.remove('text-emerald-600');
        el.classList.add('text-gray-400');
    });
    
    const navBtnMobile = document.getElementById(`nav-${module}-mobile`);
    if (navBtnMobile) {
        navBtnMobile.classList.remove('text-gray-400');
        navBtnMobile.classList.add('text-emerald-600');
    }
}

// Tema Claro / Oscuro
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Cerrar sesión
async function logout() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Saldrás de tu cuenta actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sí, salir'
    }).then(async (result) => {
        if (result.isConfirmed) {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
                // La UI cambiará sola gracias a onAuthStateChange
            } else {
                document.getElementById('auth-section').classList.remove('hidden');
            }
        }
    });
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        return Swal.fire('Error', 'Por favor ingresa tu correo y contraseña.', 'error');
    }

    if (!supabaseClient) {
        // Fallback si no hay supabase (modo demo visual)
        document.getElementById('auth-section').classList.add('hidden');
        iniciarSistema();
        return;
    }

    const btn = document.querySelector('#auth-section button');
    const originalText = btn.innerText;
    btn.innerText = 'Ingresando...';
    btn.disabled = true;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;
        
        // Si fue exitoso, onAuthStateChange ocultará el form
        
    } catch (error) {
        Swal.fire('Acceso denegado', error.message, 'error');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
