// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let categories = [];
let filteredProducts = [];
let currentUser = null;

// DOM Elements
const cartCountElement = document.getElementById('cart-count');
const notificationElement = document.getElementById('notification');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    updateCartCount();
});

// Initialize application
function initializeApp() {
    console.log('🚀 Venge Hardware Ecommerce initialized');
    showNotification('Bienvenido a Venge Hardware', 'success');
}

// Setup event listeners
function setupEventListeners() {
    // Order form submission
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmission);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Search functionality
    document.getElementById('product-search').addEventListener('input', function(e) {
        filterProducts();
    });
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to current nav link
    const currentLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    // Load section-specific data
    switch(sectionId) {
        case 'home':
            loadFeaturedProducts();
            break;
        case 'productos':
            loadProducts();
            break;
        case 'categorias':
            loadCategories();
            break;
        case 'carrito':
            loadCart();
            break;
        case 'historial':
            loadOrderHistory();
            break;
        case 'admin-productos':
            if (currentUser && currentUser.role === 'admin') {
                loadAdminProducts();
            }
            break;
    }
}

// Product management functions
async function loadProducts() {
    try {
        showLoading('products-list');
        
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        products = await response.json();
        filteredProducts = [...products];
        displayProducts(products);
        updateProductsCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error al cargar productos', 'error');
        displayProducts([]);
    }
}

async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error('Error al cargar productos destacados');
        }
        
        const allProducts = await response.json();
        // Show first 6 products as featured
        const featured = allProducts.slice(0, 6);
        displayFeaturedProducts(featured);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        displayFeaturedProducts([]);
    }
}

function displayProducts(productsToShow) {
    const productsList = document.getElementById('products-list');
    
    if (productsToShow.length === 0) {
        productsList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; color: #9ca3af;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    productsList.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.imagen || 'https://via.placeholder.com/300x200?text=Producto'}" 
                 alt="${product.nombre}" 
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Producto'">
            <div class="product-info">
                <div class="product-category">${product.categoria || 'Sin categoría'}</div>
                <h3 class="product-name">${product.nombre}</h3>
                <p class="product-description">${product.descripcion || 'Sin descripción'}</p>
                <div class="product-details">
                    <span class="product-price">$${product.precio?.toFixed(2) || '0.00'}</span>
                    <span class="product-stock">Stock: ${product.stock || 0}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary btn-small" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                    <button class="btn-secondary btn-small" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function displayFeaturedProducts(productsToShow) {
    const featuredProducts = document.getElementById('featured-products');
    
    if (productsToShow.length === 0) {
        featuredProducts.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 16px; color: #9ca3af;"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    featuredProducts.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.imagen || 'https://via.placeholder.com/300x200?text=Producto'}" 
                 alt="${product.nombre}" 
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Producto'">
            <div class="product-info">
                <div class="product-category">${product.categoria || 'Sin categoría'}</div>
                <h3 class="product-name">${product.nombre}</h3>
                <p class="product-description">${product.descripcion || 'Sin descripción'}</p>
                <div class="product-details">
                    <span class="product-price">$${product.precio?.toFixed(2) || '0.00'}</span>
                    <span class="product-stock">Stock: ${product.stock || 0}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary btn-small" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                    <button class="btn-secondary btn-small" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    let filtered = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm) ||
                             product.descripcion.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.categoria === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    switch(sortFilter) {
        case 'price-low':
            filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
            break;
        case 'price-high':
            filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
            break;
        case 'stock':
            filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
            break;
        case 'name':
        default:
            filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
    }
    
    filteredProducts = filtered;
    displayProducts(filtered);
    updateProductsCount();
}

function filterByCategory(category) {
    document.getElementById('category-filter').value = category;
    showSection('productos');
    filterProducts();
}

function sortProducts() {
    filterProducts();
}

function updateProductsCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = `${filteredProducts.length} productos encontrados`;
    }
}

// Category management functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        if (!response.ok) {
            throw new Error('Error al cargar categorías');
        }
        
        categories = await response.json();
        displayCategories(categories);
        
    } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('Error al cargar categorías', 'error');
    }
}

