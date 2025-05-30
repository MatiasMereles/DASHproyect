"use strict";

// Variables globales
const body = document.body;
const bgColorsBody = ["#0f0f23", "#1a1a2e", "#16213e", "#0f172a", "#1e1b4b"];
const menu = document.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
let activeItem = menu.querySelector(".active");

// Función para manejar clicks en el menú
function clickItem(item, index) {
    if (activeItem == item) return;

    if (activeItem) {
        activeItem.classList.remove("active");
    }

    item.classList.add("active");
    activeItem = item;
}

// Navegación entre secciones
const secciones = {
    inicio: document.getElementById('inicio'),
    inventario: document.getElementById('inventario'),
    deuda: document.getElementById('deuda'),
    balance: document.getElementById('balance'),
};

// Función para mostrar sección con animación
function mostrarSeccion(seccionActiva) {
    Object.keys(secciones).forEach(key => {
        if (key === seccionActiva) {
            secciones[key].style.display = 'block';
            secciones[key].style.opacity = '0';
            setTimeout(() => {
                secciones[key].style.opacity = '1';
                secciones[key].style.transition = 'opacity 0.3s ease';
            }, 10);
        } else {
            secciones[key].style.display = 'none';
        }
    });
}

// Event listeners para navegación
menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        clickItem(item, index);

        // Navegar a la sección correspondiente
        switch (index) {
            case 0:
                mostrarSeccion('inicio');
                break;
            case 1:
                mostrarSeccion('inventario');
                break;
            case 2:
                mostrarSeccion('deuda');
                break;
            case 3:
                mostrarSeccion('balance');
                break;
            default:
                mostrarSeccion('inicio');
        }
    });
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;

    let bgColor, borderColor, icon;
    switch (tipo) {
        case 'success':
            bgColor = 'rgba(16, 185, 129, 0.2)';
            borderColor = '#10b981';
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
            borderColor = '#ff6f00';
            icon = 'ℹ';
    }

    notificacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${borderColor}; color: white; font-size: 0.85rem; font-weight: bold;">${icon}</div>
            <span style="flex: 1; font-size: 0.9rem;">${mensaje}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>
        </div>
    `;

    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        border: 1px solid ${borderColor};
        border-radius: 12px;
        padding: 1rem;
        color: white;
        backdrop-filter: blur(10px);
        z-index: 10000;
        max-width: 320px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 4000);
}

// Función para navegar a la pantalla de venta/gastos
function navegarAPuntoVenta(pantalla = 'venta') {
    mostrarNotificacion(`Navegando a ${pantalla}...`, 'info');

    // Guardar la pantalla de destino en localStorage para que la app sepa qué mostrar
    localStorage.setItem('pantallaDestino', pantalla);

    // Redireccionar después de un breve delay para mostrar la notificación
    setTimeout(() => {
        window.location.href = 'venta-gastos.html';
    }, 800);
}

// Funcionalidad principal
document.addEventListener('DOMContentLoaded', function () {
    // Funcionalidad del header modernizado
    initializeHeader();

    // Animaciones de entrada para las cards
    const cards = document.querySelectorAll('.action-card, .dashboard-card, .suggested-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Efectos hover mejorados
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Funcionalidad para botones de acción principales - ACTUALIZADO
    const sellButton = document.querySelector('.sell-action');
    const buyButton = document.querySelector('.buy-action');

    if (sellButton) {
        sellButton.addEventListener('click', function () {
            navegarAPuntoVenta('venta');
        });
    }

    if (buyButton) {
        buyButton.addEventListener('click', function () {
            navegarAPuntoVenta('gastos');
        });
    }

    // Funcionalidad para cards de gestión
    const managementCards = document.querySelectorAll('.suggested-card');
    managementCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            switch (index) {
                case 0:
                    mostrarSeccion('deuda');
                    menuItems[2].click();
                    break;
                case 1:
                    mostrarNotificacion('Módulo de estadísticas próximamente', 'info');
                    break;
                case 2:
                    //mostrarNotificacion('Módulo de clientes próximamente', 'info');
                    break;
                case 3:
                    // NUEVA FUNCIONALIDAD - NAVEGAR A LISTA DE PROVEEDORES
                    mostrarNotificacion('Navegando a lista de proveedores...', 'info');
                    setTimeout(() => {
                        window.location.href = 'lista-proveedores.html';
                    }, 800);
                    break;
            }
        });
    });

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentTabs = this.closest('.modern-tabs');
            const allTabsInGroup = parentTabs.querySelectorAll('.tab-button');

            allTabsInGroup.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');

            const tabType = this.getAttribute('data-tab');
            handleTabChange(tabType);
        });
    });

    // Botones de acción en pantallas - ACTUALIZADO
    setTimeout(() => {
        // Inventario
        const createProductBtn = document.querySelector('.btn-primary-large');
        if (createProductBtn) {
            createProductBtn.addEventListener('click', () => {
                //mostrarNotificacion('Formulario de producto próximamente', 'info');
            });
        }

        const categoriesBtn = document.querySelector('.btn-secondary-large');
        if (categoriesBtn) {
            categoriesBtn.addEventListener('click', () => {
                //mostrarNotificacion('Gestión de categorías próximamente', 'info');
            });
        }

        // Balance y Deuda - Ahora navegan a punto de venta
        const newSaleButtons = document.querySelectorAll('.btn-success-large');
        newSaleButtons.forEach(button => {
            button.addEventListener('click', () => {
                navegarAPuntoVenta('venta');
            });
        });

        const newExpenseButtons = document.querySelectorAll('.btn-danger-large');
        newExpenseButtons.forEach(button => {
            button.addEventListener('click', () => {
                navegarAPuntoVenta('gastos');
            });
        });

        const balanceLinks = document.querySelectorAll('.balance-link');
        balanceLinks.forEach(link => {
            link.addEventListener('click', () => {
                const linkText = link.textContent.trim();
                if (linkText.includes('Descargar')) {
                    mostrarNotificacion('Descarga de reportes próximamente', 'info');
                } else {
                    mostrarNotificacion('Vista detallada próximamente', 'info');
                }
            });
        });
    }, 500);
});

// Funcionalidad del header modernizado
function initializeHeader() {
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');
    const notificationBadge = document.getElementById('notificationBadge');
    const configButton = document.getElementById('configButton');

    // Toggle del menú de perfil
    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!profileMenu.contains(e.target) && !profileIcon.contains(e.target)) {
                profileMenu.classList.remove('active');
            }
        });

        // Funcionalidad de los items del menú
        const menuItems = profileMenu.querySelectorAll('.profile-menu-item');
        menuItems.forEach((item, index) => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const itemText = this.textContent.trim();

                switch (index) {
                    case 0: // Mi Perfil
                        mostrarNotificacion('Perfil de usuario próximamente', 'info');
                        break;
                    case 1: // Mi Negocio
                        mostrarNotificacion('Información del negocio próximamente', 'info');
                        break;
                    case 2: // Configuración
                        mostrarNotificacion('Panel de configuración próximamente', 'info');
                        break;
                    case 3: // Cerrar Sesión
                        mostrarModalConfirmacion('¿Estás seguro de que deseas cerrar sesión?', () => {
                            mostrarNotificacion('Cerrando sesión...', 'success');
                            setTimeout(() => {
                                // Aquí iría la lógica de logout
                                mostrarNotificacion('Sesión cerrada exitosamente', 'success');
                            }, 1500);
                        });
                        break;
                }

                profileMenu.classList.remove('active');
            });
        });
    }

    // Funcionalidad de notificaciones
    if (notificationBadge) {
        notificationBadge.addEventListener('click', function () {
            mostrarNotificacion('Panel de notificaciones próximamente', 'info');
            // Simular que se leyeron las notificaciones
            setTimeout(() => {
                const count = this.querySelector('.notification-count');
                if (count) {
                    count.style.transform = 'scale(0)';
                    setTimeout(() => {
                        count.textContent = '0';
                        count.style.display = 'none';
                    }, 300);
                }
            }, 1000);
        });
    }

    // Funcionalidad del botón de configuración
    if (configButton) {
        configButton.addEventListener('click', function () {
            mostrarNotificacion('Configuración avanzada próximamente', 'info');
        });
    }
}

// Modal de confirmación
function mostrarModalConfirmacion(mensaje, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirmar Acción</h3>
            </div>
            <div class="modal-body">
                <p>${mensaje}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Cancelar</button>
                <button class="btn-confirm">Confirmar</button>
            </div>
        </div>
    `;

    // Estilos del modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        backdrop-filter: blur(5px);
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        backdrop-filter: blur(20px);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: 600;
    `;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        margin-bottom: 2rem;
        color: var(--text-secondary);
        line-height: 1.5;
    `;

    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    `;

    const btnCancel = modal.querySelector('.btn-cancel');
    const btnConfirm = modal.querySelector('.btn-confirm');

    btnCancel.style.cssText = `
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--border-color);
        background: transparent;
        color: var(--text-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    btnConfirm.style.cssText = `
        padding: 0.75rem 1.5rem;
        background: var(--danger);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Event listeners
    btnCancel.addEventListener('click', () => {
        modal.remove();
    });

    btnConfirm.addEventListener('click', () => {
        onConfirm();
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Manejar cambios de tab
function handleTabChange(tabType) {
    if (tabType === 'cobrar' || tabType === 'pagar') {
        const debtContent = document.querySelector('#deuda .debt-content');
        const emptyTitle = debtContent.querySelector('.empty-title');
        const emptyDescription = debtContent.querySelector('.empty-description');

        if (tabType === 'cobrar') {
            emptyTitle.textContent = 'No tienes deudas por cobrar';
            emptyDescription.textContent = 'Créalas registrando una nueva venta a crédito';
        } else {
            emptyTitle.textContent = 'No tienes deudas por pagar';
            emptyDescription.textContent = 'Registra tus gastos y compromisos pendientes';
        }
    }

    if (tabType === 'ingresos' || tabType === 'egresos') {
        const movementsContent = document.querySelector('#balance .movements-content');
        const emptyTitle = movementsContent.querySelector('.empty-title');
        const emptyDescription = movementsContent.querySelector('.empty-description');

        if (tabType === 'ingresos') {
            emptyTitle.textContent = 'No tienes ingresos registrados';
            emptyDescription.textContent = 'Registra tus ventas y otros ingresos';
        } else {
            emptyTitle.textContent = 'No tienes egresos registrados';
            emptyDescription.textContent = 'Registra tus gastos y compras';
        }
    }
}

// Configuración de gráficos ECharts
const getOptionChart4 = () => {
    return {
        backgroundColor: 'transparent',
        dataset: [
            {
                dimensions: ['name', 'score'],
                source: [
                    ['Harina', 314],
                    ['CocaCola', 351],
                    ['Fideos', 287],
                    ['Pan', 219],
                    ['Arroz', 253],
                ]
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'score', order: 'desc' }
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: 30,
                color: '#b4b4b4',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: {
            type: 'bar',
            encode: { x: 'name', y: 'score' },
            datasetIndex: 1,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#ff8c00'
                    }, {
                        offset: 1, color: '#ff6f00'
                    }]
                },
                borderRadius: [4, 4, 0, 0]
            }
        }
    };
};

// Inicializar gráficos cuando se carga la página
const initCharts = () => {
    const chartElement = document.getElementById("grafico");
    if (chartElement && typeof echarts !== 'undefined') {
        const chart4 = echarts.init(chartElement);
        chart4.setOption(getOptionChart4());

        window.addEventListener('resize', () => {
            chart4.resize();
        });
    }
};

// Inicializar cuando se carga la página
window.addEventListener("load", () => {
    initCharts();
});

// Agregar estilos para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);










// === FUNCIONALIDAD MODAL DE CATEGORÍAS ===

// Variables del modal
const modalCategorias = document.getElementById('modalCategorias');
const nombreCategoriaInput = document.getElementById('nombreCategoria');
const btnCrearCategoria = document.getElementById('crearCategoria');
const btnCancelarCategoria = document.getElementById('cancelarCategoria');
const btnCerrarModal = document.getElementById('closeModalCategorias');

// Función para abrir el modal
function abrirModalCategorias() {
    modalCategorias.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll del body

    // Enfocar el input después de la animación
    setTimeout(() => {
        nombreCategoriaInput.focus();
    }, 300);

    // Resetear el formulario
    resetearFormularioCategoria();
}

// Función para cerrar el modal
function cerrarModalCategorias() {
    modalCategorias.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body

    // Limpiar el input después de la animación
    setTimeout(() => {
        resetearFormularioCategoria();
    }, 300);
}

// Función para resetear el formulario
function resetearFormularioCategoria() {
    nombreCategoriaInput.value = '';
    actualizarEstadoBotonCrear();
}

// Función para validar y actualizar el estado del botón crear
function actualizarEstadoBotonCrear() {
    const nombreCategoria = nombreCategoriaInput.value.trim();
    const esValido = nombreCategoria.length >= 2 && nombreCategoria.length <= 50;

    btnCrearCategoria.disabled = !esValido;

    if (esValido) {
        btnCrearCategoria.style.opacity = '1';
        btnCrearCategoria.style.cursor = 'pointer';
    } else {
        btnCrearCategoria.style.opacity = '0.6';
        btnCrearCategoria.style.cursor = 'not-allowed';
    }
}

// Función para crear la categoría
function crearCategoria() {
    const nombreCategoria = nombreCategoriaInput.value.trim();

    // Validación
    if (nombreCategoria.length < 2) {
        mostrarNotificacion('El nombre debe tener al menos 2 caracteres', 'warning');
        return;
    }

    if (nombreCategoria.length > 50) {
        mostrarNotificacion('El nombre no puede superar los 50 caracteres', 'warning');
        return;
    }

    // Simular creación de categoría
    btnCrearCategoria.disabled = true;
    btnCrearCategoria.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Creando...
    `;

    // Simular delay de creación
    setTimeout(() => {
        mostrarNotificacion(`Categoría "${nombreCategoria}" creada exitosamente`, 'success');
        cerrarModalCategorias();

        // Restaurar botón
        btnCrearCategoria.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            Crear Categoría
        `;
        btnCrearCategoria.disabled = false;

        // Aquí puedes agregar la lógica para guardar la categoría
        console.log('Nueva categoría creada:', nombreCategoria);

    }, 1500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {

    // Abrir modal cuando se hace click en el botón de categorías
    const categoriesBtn = document.querySelector('.btn-secondary-large');
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
            abrirModalCategorias();
        });
    }

    // Cerrar modal
    btnCerrarModal.addEventListener('click', cerrarModalCategorias);
    btnCancelarCategoria.addEventListener('click', cerrarModalCategorias);

    // Cerrar modal al hacer click fuera del contenido
    modalCategorias.addEventListener('click', function (e) {
        if (e.target === modalCategorias) {
            cerrarModalCategorias();
        }
    });

    // Crear categoría
    btnCrearCategoria.addEventListener('click', crearCategoria);

    // Validación en tiempo real del input
    nombreCategoriaInput.addEventListener('input', function () {
        actualizarEstadoBotonCrear();

        // Remover caracteres especiales si es necesario
        let valor = this.value;
        // Permitir solo letras, números, espacios y algunos caracteres especiales básicos
        valor = valor.replace(/[^\w\sáéíóúñü\-&]/gi, '');
        this.value = valor;
    });

    // Crear categoría al presionar Enter
    nombreCategoriaInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !btnCrearCategoria.disabled) {
            e.preventDefault();
            crearCategoria();
        }
    });

    // Cerrar modal al presionar Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalCategorias.classList.contains('active')) {
            cerrarModalCategorias();
        }
    });

    // Inicializar estado del botón
    actualizarEstadoBotonCrear();
});

// Función adicional para mostrar categorías existentes (opcional)
function mostrarCategorias() {
    // Aquí puedes agregar lógica para mostrar las categorías existentes
    // Por ejemplo, actualizar la UI con las categorías guardadas
    console.log('Mostrar categorías existentes');
}

// Función para eliminar categoría (opcional para futuro)
function eliminarCategoria(nombreCategoria) {
    // Lógica para eliminar categoría
    console.log('Eliminar categoría:', nombreCategoria);
}









// HASTA ESTA PARTE HICE LO SIGUIENTE AGREGO 

















// === FUNCIONALIDAD CREAR PRODUCTO - AGREGAR AL FINAL DE MenuInicio.js ===

// Función para navegar a crear producto
function navegarACrearProducto() {
    mostrarNotificacion('Navegando a crear producto...', 'info');

    // Guardar estado actual
    localStorage.setItem('pantallaOrigen', 'inventario');

    // Crear overlay de transición
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 111, 0, 0.95), rgba(255, 140, 0, 0.95));
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <h3 style="margin: 0; font-size: 1.2rem;">Cargando...</h3>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Navegar después de la animación
    setTimeout(() => {
        mostrarPantallaCrearProducto();
        overlay.remove();
    }, 1200);
}

// Función principal para mostrar pantalla de crear producto
function mostrarPantallaCrearProducto() {
    // Ocultar contenido actual
    document.querySelectorAll('.contenido-seccion, #inicio').forEach(seccion => {
        seccion.style.display = 'none';
    });

    // Ocultar navegación inferior
    document.querySelector('.nav-container').style.display = 'none';

    // Crear contenido de crear producto
    const crearProductoHTML = `
        <div id="crearProductoContainer" class="crear-producto-container">
            <!-- Header de crear producto -->
            <header class="header-producto">
                <button class="back-button-producto" id="volverInventarioProducto">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="header-title-producto">
                    <h1>Crear Producto</h1>
                    <p>Completa la información del nuevo producto</p>
                </div>
                <button id="toggleThemeProducto" class="theme-toggle-button" title="Cambiar tema"></button>
            </header>

            <!-- Contenido principal -->
            <main class="main-content-producto">
                <div class="form-container-producto">
                    <form id="formCrearProducto" class="product-form">
                        
                        <!-- Sección de imagen -->
                        <div class="form-section-producto image-section-producto">
                            <h3 class="section-title-producto">📸 Imagen del Producto</h3>
                            <div class="image-upload-area-producto" id="imageUploadAreaProducto">
                                <div class="image-preview-producto" id="imagePreviewProducto">
                                    <div class="upload-placeholder-producto">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21,15 16,10 5,21"/>
                                        </svg>
                                        <span>Toca para agregar imagen</span>
                                        <small>JPG, PNG o WEBP (máx. 5MB)</small>
                                    </div>
                                </div>
                                <input type="file" id="imageInputProducto" accept="image/*" hidden>
                            </div>
                        </div>

                        <!-- Información básica -->
                        <div class="form-section-producto">
                            <h3 class="section-title-producto">📋 Información Básica</h3>
                            
                            <div class="form-group-producto">
                                <label for="codigoBarraProducto" class="form-label-producto">
                                    🏷️ Código de Barras
                                </label>
                                <div class="input-with-scan-producto">
                                    <input type="text" id="codigoBarraProducto" class="form-input-producto" placeholder="Escanea o ingresa manualmente">
                                    <button type="button" class="scan-button-producto" id="scanButtonProducto">
                                        📷
                                    </button>
                                </div>
                                <small class="form-help-producto">Opcional - Puedes escanearlo o ingresarlo manualmente</small>
                            </div>

                            <div class="form-group-producto">
                                <label for="nombreProducto" class="form-label-producto">
                                    📦 Nombre del Producto *
                                </label>
                                <input type="text" id="nombreProducto" class="form-input-producto" placeholder="Ej: Coca Cola 500ml" required maxlength="100">
                                <small class="form-help-producto">Este nombre aparecerá en el inventario y ventas</small>
                            </div>

                            <div class="form-group-producto">
                                <label for="categoriaProducto" class="form-label-producto">
                                    📂 Categoría *
                                </label>
                                <div class="select-wrapper-producto">
                                    <select id="categoriaProducto" class="form-select-producto" required>
                                        <option value="">Seleccionar categoría</option>
                                        <option value="bebidas">Bebidas</option>
                                        <option value="comestibles">Comestibles</option>
                                        <option value="hogar">Hogar</option>
                                        <option value="higiene">Higiene Personal</option>
                                        <option value="electronica">Electrónica</option>
                                    </select>
                                </div>
                                <small class="form-help-producto">Si no encuentras tu categoría, puedes <a href="#" id="crearNuevaCategoriaProducto">crear una nueva</a></small>
                            </div>
                        </div>

                        <!-- Inventario y precios -->
                        <div class="form-section-producto">
                            <h3 class="section-title-producto">💰 Inventario y Precios</h3>
                            
                            <div class="form-group-producto">
                                <label for="cantidadProducto" class="form-label-producto">
                                    📦 Cantidad Inicial *
                                </label>
                                <div class="quantity-input-producto">
                                    <button type="button" class="qty-btn-producto minus" id="decreaseQtyProducto">−</button>
                                    <input type="number" id="cantidadProducto" class="form-input-producto quantity-producto" value="1" min="0" max="999999" required>
                                    <button type="button" class="qty-btn-producto plus" id="increaseQtyProducto">+</button>
                                </div>
                                <small class="form-help-producto">Stock inicial del producto</small>
                            </div>

                            <div class="form-row-producto">
                                <div class="form-group-producto">
                                    <label for="costoProducto" class="form-label-producto">
                                        💸 Costo *
                                    </label>
                                    <div class="currency-input-producto">
                                        <span class="currency-symbol-producto">$</span>
                                        <input type="number" id="costoProducto" class="form-input-producto" placeholder="0.00" step="0.01" min="0" required>
                                    </div>
                                    <small class="form-help-producto">Precio de compra o costo unitario</small>
                                </div>

                                <div class="form-group-producto">
                                    <label for="precioProducto" class="form-label-producto">
                                        💵 Precio de Venta *
                                    </label>
                                    <div class="currency-input-producto">
                                        <span class="currency-symbol-producto">$</span>
                                        <input type="number" id="precioProducto" class="form-input-producto" placeholder="0.00" step="0.01" min="0" required>
                                    </div>
                                    <small class="form-help-producto">Precio al cual venderás el producto</small>
                                </div>
                            </div>

                            <!-- Indicador de margen -->
                            <div class="margin-indicator-producto" id="marginIndicatorProducto" style="display: none;">
                                <div class="margin-info-producto">
                                    <span class="margin-label-producto">📈 Margen de ganancia:</span>
                                    <span class="margin-value-producto" id="marginValueProducto">0%</span>
                                    <span class="margin-amount-producto" id="marginAmountProducto">($0.00)</span>
                                </div>
                                <div class="margin-bar-producto">
                                    <div class="margin-fill-producto" id="marginFillProducto"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div class="form-actions-producto">
                            <button type="button" class="btn-cancel-producto" id="cancelarProducto">
                                ❌ Cancelar
                            </button>
                            <button type="submit" class="btn-create-producto" id="guardarProducto">
                                💾 Crear Producto
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    `;

    // Insertar HTML
    document.body.insertAdjacentHTML('beforeend', crearProductoHTML);

    // Agregar estilos
    agregarEstilosCrearProducto();

    // Inicializar funcionalidad
    inicializarCrearProducto();
}

// Función para agregar estilos de crear producto
function agregarEstilosCrearProducto() {
    const estilosCSS = `
        <style id="estilosCrearProducto">
        .crear-producto-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-primary);
            z-index: 9999;
            overflow-y: auto;
        }

        .header-producto {
            background: linear-gradient(135deg, rgba(255, 111, 0, 0.85), rgba(255, 140, 0, 0.85));
            backdrop-filter: blur(6px);
            padding: 1rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            border-radius: 0 0 14px 14px;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .back-button-producto {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            flex-shrink: 0;
        }

        .back-button-producto:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateX(-2px);
        }

        .header-title-producto {
            flex: 1;
            color: white;
        }

        .header-title-producto h1 {
            font-size: 1.4rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .header-title-producto p {
            font-size: 0.85rem;
            margin: 0;
            opacity: 0.9;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .main-content-producto {
            padding: 1.5rem 1rem 6rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .form-container-producto {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            overflow: hidden;
        }

        .form-section-producto {
            padding: 2rem;
            border-bottom: 1px solid var(--border-color);
        }

        .form-section-producto:last-child {
            border-bottom: none;
        }

        .section-title-producto {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
        }

        .image-section-producto {
            text-align: center;
        }

        .image-upload-area-producto {
            position: relative;
            display: inline-block;
        }

        .image-preview-producto {
            width: 160px;
            height: 160px;
            border: 2px dashed var(--border-color);
            border-radius: 16px;
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            overflow: hidden;
            position: relative;
        }

        .image-preview-producto:hover {
            border-color: var(--primary-orange);
            background: rgba(255, 111, 0, 0.05);
            transform: scale(1.02);
        }

        .upload-placeholder-producto {
            text-align: center;
            color: var(--text-secondary);
        }

        .upload-placeholder-producto svg {
            margin-bottom: 0.75rem;
            opacity: 0.6;
        }

        .upload-placeholder-producto span {
            display: block;
            font-weight: 500;
            margin-bottom: 0.25rem;
        }

        .upload-placeholder-producto small {
            font-size: 0.75rem;
            opacity: 0.7;
        }

        .image-preview-producto img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 14px;
        }

        .form-group-producto {
            margin-bottom: 1.5rem;
        }

        .form-label-producto {
            display: block;
            color: var(--text-primary);
            font-weight: 500;
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
        }

        .form-input-producto,
        .form-select-producto {
            width: 100%;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 0.875rem 1rem;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            outline: none;
        }

        .form-input-producto::placeholder {
            color: var(--text-muted);
        }

        .form-input-producto:focus,
        .form-select-producto:focus {
            border-color: var(--primary-orange);
            background: rgba(255, 111, 0, 0.05);
            box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
            transform: translateY(-1px);
        }

        .input-with-scan-producto {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-with-scan-producto .form-input-producto {
            padding-right: 3rem;
        }

        .scan-button-producto {
            position: absolute;
            right: 0.5rem;
            background: var(--orange-gradient);
            border: none;
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .scan-button-producto:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(255, 111, 0, 0.3);
        }

        .select-wrapper-producto {
            position: relative;
        }

        .form-select-producto {
            appearance: none;
            padding-right: 3rem;
            cursor: pointer;
        }

        .form-row-producto {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        @media (min-width: 600px) {
            .form-row-producto {
                grid-template-columns: 1fr 1fr;
            }
        }

        .quantity-input-producto {
            display: flex;
            align-items: center;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            max-width: 200px;
        }

        .quantity-input-producto:focus-within {
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
        }

        .qty-btn-producto {
            background: var(--bg-card);
            border: none;
            width: 40px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-primary);
            font-size: 1.2rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .qty-btn-producto:hover {
            background: var(--orange-gradient);
            color: white;
        }

        .quantity-producto {
            border: none;
            background: transparent;
            text-align: center;
            flex: 1;
            padding: 0.875rem 0.5rem;
            min-width: 80px;
        }

        .currency-input-producto {
            position: relative;
            display: flex;
            align-items: center;
        }

        .currency-symbol-producto {
            position: absolute;
            left: 1rem;
            color: var(--text-secondary);
            font-weight: 600;
            z-index: 1;
        }

        .currency-input-producto .form-input-producto {
            padding-left: 2.5rem;
        }

        .margin-indicator-producto {
            background: rgba(255, 111, 0, 0.05);
            border: 1px solid rgba(255, 111, 0, 0.2);
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
        }

        .margin-info-producto {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .margin-label-producto {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .margin-value-producto {
            color: var(--primary-orange);
            font-weight: 600;
            font-size: 1.1rem;
        }

        .margin-amount-producto {
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        .margin-bar-producto {
            height: 6px;
            background: rgba(255, 111, 0, 0.2);
            border-radius: 3px;
            overflow: hidden;
        }

        .margin-fill-producto {
            height: 100%;
            background: var(--orange-gradient);
            border-radius: 3px;
            transition: width 0.3s ease;
            width: 0%;
        }

        .form-help-producto {
            display: block;
            color: var(--text-muted);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            line-height: 1.4;
        }

        .form-help-producto a {
            color: var(--primary-orange);
            text-decoration: none;
            font-weight: 500;
        }

        .form-help-producto a:hover {
            text-decoration: underline;
        }

        .form-actions-producto {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.02);
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }

        .btn-cancel-producto,
        .btn-create-producto {
            padding: 0.875rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            min-width: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-cancel-producto {
            background: transparent;
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
        }

        .btn-cancel-producto:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--text-secondary);
            color: var(--text-primary);
            transform: translateY(-1px);
        }

        .btn-create-producto {
            background: var(--orange-gradient);
            color: white;
            border: 2px solid transparent;
            box-shadow: 0 4px 12px rgba(255, 111, 0, 0.3);
        }

        .btn-create-producto:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 111, 0, 0.4);
        }

        .btn-create-producto:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .form-input-producto.error,
        .form-select-producto.error {
            border-color: var(--danger);
            background: rgba(239, 68, 68, 0.05);
        }

        .form-input-producto.success,
        .form-select-producto.success {
            border-color: var(--success);
            background: rgba(16, 185, 129, 0.05);
        }

        .error-message-producto {
            color: var(--danger);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        @media (max-width: 768px) {
            .main-content-producto {
                padding: 1rem 0.5rem 6rem;
            }
            
            .form-section-producto {
                padding: 1.5rem 1rem;
            }
            
            .form-actions-producto {
                padding: 1.5rem 1rem;
                flex-direction: column;
            }
            
            .btn-cancel-producto,
            .btn-create-producto {
                width: 100%;
                min-width: auto;
            }
            
            .image-preview-producto {
                width: 140px;
                height: 140px;
            }

            .margin-info-producto {
                flex-direction: column;
                text-align: center;
            }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', estilosCSS);
}

// Función para inicializar la funcionalidad de crear producto
function inicializarCrearProducto() {
    // Variables del DOM
    const imageUploadArea = document.getElementById('imageUploadAreaProducto');
    const imageInput = document.getElementById('imageInputProducto');
    const imagePreview = document.getElementById('imagePreviewProducto');
    const codigoBarraInput = document.getElementById('codigoBarraProducto');
    const scanButton = document.getElementById('scanButtonProducto');
    const nombreProductoInput = document.getElementById('nombreProducto');
    const categoriaSelect = document.getElementById('categoriaProducto');
    const cantidadInput = document.getElementById('cantidadProducto');
    const costoInput = document.getElementById('costoProducto');
    const precioInput = document.getElementById('precioProducto');
    const formCrearProducto = document.getElementById('formCrearProducto');
    const volverButton = document.getElementById('volverInventarioProducto');
    const decreaseQtyBtn = document.getElementById('decreaseQtyProducto');
    const increaseQtyBtn = document.getElementById('increaseQtyProducto');
    const marginIndicator = document.getElementById('marginIndicatorProducto');
    const marginValue = document.getElementById('marginValueProducto');
    const marginAmount = document.getElementById('marginAmountProducto');
    const marginFill = document.getElementById('marginFillProducto');
    const toggleTheme = document.getElementById('toggleThemeProducto');

    // Variables para almacenar datos
    let imagenSeleccionada = null;
    let productoData = {};

    // === EVENT LISTENERS ===

    // Imagen
    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);

    // Escáner de código de barras
    scanButton.addEventListener('click', handleBarcodeScan);

    // Cantidad
    decreaseQtyBtn.addEventListener('click', () => adjustQuantity(-1));
    increaseQtyBtn.addEventListener('click', () => adjustQuantity(1));
    cantidadInput.addEventListener('input', validateQuantity);

    // Precios y margen
    costoInput.addEventListener('input', calculateMargin);
    precioInput.addEventListener('input', calculateMargin);

    // Validación en tiempo real
    nombreProductoInput.addEventListener('input', validateForm);
    categoriaSelect.addEventListener('change', validateForm);
    codigoBarraInput.addEventListener('input', validateBarcode);

    // Formulario
    formCrearProducto.addEventListener('submit', handleFormSubmit);

    // Navegación
    volverButton.addEventListener('click', handleGoBack);

    // Crear nueva categoría
    document.getElementById('crearNuevaCategoriaProducto').addEventListener('click', handleCreateCategory);

    // Tema
    toggleTheme.addEventListener('click', () => {
        const body = document.body;
        const isDark = body.classList.contains('dark-mode');

        body.classList.toggle('dark-mode', !isDark);
        body.classList.toggle('light-mode', isDark);

        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // === FUNCIONES ===

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            mostrarNotificacion('Por favor selecciona un archivo de imagen válido', 'warning');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            mostrarNotificacion('La imagen no puede superar los 5MB', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            imagenSeleccionada = e.target.result;
            displayImage(e.target.result);
            mostrarNotificacion('Imagen cargada correctamente', 'success');
        };
        reader.readAsDataURL(file);
    }

    function displayImage(src) {
        imagePreview.innerHTML = `
            <img src="${src}" alt="Producto">
            <button type="button" class="remove-image-producto" onclick="removerImagenProducto()">
                ❌
            </button>
        `;
    }

    window.removerImagenProducto = function () {
        imagenSeleccionada = null;
        imageInput.value = '';
        imagePreview.innerHTML = `
            <div class="upload-placeholder-producto">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                <span>Toca para agregar imagen</span>
                <small>JPG, PNG o WEBP (máx. 5MB)</small>
            </div>
        `;
        mostrarNotificacion('Imagen removida', 'info');
    }

    function handleBarcodeScan() {
        mostrarNotificacion('Escaneando código...', 'info');

        setTimeout(() => {
            const codigoDemo = '7891234567890';
            codigoBarraInput.value = codigoDemo;
            mostrarNotificacion('Código escaneado: ' + codigoDemo, 'success');
            validateBarcode();
        }, 1500);
    }

    function validateBarcode() {
        const codigo = codigoBarraInput.value.trim();
        if (codigo && (codigo.length < 8 || codigo.length > 13)) {
            setFieldError(codigoBarraInput, 'El código debe tener entre 8 y 13 dígitos');
        } else {
            setFieldSuccess(codigoBarraInput);
        }
    }

    function adjustQuantity(change) {
        const currentValue = parseInt(cantidadInput.value) || 0;
        const newValue = Math.max(0, currentValue + change);
        cantidadInput.value = newValue;
        validateQuantity();
    }

    function validateQuantity() {
        const cantidad = parseInt(cantidadInput.value);
        if (isNaN(cantidad) || cantidad < 0) {
            cantidadInput.value = 0;
        }
        validateForm();
    }

    function calculateMargin() {
        const costo = parseFloat(costoInput.value) || 0;
        const precio = parseFloat(precioInput.value) || 0;

        if (costo > 0 && precio > 0) {
            const margen = ((precio - costo) / precio) * 100;
            const ganancia = precio - costo;

            marginValue.textContent = margen.toFixed(1) + '%';
            marginAmount.textContent = `(${ganancia.toFixed(2)})`;
            marginFill.style.width = Math.min(margen, 100) + '%';

            if (margen < 10) {
                marginFill.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            } else if (margen < 30) {
                marginFill.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            } else {
                marginFill.style.background = 'var(--orange-gradient)';
            }

            marginIndicator.style.display = 'block';
        } else {
            marginIndicator.style.display = 'none';
        }

        validateForm();
    }

    function validateForm() {
        const nombre = nombreProductoInput.value.trim();
        const categoria = categoriaSelect.value;
        const cantidad = parseInt(cantidadInput.value);
        const costo = parseFloat(costoInput.value);
        const precio = parseFloat(precioInput.value);

        let isValid = true;

        if (!nombre || nombre.length < 2) {
            setFieldError(nombreProductoInput, 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            setFieldSuccess(nombreProductoInput);
        }

        if (!categoria) {
            setFieldError(categoriaSelect, 'Debes seleccionar una categoría');
            isValid = false;
        } else {
            setFieldSuccess(categoriaSelect);
        }

        if (isNaN(cantidad) || cantidad < 0) {
            setFieldError(cantidadInput, 'La cantidad debe ser un número válido');
            isValid = false;
        } else {
            setFieldSuccess(cantidadInput);
        }

        if (isNaN(costo) || costo <= 0) {
            setFieldError(costoInput, 'El costo debe ser mayor a 0');
            isValid = false;
        } else {
            setFieldSuccess(costoInput);
        }

        if (isNaN(precio) || precio <= 0) {
            setFieldError(precioInput, 'El precio debe ser mayor a 0');
            isValid = false;
        } else if (precio < costo) {
            setFieldError(precioInput, 'El precio no puede ser menor al costo');
            isValid = false;
        } else {
            setFieldSuccess(precioInput);
        }

        const saveButton = document.getElementById('guardarProducto');
        saveButton.disabled = !isValid;

        return isValid;
    }

    function setFieldError(field, message) {
        field.classList.remove('success');
        field.classList.add('error');

        const existingError = field.parentNode.querySelector('.error-message-producto');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-producto';
        errorDiv.innerHTML = `❌ ${message}`;
        field.parentNode.appendChild(errorDiv);
    }

    function setFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');

        const existingError = field.parentNode.querySelector('.error-message-producto');
        if (existingError) {
            existingError.remove();
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            mostrarNotificacion('Por favor corrige los errores del formulario', 'warning');
            return;
        }

        productoData = {
            imagen: imagenSeleccionada,
            codigoBarra: codigoBarraInput.value.trim(),
            nombre: nombreProductoInput.value.trim(),
            categoria: categoriaSelect.value,
            cantidad: parseInt(cantidadInput.value),
            costo: parseFloat(costoInput.value),
            precio: parseFloat(precioInput.value),
            fechaCreacion: new Date().toISOString()
        };

        saveProduct();
    }

    function saveProduct() {
        const saveButton = document.getElementById('guardarProducto');
        saveButton.disabled = true;
        saveButton.innerHTML = '⏳ Guardando...';

        setTimeout(() => {
            mostrarNotificacion(`Producto "${productoData.nombre}" creado exitosamente`, 'success');

            // Guardar en localStorage para demo
            try {
                let productos = JSON.parse(localStorage.getItem('productos')) || [];
                productoData.id = Date.now();
                productos.push(productoData);
                localStorage.setItem('productos', JSON.stringify(productos));
                console.log('Producto guardado:', productoData);
            } catch (error) {
                console.error('Error al guardar producto:', error);
            }

            setTimeout(() => {
                cerrarCrearProducto();
            }, 2000);
        }, 2000);
    }

    function handleGoBack() {
        const hasChanges =
            imagenSeleccionada ||
            nombreProductoInput.value.trim() ||
            codigoBarraInput.value.trim() ||
            parseInt(cantidadInput.value) !== 1 ||
            costoInput.value ||
            precioInput.value ||
            categoriaSelect.value;

        if (hasChanges) {
            mostrarModalConfirmacion('¿Estás seguro? Los cambios no guardados se perderán.', () => {
                cerrarCrearProducto();
            });
        } else {
            cerrarCrearProducto();
        }
    }

    function handleCreateCategory() {
        const nuevaCategoria = prompt('Ingresa el nombre de la nueva categoría:');
        if (nuevaCategoria && nuevaCategoria.trim()) {
            const categoriaLimpia = nuevaCategoria.trim();

            try {
                let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
                if (!categorias.includes(categoriaLimpia)) {
                    categorias.push(categoriaLimpia);
                    localStorage.setItem('categorias', JSON.stringify(categorias));

                    const option = document.createElement('option');
                    option.value = categoriaLimpia.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = categoriaLimpia;
                    categoriaSelect.appendChild(option);

                    categoriaSelect.value = option.value;

                    mostrarNotificacion(`Categoría "${categoriaLimpia}" creada y seleccionada`, 'success');
                    validateForm();
                } else {
                    mostrarNotificacion('Esta categoría ya existe', 'warning');
                }
            } catch (error) {
                console.error('Error al guardar categoría:', error);
                mostrarNotificacion('Error al crear la categoría', 'error');
            }
        }
    }

    // Cancelar producto
    document.getElementById('cancelarProducto').addEventListener('click', handleGoBack);

    // Inicializar validación
    validateForm();
}

// Función para cerrar crear producto y volver al inventario
function cerrarCrearProducto() {
    // Remover container y estilos
    const container = document.getElementById('crearProductoContainer');
    const estilos = document.getElementById('estilosCrearProducto');

    if (container) container.remove();
    if (estilos) estilos.remove();

    // Mostrar navegación
    document.querySelector('.nav-container').style.display = 'block';

    // Volver a inventario
    mostrarSeccion('inventario');

    // Actualizar menú activo
    menuItems.forEach(item => item.classList.remove('active'));
    menuItems[1].classList.add('active'); // Inventario
    activeItem = menuItems[1];

    mostrarNotificacion('Volviendo al inventario...', 'info');
}

// ACTUALIZAR LA FUNCIONALIDAD DEL BOTÓN CREAR PRODUCTO EN EL CÓDIGO EXISTENTE
// Reemplazar en la sección existente:

setTimeout(() => {
    // Inventario - NAVEGACIÓN A CREAR PRODUCTO ACTUALIZADA
    const createProductBtn = document.querySelector('.btn-primary-large');
    if (createProductBtn) {
        createProductBtn.addEventListener('click', () => {
            navegarACrearProducto();
        });
    }

    const categoriesBtn = document.querySelector('.btn-secondary-large');
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
            if (typeof abrirModalCategorias === 'function') {
                abrirModalCategorias();
            } else {
                mostrarNotificacion('Funcionalidad de categorías próximamente', 'info');
            }
        });
    }

    // Balance y Deuda - navegación existente
    const newSaleButtons = document.querySelectorAll('.btn-success-large');
    newSaleButtons.forEach(button => {
        button.addEventListener('click', () => {
            navegarAPuntoVenta('venta');
        });
    });

    const newExpenseButtons = document.querySelectorAll('.btn-danger-large');
    newExpenseButtons.forEach(button => {
        button.addEventListener('click', () => {
            navegarAPuntoVenta('gastos');
        });
    });

    const balanceLinks = document.querySelectorAll('.balance-link');
    balanceLinks.forEach(link => {
        link.addEventListener('click', () => {
            const linkText = link.textContent.trim();
            if (linkText.includes('Descargar')) {
                mostrarNotificacion('Descarga de reportes próximamente', 'info');
            } else {
                mostrarNotificacion('Vista detallada próximamente', 'info');
            }
        });
    });
}, 500);

// === FIN DEL CÓDIGO DE CREAR PRODUCTO ===


















// BUSCAR ESTA SECCIÓN EN MenuInicio.js Y REEMPLAZARLA:

// Funcionalidad para cards de gestión
const managementCards = document.querySelectorAll('.suggested-card');
managementCards.forEach((card, index) => {
    card.addEventListener('click', function () {
        switch (index) {
            case 0:
                mostrarSeccion('deuda');
                menuItems[2].click();
                break;
            case 1:
                mostrarNotificacion('Módulo de estadísticas próximamente', 'info');
                break;
            case 2:
                // NUEVA FUNCIONALIDAD - NAVEGAR A LISTA DE CLIENTES
                mostrarNotificacion('Navegando a lista de clientes...', 'info');
                setTimeout(() => {
                    window.location.href = 'lista-clientes.html';
                }, 800);
                break;
            case 3:
                mostrarNotificacion('Módulo de proveedores próximamente', 'info');
                break;
        }
    });
});