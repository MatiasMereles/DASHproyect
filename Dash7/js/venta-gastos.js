// Variables globales
let currentScreen = 'venta';
let cart = [];
let selectedCategory = 'all';
let searchTimeout;
let currentStream = null;

// Datos de ejemplo con códigos de barras
const products = [
  { id: 1, name: 'Coca Cola 2L', category: 'bebidas', price: 2500, stock: 15, image: '🥤', barcode: '7792222000123' },
  { id: 2, name: 'Pan Integral', category: 'comida', price: 1200, stock: 8, image: '🍞', barcode: '7792222000456' },
  { id: 3, name: 'Detergente Ariel', category: 'limpieza', price: 3500, stock: 5, image: '🧴', barcode: '7792222000789' },
  { id: 4, name: 'Agua Mineral 1L', category: 'bebidas', price: 800, stock: 20, image: '💧', barcode: '7792222001011' },
  { id: 5, name: 'Arroz 1kg', category: 'comida', price: 1800, stock: 12, image: '🍚', barcode: '7792222001234' },
  { id: 6, name: 'Jabón Líquido', category: 'limpieza', price: 2200, stock: 3, image: '🧼', barcode: '7792222001567' },
  { id: 7, name: 'Jugo de Naranja', category: 'bebidas', price: 1500, stock: 10, image: '🧃', barcode: '7792222001890' },
  { id: 8, name: 'Fideos 500g', category: 'comida', price: 900, stock: 18, image: '🍝', barcode: '7792222002123' }
];

const expenses = [
  { id: 1, name: 'Factura Electricidad', category: 'servicios', amount: 45000, date: '2025-05-28', image: '⚡' },
  { id: 2, name: 'Papel Higiénico', category: 'suministros', amount: 8500, date: '2025-05-27', image: '🧻' },
  { id: 3, name: 'Internet Mensual', category: 'servicios', amount: 25000, date: '2025-05-26', image: '📶' },
  { id: 4, name: 'Bolsas Plásticas', category: 'suministros', amount: 3200, date: '2025-05-25', image: '🛍️' },
  { id: 5, name: 'Mantenimiento', category: 'otros', amount: 15000, date: '2025-05-24', image: '🔧' }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  
  // Verificar si viene del menú principal con una pantalla específica
  const pantallaDestino = localStorage.getItem('pantallaDestino');
  if (pantallaDestino) {
    // Limpiar el localStorage
    localStorage.removeItem('pantallaDestino');
    
    // Cambiar a la pantalla solicitada
    if (pantallaDestino === 'gastos') {
      switchScreen('gastos');
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-screen="gastos"]').classList.add('active');
      showNotification('¡Bienvenido a la gestión de gastos!', 'success');
    } else {
      showNotification('¡Bienvenido al punto de venta!', 'success');
    }
  }
  
  renderProducts();
  renderExpenses();
  setupEventListeners();
});

function initializeApp() {
  // Toggle entre pantallas
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.getAttribute('data-screen');
      switchScreen(screen);
      
      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Filtros de categoría
  const categoryFilters = document.querySelectorAll('.category-filter');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.getAttribute('data-category');
      selectCategory(category);
      
      // Solo aplicar a filtros de la pantalla activa
      const parentFilters = filter.closest('.category-filters').querySelectorAll('.category-filter');
      parentFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      
      if (currentScreen === 'venta') {
        renderProducts();
      } else {
        renderExpenses();
      }
    });
  });

  // Inicializar buscador
  initializeSearch();
  
  // Inicializar cámara
  initializeCamera();
}

function setupEventListeners() {
  // Botón atrás
  document.getElementById('back-btn').addEventListener('click', goBack);

  // Carrito
  document.getElementById('cart-toggle').addEventListener('click', toggleCart);
  document.getElementById('cart-close').addEventListener('click', toggleCart);
  document.getElementById('process-transaction').addEventListener('click', processTransaction);
  document.getElementById('clear-cart').addEventListener('click', clearCart);

  // Agregar producto/gasto
  document.getElementById('add-product-card').addEventListener('click', showAddProductModal);
  document.getElementById('add-expense-card').addEventListener('click', showAddExpenseModal);

  // Cerrar carrito al hacer click fuera
  document.addEventListener('click', (e) => {
    const cartSummary = document.getElementById('cart-summary');
    const cartToggle = document.getElementById('cart-toggle');
    
    if (!cartSummary.contains(e.target) && !cartToggle.contains(e.target)) {
      cartSummary.classList.remove('active');
    }
  });

  // Atajo de teclado para volver atrás
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      goBack();
    }
    
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

