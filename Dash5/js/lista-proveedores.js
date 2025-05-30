// === FUNCIONALIDAD LISTA DE PROVEEDORES ===

// Variables globales
let proveedores = [];
let proveedoresFiltrados = [];
let filtroActual = 'todos';
let proveedorSeleccionado = null;

// Variables del DOM
const proveedoresLista = document.getElementById('proveedoresLista');
const estadoVacio = document.getElementById('estadoVacio');
const sinResultados = document.getElementById('sinResultados');
const searchInput = document.getElementById('searchProveedores');
const filterTabs = document.querySelectorAll('.filter-tab');
const nuevoProveedorBtn = document.getElementById('nuevoProveedorBtn');
const volverInicioBtn = document.getElementById('volverInicio');
const toggleThemeBtn = document.getElementById('toggleThemeListaProveedores');
const modalEliminar = document.getElementById('modalEliminar');
const modalDetalle = document.getElementById('modalDetalle');

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando lista de proveedores...');
    
    try {
        initializeEventListeners();
        initializeTheme();
        cargarProveedores();
        filtrarProveedores();
        renderizarProveedores();
        actualizarContadores();
        
        console.log('Lista de proveedores inicializada correctamente');
        console.log('Proveedores cargados:', proveedores.length);
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarNotificacion('Error al cargar la aplicación', 'error');
    }
});

// === EVENT LISTENERS ===
function initializeEventListeners() {
    // Navegación
    if (volverInicioBtn) {
        volverInicioBtn.addEventListener('click', function() {
            window.location.href = 'MenuInicio.html';
        });
    }
    
    // Nuevo proveedor
    if (nuevoProveedorBtn) {
        nuevoProveedorBtn.addEventListener('click', navegarACrearProveedor);
    }
    
    const crearPrimerProveedorBtn = document.getElementById('crearPrimerProveedor');
    if (crearPrimerProveedorBtn) {
        crearPrimerProveedorBtn.addEventListener('click', navegarACrearProveedor);
    }
    
    // Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filtrarProveedores();
            renderizarProveedores();
        });
    }
    
    const limpiarBusquedaBtn = document.getElementById('limpiarBusqueda');
    if (limpiarBusquedaBtn) {
        limpiarBusquedaBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                filtrarProveedores();
                renderizarProveedores();
            }
        });
    }
    
    // Filtros
    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const filtro = tab.getAttribute('data-filter');
            aplicarFiltro(filtro);
        });
    });
    
    // Modal eliminar
    const cancelarEliminar = document.getElementById('cancelarEliminar');
    if (cancelarEliminar) {
        cancelarEliminar.addEventListener('click', cerrarModalEliminar);
    }
    
    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
    if (confirmarEliminarBtn) {
        confirmarEliminarBtn.addEventListener('click', confirmarEliminar);
    }
    
    // Modal detalle
    const cerrarDetalleBtn = document.getElementById('cerrarDetalle');
    if (cerrarDetalleBtn) {
        cerrarDetalleBtn.addEventListener('click', cerrarModalDetalle);
    }
    
    const editarProveedorBtn = document.getElementById('editarProveedor');
    if (editarProveedorBtn) {
        editarProveedorBtn.addEventListener('click', function() {
            mostrarNotificacion('Funcionalidad de edición próximamente', 'info');
            cerrarModalDetalle();
        });
    }
    
    const contactarProveedorBtn = document.getElementById('contactarProveedor');
    if (contactarProveedorBtn) {
        contactarProveedorBtn.addEventListener('click', function() {
            if (proveedorSeleccionado && proveedorSeleccionado.telefono) {
                contactarProveedorDirecto(proveedorSeleccionado.telefono);
                cerrarModalDetalle();
            }
        });
    }
    
    // Cerrar modales al hacer click fuera
    if (modalEliminar) {
        modalEliminar.addEventListener('click', function(e) {
            if (e.target === modalEliminar) {
                cerrarModalEliminar();
            }
        });
    }
    
    if (modalDetalle) {
        modalDetalle.addEventListener('click', function(e) {
            if (e.target === modalDetalle) {
                cerrarModalDetalle();
            }
        });
    }
    
    // Tecla escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModalEliminar();
            cerrarModalDetalle();
        }
        
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            navegarACrearProveedor();
        }
    });
    
    // Tema
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', toggleTheme);
    }
}