function displayCategories(categoriesToShow) {
    const categoriesList = document.getElementById('categories-list');
    
    if (categoriesToShow.length === 0) {
        categoriesList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                <i class="fas fa-tags" style="font-size: 3rem; margin-bottom: 20px; color: #9ca3af;"></i>
                <h3>No se encontraron categorías</h3>
                <p>No hay categorías disponibles en este momento</p>
            </div>
        `;
        return;
    }
    
    categoriesList.innerHTML = categoriesToShow.map(category => `
        <div class="category-card" onclick="filterByCategory('${category.nombre}')">
            <i class="fas fa-tag"></i>
            <h4>${category.nombre}</h4>
            <p>${category.descripcion || 'Sin descripción'}</p>
        </div>
    `).join('');
}

// Cart management functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('No hay suficiente stock disponible', 'warning');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCart();
    showNotification('Producto removido del carrito', 'success');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            const product = products.find(p => p.id === productId);
            if (newQuantity <= product.stock) {
                item.quantity = newQuantity;
                saveCart();
                updateCartCount();
                loadCart();
            } else {
                showNotification('No hay suficiente stock disponible', 'warning');
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function loadCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsList.style.display = 'none';
        checkoutBtn.disabled = true;
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsList.style.display = 'block';
    checkoutBtn.disabled = false;
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imagen || 'https://via.placeholder.com/80x80?text=Producto'}" 
                 alt="${item.nombre}" 
                 class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/80x80?text=Producto'">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.nombre}</h4>
                <p class="cart-item-price">$${(item.precio * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="btn-secondary btn-small" onclick="removeFromCart(${item.id})" style="background: #fef2f2; border-color: #fecaca; color: #dc2626;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Add total
    const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    cartItemsList.innerHTML += `
        <div class="cart-total">
            <h3>Total: $${total.toFixed(2)}</h3>
        </div>
    `;
}

function realizarPedido() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    // Populate order summary
    const orderItemsSummary = document.getElementById('order-items-summary');
    const orderTotal = document.getElementById('order-total');
    
    const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    
    orderItemsSummary.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${item.nombre} x${item.quantity}</span>
            <span>$${(item.precio * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    orderTotal.textContent = total.toFixed(2);
    
    showSection('pedidos');
}

async function handleOrderSubmission(event) {
    event.preventDefault();
    
    const orderData = {
        nombre: document.getElementById('order-name').value,
        email: document.getElementById('order-email').value,
        direccion: document.getElementById('order-address').value,
        telefono: document.getElementById('order-phone').value,
        items: cart.map(item => ({
            productoId: item.id,
            cantidad: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear pedido');
        }
        
        const order = await response.json();
        showNotification('Pedido creado exitosamente', 'success');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Reset form
        document.getElementById('order-form').reset();
        
        // Show order confirmation
        showOrderConfirmation(order);
        
    } catch (error) {
        console.error('Error creating order:', error);
        showNotification(error.message, 'error');
    }
}

function showOrderConfirmation(order) {
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-details');
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #059669; margin-bottom: 20px;"></i>
            <h2>¡Pedido Confirmado!</h2>
            <p>Tu pedido #${order.id} ha sido creado exitosamente.</p>
            <div style="margin: 20px 0; padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                <h3>Detalles del Pedido</h3>
                <p><strong>Total:</strong> $${order.total?.toFixed(2) || '0.00'}</p>
                <p><strong>Estado:</strong> Pendiente</p>
            </div>
            <button class="btn-primary" onclick="closeModal(); showSection('historial');">
                Ver Mis Pedidos
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Order history functions
async function loadOrderHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos`);
        if (!response.ok) {
            throw new Error('Error al cargar historial');
        }
        
        const orders = await response.json();
        displayOrderHistory(orders);
        
    } catch (error) {
        console.error('Error loading order history:', error);
        showNotification('Error al cargar historial de pedidos', 'error');
    }
}

function displayOrderHistory(orders) {
    const orderHistory = document.getElementById('order-history');
    
    if (orders.length === 0) {
        orderHistory.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 20px; color: #9ca3af;"></i>
                <h3>No hay pedidos en el historial</h3>
                <p>Realiza tu primera compra para ver tus pedidos aquí</p>
                <button class="btn-primary" onclick="showSection('productos')" style="margin-top: 20px;">
                    Ver Productos
                </button>
            </div>
        `;
        return;
    }
    
    orderHistory.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Pedido #${order.id}</span>
                <span class="order-status">${order.estado || 'Pendiente'}</span>
            </div>
            <div class="order-details">
                <p><strong>Fecha:</strong> ${new Date(order.fecha || Date.now()).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${order.total?.toFixed(2) || '0.00'}</p>
                <p><strong>Cliente:</strong> ${order.nombre || 'N/A'}</p>
            </div>
            <button class="btn-secondary btn-small" onclick="viewOrderDetails(${order.id})">
                <i class="fas fa-eye"></i> Ver Detalles
            </button>
        </div>
    `).join('');
}