function switchScreen(screen) {
  currentScreen = screen;
  
  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Mostrar pantalla seleccionada
  document.getElementById(`${screen}-screen`).classList.add('active');
  
  // Actualizar título del carrito
  const cartTitle = document.querySelector('.cart-title');
  cartTitle.textContent = screen === 'venta' ? 'Carrito de Venta' : 'Gastos Registrados';
  
  // Reset categoría
  selectedCategory = 'all';
  document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
}

function selectCategory(category) {
  selectedCategory = category;
}

function initializeSearch() {
  const searchInput = document.getElementById('product-search');
  const searchClear = document.getElementById('search-clear');
  const suggestions = document.getElementById('search-suggestions');

  if (!searchInput) return;

  // Búsqueda en tiempo real
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Mostrar/ocultar botón limpiar
    searchClear.style.display = query ? 'block' : 'none';
    
    // Debounce para evitar demasiadas búsquedas
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        showSearchSuggestions(query);
      } else {
        hideSuggestions();
        renderProducts(); // Mostrar todos los productos
      }
    }, 300);
  });

  // Limpiar búsqueda
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    hideSuggestions();
    renderProducts();
    searchInput.focus();
  });

  // Ocultar sugerencias al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });

  // Manejar Enter en búsqueda
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
      }
    }
  });
}

function showSearchSuggestions(query) {
  const suggestions = document.getElementById('search-suggestions');
  const results = searchProducts(query);
  
  if (results.length === 0) {
    suggestions.innerHTML = `
      <div class="suggestion-item">
        <div class="suggestion-icon">❌</div>
        <div class="suggestion-info">
          <div class="suggestion-name">No se encontraron productos</div>
          <div class="suggestion-details">Intenta con otro término de búsqueda</div>
        </div>
      </div>
    `;
  } else {
    suggestions.innerHTML = results.slice(0, 5).map(product => `
      <div class="suggestion-item" onclick="selectProduct(${product.id})">
        <div class="suggestion-icon">${product.image}</div>
        <div class="suggestion-info">
          <div class="suggestion-name">${highlightText(product.name, query)}</div>
          <div class="suggestion-details">
            ${product.category} • Stock: ${product.stock} • Código: ${product.barcode}
          </div>
        </div>
        <div class="suggestion-price">$${product.price.toLocaleString()}</div>
      </div>
    `).join('');
  }
  
  suggestions.classList.add('active');
}

function hideSuggestions() {
  const suggestions = document.getElementById('search-suggestions');
  if (suggestions) {
    suggestions.classList.remove('active');
  }
}

function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.barcode.includes(query) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

function highlightText(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function selectProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    // Limpiar búsqueda
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.value = '';
      document.getElementById('search-clear').style.display = 'none';
    }
    hideSuggestions();
    
    // Agregar al carrito directamente
    addToCart(productId);
    
    // Scroll al producto en la lista
    scrollToProduct(productId);
    
    showNotification(`${product.name} encontrado y agregado`, 'success');
  }
}

function performSearch(query) {
  const results = searchProducts(query);
  hideSuggestions();
  
  if (results.length > 0) {
    renderProducts(results);
    showNotification(`${results.length} producto(s) encontrado(s)`, 'info');
  } else {
    renderProducts([]);
    showNotification('No se encontraron productos', 'warning');
  }
}

function scrollToProduct(productId) {
  const productCard = document.querySelector(`[data-id="${productId}"]`);
  if (productCard) {
    productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    productCard.style.border = '2px solid var(--primary-orange)';
    setTimeout(() => {
      productCard.style.border = '1px solid var(--border-color)';
    }, 2000);
  }
}