// === NAVEGACIÓN ===
function navegarACrearProveedor() {
    mostrarNotificacion('Navegando a crear proveedor...', 'info');
    setTimeout(function() {
        window.location.href = 'crear-proveedor.html';
    }, 500);
}

// === GESTIÓN DE DATOS ===
function cargarProveedores() {
    try {
        const proveedoresGuardados = localStorage.getItem('proveedores');
        if (proveedoresGuardados) {
            proveedores = JSON.parse(proveedoresGuardados);
        } else {
            proveedores = [];
        }
        console.log('Proveedores cargados desde localStorage:', proveedores.length);
    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        proveedores = [];
        mostrarNotificacion('Error al cargar los proveedores', 'error');
    }
}

function guardarProveedores() {
    try {
        localStorage.setItem('proveedores', JSON.stringify(proveedores));
        console.log('Proveedores guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar proveedores:', error);
        mostrarNotificacion('Error al guardar los cambios', 'error');
    }
}

// === RENDERIZADO ===
function renderizarProveedores() {
    console.log('Renderizando proveedores...', proveedoresFiltrados.length);
    
    if (proveedoresLista) {
        proveedoresLista.innerHTML = '';
    }
    
    if (proveedores.length === 0) {
        mostrarEstadoVacio();
        return;
    }
    
    if (proveedoresFiltrados.length === 0) {
        mostrarSinResultados();
        return;
    }
    
    if (estadoVacio) {
        estadoVacio.style.display = 'none';
    }
    if (sinResultados) {
        sinResultados.style.display = 'none';
    }
    
    proveedoresFiltrados.forEach(function(proveedor, index) {
        const proveedorCard = crearProveedorCard(proveedor, index);
        if (proveedoresLista) {
            proveedoresLista.appendChild(proveedorCard);
        }
    });
}

function crearProveedorCard(proveedor, index) {
    const card = document.createElement('div');
    card.className = 'proveedor-card';
    card.style.animationDelay = (index * 0.1) + 's';
    
    const tipoEmoji = obtenerEmojiTipo(proveedor.tipo);
    const fechaCreacion = formatearFecha(proveedor.fechaCreacion);
    
    card.innerHTML = `
        <div class="proveedor-header">
            <div class="proveedor-info">
                <h3 class="proveedor-nombre">${proveedor.contacto}</h3>
                <div class="proveedor-empresa">${proveedor.empresa}</div>
                <span class="proveedor-tipo">${tipoEmoji} ${proveedor.tipo || 'Distribuidor'}</span>
            </div>
            <div class="proveedor-actions">
                <button class="proveedor-action-btn" title="Ver detalles">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                </button>
                ${proveedor.telefono ? `
                    <button class="proveedor-action-btn contact-btn" title="Contactar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </button>
                ` : ''}
                <button class="proveedor-action-btn delete" title="Eliminar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                    </svg>
                </button>
            </div>
        </div>
        
        <div class="proveedor-details">
            <div class="proveedor-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>${proveedor.telefono}</span>
            </div>
            
            <div class="proveedor-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>${proveedor.email || 'No especificado'}</span>
            </div>
            
            <div class="proveedor-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${proveedor.direccion}</span>
            </div>
            
            <div class="proveedor-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Desde ${fechaCreacion}</span>
            </div>
        </div>
    `;
    
    // Event listeners para la card
    const detalleBtn = card.querySelector('.proveedor-action-btn:first-child');
    if (detalleBtn) {
        detalleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mostrarDetalle(proveedor.id);
        });
    }
    
    const contactBtn = card.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            contactarProveedorDirecto(proveedor.telefono);
        });
    }
    
    const deleteBtn = card.querySelector('.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            confirmarEliminarProveedor(proveedor.id, proveedor.empresa);
        });
    }
    
    card.addEventListener('click', function() {
        mostrarDetalle(proveedor.id);
    });
    
    return card;
}