// Utility functions
function showNotification(message, type = 'info') {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type} show`;
    
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading"></div>
                <p style="margin-top: 20px; color: #6b7280;">Cargando...</p>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-details');
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <img src="${product.imagen || 'https://via.placeholder.com/400x300?text=Producto'}" 
                 alt="${product.nombre}" 
                 style="width: 100%; max-width: 400px; border-radius: 8px; margin-bottom: 20px;"
                 onerror="this.src='https://via.placeholder.com/400x300?text=Producto'">
            <h2>${product.nombre}</h2>
            <p style="color: #6b7280; margin: 15px 0;">${product.descripcion || 'Sin descripción'}</p>
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                <span style="font-size: 1.5rem; color: #059669; font-weight: bold;">
                    $${product.precio?.toFixed(2) || '0.00'}
                </span>
                <span style="color: #3b82f6; font-weight: 600;">
                    Stock: ${product.stock || 0}
                </span>
            </div>
            <div style="background: #f0f9ff; color: #0369a1; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
                ${product.categoria || 'Sin categoría'}
            </div>
            <button class="btn-primary" onclick="addToCart(${product.id}); closeModal();">
                <i class="fas fa-cart-plus"></i> Agregar al Carrito
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function viewOrderDetails(orderId) {
    showNotification('Funcionalidad de detalles de pedido en desarrollo', 'warning');
}

// ================= LOGIN Y SESIÓN (Simulado) =================

// Usuarios simulados (puedes cambiar o agregar más)
const mockUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'user', password: 'user123', role: 'user', name: 'Usuario' }
];

// Cargar usuario actual desde localStorage
currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Mostrar modal de login
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('login-form').reset();
}

// Cerrar modal de login
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Login simulado
function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = { username: user.username, role: user.role, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeLoginModal();
        updateAuthUI();
        showNotification('Bienvenido, ' + user.name, 'success');
    } else {
        document.getElementById('login-error').innerText = 'Usuario o contraseña incorrectos';
        document.getElementById('login-error').style.display = 'block';
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Sesión cerrada', 'info');
    showSection('home');
}

// Actualizar UI según login/rol
function updateAuthUI() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const adminSection = document.getElementById('admin-productos');
    const navMenuUl = document.querySelector('.nav-menu ul');
    // Buscar si ya existe el enlace admin
    let adminNav = document.getElementById('admin-nav-item');
    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        // Mostrar sección admin solo si es admin
        if (currentUser.role === 'admin') {
            if (!adminNav) {
                const li = document.createElement('li');
                li.id = 'admin-nav-item';
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'nav-link';
                a.textContent = 'Administrar Productos';
                a.onclick = function() { showSection('admin-productos'); return false; };
                li.appendChild(a);
                navMenuUl.appendChild(li);
            }
            adminSection.style.display = 'block';
        } else {
            if (adminNav) adminNav.remove();
            adminSection.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        if (adminNav) adminNav.remove();
        adminSection.style.display = 'none';
    }
}

// Vincular login/logout al cargar
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', login);
    updateAuthUI();
});

// ================= CRUD ADMIN DE PRODUCTOS =================

// Cargar productos en la tabla admin (solo admin)
function loadAdminProducts() {
    if (!currentUser || currentUser.role !== 'admin') return;
    const tbody = document.querySelector('#crud-products-table tbody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.categoria}</td>
            <td>$${product.precio?.toFixed(2) || '0.00'}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Mostrar datos en el formulario para editar
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    document.getElementById('crud-product-id').value = product.id;
    document.getElementById('crud-product-name').value = product.nombre;
    document.getElementById('crud-product-category').value = product.categoria;
    document.getElementById('crud-product-price').value = product.precio;
    document.getElementById('crud-product-stock').value = product.stock;
    document.getElementById('crud-product-description').value = product.descripcion;
    showSection('admin-productos');
}

// Limpiar formulario
function resetCrudForm() {
    document.getElementById('product-crud-form').reset();
    document.getElementById('crud-product-id').value = '';
}

// Guardar producto (crear o editar)
document.getElementById('product-crud-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;
    const id = document.getElementById('crud-product-id').value;
    const nombre = document.getElementById('crud-product-name').value;
    const categoria = document.getElementById('crud-product-category').value;
    const precio = parseFloat(document.getElementById('crud-product-price').value);
    const stock = parseInt(document.getElementById('crud-product-stock').value);
    const descripcion = document.getElementById('crud-product-description').value;
    // Aquí deberías hacer fetch al backend para crear/editar
    // Simulación local:
    if (id) {
        // Editar
        const idx = products.findIndex(p => p.id == id);
        if (idx !== -1) {
            products[idx] = { ...products[idx], nombre, categoria, precio, stock, descripcion };
            showNotification('Producto actualizado (simulado)', 'success');
        }
    } else {
        // Crear
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, nombre, categoria, precio, stock, descripcion });
        showNotification('Producto creado (simulado)', 'success');
    }
    resetCrudForm();
    loadAdminProducts();
    loadProducts(); // refresca la vista pública
});

// Eliminar producto (simulado)
function deleteProduct(id) {
    if (!currentUser || currentUser.role !== 'admin') return;
    products = products.filter(p => p.id !== id);
    showNotification('Producto eliminado (simulado)', 'info');
    loadAdminProducts();
    loadProducts();
}

// Mostrar productos admin al entrar a la sección
const adminNavHandler = function() {
    if (currentUser && currentUser.role === 'admin') {
        loadAdminProducts();
    }
};

// Hook para mostrar productos admin cuando se navega a la sección
const origShowSection = showSection;
showSection = function(sectionId) {
    origShowSection(sectionId);
    if (sectionId === 'admin-productos') {
        adminNavHandler();
    }
};


// Export functions for global access
window.showSection = showSection;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.realizarPedido = realizarPedido;
window.loadProducts = loadProducts;
window.loadOrderHistory = loadOrderHistory;
window.filterProducts = filterProducts;
window.filterByCategory = filterByCategory;
window.sortProducts = sortProducts;
window.viewProductDetails = viewProductDetails;
window.viewOrderDetails = viewOrderDetails;
window.closeModal = closeModal; 