function initializeCamera() {
  const barcodeBtn = document.getElementById('barcode-btn');
  
  if (barcodeBtn) {
    barcodeBtn.addEventListener('click', () => {
      if (currentScreen === 'venta') {
        openCamera();
      } else {
        showNotification('La cámara solo está disponible en modo venta', 'info');
      }
    });
  }
}

function openCamera() {
  showCameraModal();
}

function showCameraModal() {
  // Crear modal de cámara dinámicamente
  const modal = document.createElement('div');
  modal.className = 'camera-modal';
  modal.id = 'camera-modal';
  
  modal.innerHTML = `
    <div class="camera-container">
      <div class="camera-header">
        <h3 class="camera-title">Escanear Código de Barras</h3>
        <button class="camera-close" onclick="closeCamera()">&times;</button>
      </div>
      
      <div class="camera-viewport">
        <video class="camera-video" id="camera-video" autoplay playsinline></video>
        <div class="camera-overlay"></div>
      </div>
      
      <div class="camera-status" id="camera-status">
        Apunta la cámara hacia el código de barras
      </div>
      
      <div class="camera-actions">
        <button class="camera-btn secondary" onclick="closeCamera()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancelar
        </button>
        <button class="camera-btn primary" onclick="simulateScan()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Simular Escaneo
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
  
  // Iniciar cámara
  startCamera();
}

async function startCamera() {
  try {
    const video = document.getElementById('camera-video');
    const status = document.getElementById('camera-status');
    
    if (!video || !status) return;
    
    status.textContent = 'Iniciando cámara...';
    
    // Solicitar acceso a la cámara
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Cámara trasera preferida
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });
    
    video.srcObject = currentStream;
    status.textContent = 'Apunta la cámara hacia el código de barras';
    
    // Simular detección de códigos (en producción usarías una librería como QuaggaJS)
    simulateBarcodeDetection();
    
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    const status = document.getElementById('camera-status');
    if (status) {
      status.textContent = 'Error al acceder a la cámara. Verifica los permisos.';
      status.style.color = 'var(--danger)';
    }
  }
}

function simulateBarcodeDetection() {
  // En una implementación real, aquí usarías una librería de detección de códigos de barras
  // como QuaggaJS, ZXing-js, etc.
  
  const status = document.getElementById('camera-status');
  if (!status) return;
  
  let attempts = 0;
  
  const detectionInterval = setInterval(() => {
    attempts++;
    
    if (attempts > 3) {
      status.innerHTML = 'Escaneo automático disponible. <button onclick="simulateScan()" style="color: var(--primary-orange); text-decoration: underline; background: none; border: none; cursor: pointer;">Haz clic para simular</button>';
      clearInterval(detectionInterval);
    }
  }, 2000);
}

function simulateScan() {
  // Simular escaneo exitoso con un producto aleatorio
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const barcode = randomProduct.barcode;
  
  const status = document.getElementById('camera-status');
  if (status) {
    status.textContent = `¡Código detectado! ${barcode}`;
  }
  
  setTimeout(() => {
    closeCamera();
    
    // Buscar producto por código de barras
    const foundProduct = products.find(p => p.barcode === barcode);
    if (foundProduct) {
      addToCart(foundProduct.id);
      showNotification(`Producto escaneado: ${foundProduct.name}`, 'success');
      
      // Mostrar en el buscador
      const searchInput = document.getElementById('product-search');
      if (searchInput) {
        searchInput.value = foundProduct.name;
      }
    } else {
      showNotification(`Código ${barcode} no encontrado en inventario`, 'warning');
    }
  }, 1500);
}

function closeCamera() {
  const modal = document.getElementById('camera-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
  
  // Detener stream de cámara
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-header">
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-category">${product.category}</div>
        </div>
        <div class="product-price">${product.price.toLocaleString()}</div>
      </div>
      
      <div class="product-details">
        <div class="product-stock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          ${product.stock} disponibles
        </div>
        <div class="stock-status ${getStockStatus(product.stock)}">
          ${getStockText(product.stock)}
        </div>
      </div>
      
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
        <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="${product.stock}">
        <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
        <button class="btn-primary" onclick="addToCart(${product.id})" style="margin-left: auto; padding: 0.5rem 1rem; font-size: 0.9rem;">
          Agregar
        </button>
      </div>
    </div>
  `;
}

