// === FUNCIONALIDAD CREAR PRODUCTO ===

// Variables del DOM
const imageUploadArea = document.getElementById('imageUploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const codigoBarraInput = document.getElementById('codigoBarra');
const scanButton = document.getElementById('scanButton');
const nombreProductoInput = document.getElementById('nombreProducto');
const categoriaSelect = document.getElementById('categoriaProducto');
const cantidadInput = document.getElementById('cantidad');
const costoInput = document.getElementById('costo');
const precioInput = document.getElementById('precio');
const formCrearProducto = document.getElementById('formCrearProducto');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const volverButton = document.getElementById('volverInventario');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');
const marginIndicator = document.getElementById('marginIndicator');
const marginValue = document.getElementById('marginValue');
const marginAmount = document.getElementById('marginAmount');
const marginFill = document.getElementById('marginFill');

// Variables para almacenar datos
let imagenSeleccionada = null;
let productoData = {};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadCategorias();
    initializeThemeToggle();
});

// === EVENT LISTENERS ===
function initializeEventListeners() {
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
    
    // Modal
    document.getElementById('cancelarGuardar').addEventListener('click', closeModal);
    document.getElementById('confirmarGuardar').addEventListener('click', saveProduct);
    
    // Crear nueva categoría
    document.getElementById('crearNuevaCategoria').addEventListener('click', handleCreateCategory);
    
    // Prevenir envío accidental
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
}