function mostrarEstadoVacio() {
    if (estadoVacio) estadoVacio.style.display = 'block';
    if (sinResultados) sinResultados.style.display = 'none';
}

function mostrarSinResultados() {
    if (estadoVacio) estadoVacio.style.display = 'none';
    if (sinResultados) sinResultados.style.display = 'block';
}

// === FILTROS Y BÚSQUEDA ===
function aplicarFiltro(filtro) {
    filtroActual = filtro;
    
    filterTabs.forEach(function(tab) {
        if (tab.getAttribute('data-filter') === filtro) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    filtrarProveedores();
    renderizarProveedores();
}

function filtrarProveedores() {
    const busqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    proveedoresFiltrados = proveedores.filter(function(proveedor) {
        const cumpleTipo = filtroActual === 'todos' || proveedor.tipo === filtroActual;
        
        const cumpleBusqueda = !busqueda || 
            proveedor.empresa.toLowerCase().includes(busqueda) ||
            proveedor.contacto.toLowerCase().includes(busqueda) ||
            proveedor.telefono.toLowerCase().includes(busqueda) ||
            (proveedor.email && proveedor.email.toLowerCase().includes(busqueda)) ||
            proveedor.direccion.toLowerCase().includes(busqueda);
        
        return cumpleTipo && cumpleBusqueda;
    });
}

function actualizarContadores() {
    const contadores = {
        todos: proveedores.length,
        distribuidor: proveedores.filter(function(p) { return p.tipo === 'distribuidor'; }).length,
        mayorista: proveedores.filter(function(p) { return p.tipo === 'mayorista'; }).length,
        fabricante: proveedores.filter(function(p) { return p.tipo === 'fabricante'; }).length
    };
    
    Object.keys(contadores).forEach(function(tipo) {
        const elemento = document.getElementById('count' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
        if (elemento) {
            elemento.textContent = contadores[tipo];
        }
    });
}

// === MODAL DE DETALLE ===
function mostrarDetalle(proveedorId) {
    const proveedor = proveedores.find(function(p) { 
        return p.id == proveedorId; 
    });
    
    if (!proveedor) {
        mostrarNotificacion('Proveedor no encontrado', 'error');
        return;
    }
    
    proveedorSeleccionado = proveedor;
    
    const contenido = document.getElementById('contenidoDetalle');
    if (contenido) {
        contenido.innerHTML = generarContenidoDetalle(proveedor);
    }
    
    if (modalDetalle) {
        modalDetalle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function generarContenidoDetalle(proveedor) {
    return `
        <div class="detalle-group">
            <div class="detalle-title">Información de la Empresa</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Empresa</div>
                    <div class="detalle-value">${proveedor.empresa}</div>
                </div>
            </div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Tipo de Proveedor</div>
                    <div class="detalle-value">${proveedor.tipo || 'Distribuidor'}</div>
                </div>
            </div>
        </div>
        
        <div class="detalle-group">
            <div class="detalle-title">Contacto</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Persona de Contacto</div>
                    <div class="detalle-value">${proveedor.contacto}</div>
                </div>
            </div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Teléfono</div>
                    <div class="detalle-value">${proveedor.telefono}</div>
                </div>
            </div>
        </div>
    `;
}

function cerrarModalDetalle() {
    if (modalDetalle) {
        modalDetalle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    proveedorSeleccionado = null;
}

// === ELIMINAR PROVEEDOR ===
function confirmarEliminarProveedor(proveedorId, empresaProveedor) {
    proveedorSeleccionado = { id: proveedorId, empresa: empresaProveedor };
    
    const mensaje = document.getElementById('mensajeEliminar');
    if (mensaje) {
        mensaje.textContent = '¿Estás seguro de eliminar a "' + empresaProveedor + '"?';
    }
    
    if (modalEliminar) {
        modalEliminar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalEliminar() {
    if (modalEliminar) {
        modalEliminar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    proveedorSeleccionado = null;
}

function confirmarEliminar() {
    if (!proveedorSeleccionado) return;
    
    const index = proveedores.findIndex(function(p) { 
        return p.id == proveedorSeleccionado.id; 
    });
    
    if (index !== -1) {
        proveedores.splice(index, 1);
        guardarProveedores();
        
        mostrarNotificacion('Proveedor "' + proveedorSeleccionado.empresa + '" eliminado', 'success');
        
        filtrarProveedores();
        renderizarProveedores();
        actualizarContadores();
    }
    
    cerrarModalEliminar();
}

// === CONTACTAR PROVEEDOR ===
function contactarProveedorDirecto(numero) {
    const numeroLimpio = numero.replace(/\D/g, '');
    const opcionElegida = confirm('¿Cómo deseas contactar?\n\nOK = WhatsApp\nCancelar = Llamada telefónica');
    
    if (opcionElegida) {
        const mensaje = encodeURIComponent('Hola, me contacto desde mi negocio para consultar sobre productos.');
        const url = 'https://wa.me/' + numeroLimpio + '?text=' + mensaje;
        window.open(url, '_blank');
        mostrarNotificacion('Abriendo WhatsApp...', 'success');
    } else {
        window.open('tel:' + numeroLimpio, '_self');
        mostrarNotificacion('Iniciando llamada...', 'success');
    }
}

// === TEMA ===
function initializeTheme() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(savedTheme + '-mode');
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(isDark ? 'light-mode' : 'dark-mode');
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// === FUNCIONES DE UTILIDAD ===
function formatearFecha(fecha) {
    try {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function obtenerEmojiTipo(tipo) {
    const emojis = {
        'distribuidor': '🚚',
        'mayorista': '📦',
        'fabricante': '🏭',
        'importador': '🌍'
    };
    return emojis[tipo] || '🚚';
}

// === NOTIFICACIONES ===
function mostrarNotificacion(mensaje, tipo) {
    tipo = tipo || 'info';
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion notificacion-' + tipo;
    
    let bgColor, borderColor, icon;
    switch(tipo) {
        case 'success':
            bgColor = 'rgba(251, 146, 60, 0.2)';
            borderColor = '#f97316';
            icon = '✓';
            break;
        case 'warning':
            bgColor = 'rgba(245, 158, 11, 0.2)';
            borderColor = '#f59e0b';
            icon = '⚠';
            break;
        case 'error':
            bgColor = 'rgba(239, 68, 68, 0.2)';
            borderColor = '#ef4444';
            icon = '✕';
            break;
        default:
            bgColor = 'rgba(255, 255, 255, 0.05)';
            borderColor = '#f97316';
            icon = 'ℹ';
    }
    
    notificacion.innerHTML = '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
        '<div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ' + borderColor + '; color: white; font-size: 0.85rem; font-weight: bold;">' + icon + '</div>' +
        '<span style="flex: 1; font-size: 0.9rem;">' + mensaje + '</span>' +
        '<button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>' +
    '</div>';
    
    notificacion.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + bgColor + '; border: 1px solid ' + borderColor + '; border-radius: 12px; padding: 1rem; color: white; backdrop-filter: blur(10px); z-index: 10000; max-width: 320px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); animation: slideInRight 0.3s ease;';
    
    document.body.appendChild(notificacion);
    
    setTimeout(function() {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 4000);
}

// === ESTILOS PARA ANIMACIONES ===
const style = document.createElement('style');
style.textContent = '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
document.head.appendChild(style);

// === ACTUALIZACIÓN AUTOMÁTICA ===
window.addEventListener('focus', function() {
    const proveedoresActuales = proveedores.length;
    cargarProveedores();
    
    if (proveedores.length !== proveedoresActuales) {
        filtrarProveedores();
        renderizarProveedores();
        actualizarContadores();
        
        if (proveedores.length > proveedoresActuales) {
            mostrarNotificacion('Lista actualizada con nuevos proveedores', 'success');
        }
    }
});

// === GESTIÓN DE ERRORES ===
window.addEventListener('error', function(e) {
    console.error('Error en lista de proveedores:', e.error);
    mostrarNotificación('Ha ocurrido un error inesperado', 'error');
});

// === FIN DEL ARCHIVO ===