function renderProducts(customProducts = null) {
  const grid = document.getElementById('products-grid');
  const counter = document.getElementById('product-counter');
  const searchInput = document.getElementById('product-search');
  
  if (!grid || !counter) return;
  
  let filteredProducts;
  
  // Si se pasan productos personalizados (como en búsqueda), usar esos
  if (customProducts !== null) {
    filteredProducts = customProducts;
  } else if (searchInput && searchInput.value.trim()) {
    // Si hay búsqueda activa, usar esos resultados
    filteredProducts = searchProducts(searchInput.value.trim());
  } else {
    // Filtrar por categoría
    filteredProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
  }
  
  counter.textContent = filteredProducts.length;
  
  if (filteredProducts.length === 0) {
    const emptyMessage = searchInput && searchInput.value.trim() 
      ? 'No se encontraron productos' 
      : 'No hay productos';
    const emptyDescription = searchInput && searchInput.value.trim()
      ? 'Intenta con otro término de búsqueda'
      : 'No se encontraron productos en esta categoría';
      
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h3 class="empty-title">${emptyMessage}</h3>
        <p class="empty-description">${emptyDescription}</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function renderExpenses() {
  const grid = document.getElementById('expenses-grid');
  const counter = document.getElementById('expenses-counter');
  
  if (!grid || !counter) return;
  
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);
  
  counter.textContent = filteredExpenses.length;
  
  if (filteredExpenses.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h3 class="empty-title">No hay gastos</h3>
        <p class="empty-description">No se encontraron gastos en esta categoría</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredExpenses.map(expense => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-info">
          <div class="product-name">${expense.name}</div>
          <div class="product-category">${expense.category}</div>
        </div>
        <div class="product-price" style="color: var(--danger);">-${expense.amount.toLocaleString()}</div>
      </div>
      
      <div class="product-details">
        <div class="product-stock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
          </svg>
          ${expense.date}
        </div>
        <div class="stock-status" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">
          Pagado
        </div>
      </div>
    </div>
  `).join('');
}

function getStockStatus(stock) {
  if (stock === 0) return 'out';
  if (stock <= 5) return 'low';
  return 'available';
}

function getStockText(stock) {
  if (stock === 0) return 'Agotado';
  if (stock <= 5) return 'Poco Stock';
  return 'Disponible';
}

function increaseQuantity(productId) {
  const input = document.getElementById(`qty-${productId}`);
  const product = products.find(p => p.id === productId);
  
  if (!input || !product) return;
  
  const currentValue = parseInt(input.value);
  
  if (currentValue < product.stock) {
    input.value = currentValue + 1;
  }
}

function decreaseQuantity(productId) {
  const input = document.getElementById(`qty-${productId}`);
  
  if (!input) return;
  
  const currentValue = parseInt(input.value);
  
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantityInput = document.getElementById(`qty-${productId}`);
  
  if (!product) return;
  
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity
    });
  }
  
  updateCartUI();
  showNotification(`${product.name} agregado al carrito`, 'success');
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('cart-total-amount');
  
  if (!badge || !cartItems || !totalAmount) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 22V12h6v10M9 12L4.91 4.91a2.78 2.78 0 0 1 .49-3.4 2.78 2.78 0 0 1 3.4.49L19.09 12"/>
          </svg>
        </div>
        <h3 class="empty-title">Carrito vacío</h3>
        <p class="empty-description">Agrega productos para comenzar</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-details">${item.quantity} x ${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()}</div>
      </div>
    `).join('');
  }
  
  totalAmount.textContent = `${total.toLocaleString()}`;
}

function toggleCart() {
  const cartSummary = document.getElementById('cart-summary');
  if (cartSummary) {
    cartSummary.classList.toggle('active');
  }
}

function clearCart() {
  cart = [];
  updateCartUI();
  showNotification('Carrito limpiado', 'warning');
}

function processTransaction() {
  if (cart.length === 0) {
    showNotification('El carrito está vacío', 'error');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Simular procesamiento
  showNotification('Procesando venta...', 'info');
  
  setTimeout(() => {
    clearCart();
    toggleCart();
    showNotification(`Venta procesada por ${total.toLocaleString()}`, 'success');
  }, 2000);
}

function showAddProductModal() {
  //showNotification('Modal de agregar producto próximamente', 'info');
  window.location.href = 'crear-producto.html';
}

function showAddExpenseModal() {
  showNotification('Modal de agregar gasto próximamente', 'info');
}

// Función para volver atrás
function goBack() {
  // Verificar si hay modales abiertos
  const cameraModal = document.getElementById('camera-modal');
  const cartSummary = document.getElementById('cart-summary');
  
  // Si hay modal de cámara abierto, cerrarlo
  if (cameraModal && cameraModal.classList.contains('active')) {
    closeCamera();
    return;
  }
  
  // Si el carrito está abierto, cerrarlo
  if (cartSummary && cartSummary.classList.contains('active')) {
    toggleCart();
    return;
  }
  
  // Si hay búsqueda activa, limpiarla
  const searchInput = document.getElementById('product-search');
  if (searchInput && searchInput.value.trim()) {
    searchInput.value = '';
    document.getElementById('search-clear').style.display = 'none';
    hideSuggestions();
    renderProducts();
    showNotification('Búsqueda limpiada', 'info');
    return;
  }
  
  // Si hay un filtro de categoría activo (no "Todos"), resetear
  if (selectedCategory !== 'all') {
    selectedCategory = 'all';
    document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
    
    if (currentScreen === 'venta') {
      renderProducts();
    } else {
      renderExpenses();
    }
    showNotification('Filtro resetado', 'info');
    return;
  }
  
  // Si estamos en gastos, ir a venta
  if (currentScreen === 'gastos') {
    document.querySelector('[data-screen="venta"]').click();
    showNotification('Volviste a la pantalla de venta', 'info');
    return;
  }
  
  // Simular salida de la aplicación o volver al menú principal
  showExitConfirmation();
}

function showExitConfirmation() {
  const modal = document.createElement('div');
  modal.className = 'camera-modal'; // Reutilizar estilos del modal de cámara
  modal.id = 'exit-modal';
  
  modal.innerHTML = `
    <div class="camera-container">
      <div class="camera-header">
        <h3 class="camera-title">¿Salir del Punto de Venta?</h3>
        <button class="camera-close" onclick="closeExitModal()">&times;</button>
      </div>
      
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏪</div>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          ¿Estás seguro de que quieres salir del punto de venta?
        </p>
      </div>
      
      <div class="camera-actions">
        <button class="camera-btn secondary" onclick="closeExitModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancelar
        </button>
        <button class="camera-btn primary" onclick="exitApp()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/>
          </svg>
          Salir
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
}

function closeExitModal() {
  const modal = document.getElementById('exit-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function exitApp() {
  closeExitModal();
  
  // Limpiar todo
  cart = [];
  updateCartUI();
  selectedCategory = 'all';
  
  // Limpiar búsqueda
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.value = '';
    document.getElementById('search-clear').style.display = 'none';
  }
  hideSuggestions();
  
  // Volver a pantalla de venta
  currentScreen = 'venta';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('venta-screen').classList.add('active');
  
  // Reset toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-screen="venta"]').classList.add('active');
  
  // Reset filtros
  document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
  
  renderProducts();
  
  //showNotification('Volviendo al menú principal...', 'success');
  
  // Redireccionar al menú principal después de 1 segundo
  setTimeout(() => {
    window.location.href = 'MenuInicio.html';
  }, 1000);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  let bgColor, borderColor, icon;
  switch(type) {
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
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${borderColor}; color: white; font-size: 0.85rem; font-weight: bold;">${icon}</div>
      <span style="flex: 1; font-size: 0.9rem;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>
    </div>
  `;
  
  notification.style.cssText = `
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
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

// Toggle de tema (opcional)
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
}

// Agregar atajo de teclado para tema
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
});

// Funciones globales para el HTML
window.closeCamera = closeCamera;
window.simulateScan = simulateScan;
window.selectProduct = selectProduct;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCart = addToCart;
window.closeExitModal = closeExitModal;
window.exitApp = exitApp;