// === MANEJO DE IMAGEN ===
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor selecciona un archivo de imagen válido', 'warning');
        return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen no puede superar los 5MB', 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imagenSeleccionada = e.target.result;
        displayImage(e.target.result);
        showNotification('Imagen cargada correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

function displayImage(src) {
    imagePreview.innerHTML = `
        <img src="${src}" alt="Producto">
        <button type="button" class="remove-image" onclick="removeImage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
}

function removeImage() {
    imagenSeleccionada = null;
    imageInput.value = '';
    imagePreview.innerHTML = `
        <div class="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Toca para agregar imagen</span>
            <small>JPG, PNG o WEBP (máx. 5MB)</small>
        </div>
    `;
    showNotification('Imagen removida', 'info');
}

// === ESCÁNER DE CÓDIGO DE BARRAS ===
function handleBarcodeScan() {
    // Simular escaneo (en una app real se integraría con la cámara)
    showNotification('Funcionalidad de escáner próximamente disponible', 'info');
    
    // Simular código escaneado para demo
    setTimeout(() => {
        const codigoDemo = '7891234567890';
        codigoBarraInput.value = codigoDemo;
        showNotification('Código escaneado: ' + codigoDemo, 'success');
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

// === MANEJO DE CANTIDAD ===
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

// === CÁLCULO DE MARGEN ===
function calculateMargin() {
    const costo = parseFloat(costoInput.value) || 0;
    const precio = parseFloat(precioInput.value) || 0;
    
    if (costo > 0 && precio > 0) {
        const margen = ((precio - costo) / precio) * 100;
        const ganancia = precio - costo;
        
        marginValue.textContent = margen.toFixed(1) + '%';
        marginAmount.textContent = `($${ganancia.toFixed(2)})`;
        marginFill.style.width = Math.min(margen, 100) + '%';
        
        // Colorear según el margen
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

// === VALIDACIÓN DEL FORMULARIO ===
function validateForm() {
    const nombre = nombreProductoInput.value.trim();
    const categoria = categoriaSelect.value;
    const cantidad = parseInt(cantidadInput.value);
    const costo = parseFloat(costoInput.value);
    const precio = parseFloat(precioInput.value);
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre || nombre.length < 2) {
        setFieldError(nombreProductoInput, 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        setFieldSuccess(nombreProductoInput);
    }
    
    // Validar categoría
    if (!categoria) {
        setFieldError(categoriaSelect, 'Debes seleccionar una categoría');
        isValid = false;
    } else {
        setFieldSuccess(categoriaSelect);
    }
    
    // Validar cantidad
    if (isNaN(cantidad) || cantidad < 0) {
        setFieldError(cantidadInput, 'La cantidad debe ser un número válido');
        isValid = false;
    } else {
        setFieldSuccess(cantidadInput);
    }
    
    // Validar costo
    if (isNaN(costo) || costo <= 0) {
        setFieldError(costoInput, 'El costo debe ser mayor a 0');
        isValid = false;
    } else {
        setFieldSuccess(costoInput);
    }
    
    // Validar precio
    if (isNaN(precio) || precio <= 0) {
        setFieldError(precioInput, 'El precio debe ser mayor a 0');
        isValid = false;
    } else if (precio < costo) {
        setFieldError(precioInput, 'El precio no puede ser menor al costo');
        isValid = false;
    } else {
        setFieldSuccess(precioInput);
    }
    
    // Actualizar botón de guardar
    const saveButton = document.getElementById('guardarProducto');
    saveButton.disabled = !isValid;
    
    return isValid;
}

function setFieldError(field, message) {
    field.classList.remove('success');
    field.classList.add('error');
    
    // Remover mensaje anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        ${message}
    `;
    field.parentNode.appendChild(errorDiv);
}

function setFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    // Remover mensaje de error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// === MANEJO DEL FORMULARIO ===
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showNotification('Por favor corrige los errores del formulario', 'warning');
        return;
    }
    
    // Recopilar datos
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
    
    // Mostrar modal de confirmación
    modalConfirmacion.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function saveProduct() {
    closeModal();
    
    // Simular guardado
    const saveButton = document.getElementById('guardarProducto');
    saveButton.disabled = true;
    saveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Guardando...
    `;
    
    setTimeout(() => {
        showNotification(`Producto "${productoData.nombre}" creado exitosamente`, 'success');
        
        // Guardar en localStorage para demo
        saveToStorage(productoData);
        
        // Volver al inventario después de un delay
        setTimeout(() => {
            window.location.href = 'MenuInicio.html';
        }, 2000);
    }, 2000);
}

function saveToStorage(producto) {
    try {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        producto.id = Date.now(); // ID único simple
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
        console.log('Producto guardado:', producto);
    } catch (error) {
        console.error('Error al guardar producto:', error);
    }
}

function closeModal() {
    modalConfirmacion.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// === NAVEGACIÓN ===
function handleGoBack() {
    // Verificar si hay cambios sin guardar
    const hasChanges = 
        imagenSeleccionada ||
        nombreProductoInput.value.trim() ||
        codigoBarraInput.value.trim() ||
        parseInt(cantidadInput.value) !== 1 ||
        costoInput.value ||
        precioInput.value ||
        categoriaSelect.value;
    
    if (hasChanges) {
        if (confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
            window.location.href = 'MenuInicio.html';
        }
    } else {
        window.location.href = 'MenuInicio.html';
    }
}

// === CATEGORÍAS ===
function loadCategorias() {
    // Cargar categorías desde localStorage o usar las por defecto
    try {
        const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
        
        // Limpiar select excepto la primera opción
        while (categoriaSelect.children.length > 1) {
            categoriaSelect.removeChild(categoriaSelect.lastChild);
        }
        
        // Agregar categorías guardadas
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.toLowerCase().replace(/\s+/g, '-');
            option.textContent = categoria;
            categoriaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

function handleCreateCategory() {
    const nuevaCategoria = prompt('Ingresa el nombre de la nueva categoría:');
    if (nuevaCategoria && nuevaCategoria.trim()) {
        const categoriaLimpia = nuevaCategoria.trim();
        
        // Guardar en localStorage
        try {
            let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
            if (!categorias.includes(categoriaLimpia)) {
                categorias.push(categoriaLimpia);
                localStorage.setItem('categorias', JSON.stringify(categorias));
                
                // Agregar al select
                const option = document.createElement('option');
                option.value = categoriaLimpia.toLowerCase().replace(/\s+/g, '-');
                option.textContent = categoriaLimpia;
                categoriaSelect.appendChild(option);
                
                // Seleccionar la nueva categoría
                categoriaSelect.value = option.value;
                
                showNotification(`Categoría "${categoriaLimpia}" creada y seleccionada`, 'success');
                validateForm();
            } else {
                showNotification('Esta categoría ya existe', 'warning');
            }
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            showNotification('Error al crear la categoría', 'error');
        }
    }
}

// === TEMA ===
function initializeThemeToggle() {
    const toggleBtn = document.getElementById('toggleThemeProduct');
    const body = document.body;
    
    // Sincronizar con el tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    body.classList.toggle('light-mode', savedTheme === 'light');
    
    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        
        body.classList.toggle('dark-mode', !isDark);
        body.classList.toggle('light-mode', isDark);
        
        // Guardar preferencia
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// === NOTIFICACIONES ===
function showNotification(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
    let bgColor, borderColor, icon;
    switch(tipo) {
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