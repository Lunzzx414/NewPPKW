// Modern Portfolio - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSkillBars();
    initLightbox();
    initScrollAnimations();
    trackPageView();
    
    // Admin page specific initialization
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'admin.html') {
        initAdminPanel();
    }
});

// Navigation Active State
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Animated Skill Bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    if (skillBars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillBar = entry.target;
                const percentage = fillBar.getAttribute('data-percentage');
                
                setTimeout(() => {
                    fillBar.style.width = percentage + '%';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Lightbox for Awards
function initLightbox() {
    const awardItems = document.querySelectorAll('.award-item');
    
    awardItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, this.querySelector('h3').textContent);
            }
        });
    });
}

function openLightbox(imageSrc, title) {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector('.lightbox-container');
    if (existingLightbox) existingLightbox.remove();
    
    const container = document.createElement('div');
    container.className = 'lightbox-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90vh;
        text-align: center;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        animation: slideUp 0.4s ease;
    `;
    
    const titleEl = document.createElement('p');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        color: white;
        margin-top: 20px;
        font-size: 1.2rem;
        font-weight: 600;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#0066ff');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = 'white');
    closeBtn.addEventListener('click', () => container.remove());
    
    content.appendChild(img);
    content.appendChild(titleEl);
    content.appendChild(closeBtn);
    container.appendChild(content);
    
    container.addEventListener('click', (e) => {
        if (e.target === container) container.remove();
    });
    
    document.body.appendChild(container);
}

// Dark Mode Toggle
// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + 1: Home
    if (e.altKey && e.key === '1') {
        window.location.href = 'index.html';
    }
    // Alt + 2: Awards
    if (e.altKey && e.key === '2') {
        window.location.href = 'awards.html';
    }
    // Alt + 3: Specialty
    if (e.altKey && e.key === '3') {
        window.location.href = 'specialty.html';
    }
    // Alt + T: Toggle dark mode
    if (e.altKey && e.key === 't') {
        document.getElementById('theme-toggle').click();
    }
});

// Page view tracking
function trackPageView() {
    const views = JSON.parse(localStorage.getItem('portfolioViews') || '[]');
    views.push({
        page: window.location.pathname,
        time: new Date().toISOString()
    });
    
    if (views.length > 50) {
        views.shift();
    }
    
    localStorage.setItem('portfolioViews', JSON.stringify(views));
}

// Add CSS animations if not present
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== ADMIN PANEL FUNCTIONALITY ==========

function initAdminPanel() {
    loadOrders();
    initAddOrderForm();
    initSearchAndFilter();
    initEditModal();
    updateStatistics();
}

// Load orders from localStorage
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    displayOrders(orders);
}

// Initialize Add Order Form
function initAddOrderForm() {
    const form = document.getElementById('addOrderForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newOrder = {
            id: generateOrderId(),
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            productType: document.getElementById('productType').value,
            productName: document.getElementById('productName').value,
            quantity: parseInt(document.getElementById('quantity').value),
            totalPrice: parseFloat(document.getElementById('totalPrice').value),
            status: document.getElementById('orderStatus').value,
            date: new Date().toISOString().split('T')[0]
        };
        
        let orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
        orders.push(newOrder);
        localStorage.setItem('cakeOrders', JSON.stringify(orders));
        
        // Clear form
        form.reset();
        
        // Show success message
        showNotification('Order added successfully!', 'success');
        
        // Reload orders
        loadOrders();
        updateStatistics();
    });
}

// Display orders in table
function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    const noOrdersMsg = document.getElementById('noOrders');
    
    if (!tableBody) return;
    
    if (orders.length === 0) {
        tableBody.innerHTML = '';
        noOrdersMsg.style.display = 'block';
        return;
    }
    
    noOrdersMsg.style.display = 'none';
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.customerEmail}</td>
            <td>${order.productName}</td>
            <td>${capitalize(order.productType)}</td>
            <td>${order.quantity}</td>
            <td>$${order.totalPrice.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editOrder('${order.id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteOrder('${order.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Initialize Search and Filter
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterStatus');
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
    clearBtn.addEventListener('click', clearFilters);
}

// Apply search and filter
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    
    let orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    
    const filtered = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm) || 
                             order.customerEmail.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === '' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayOrders(filtered);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterStatus').value = '';
    loadOrders();
}

// Initialize Edit Modal
function initEditModal() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('editOrderForm');
    
    if (!modal) return;
    
    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    });
    
    editForm.addEventListener('submit', saveOrderChanges);
}

// Edit order
function editOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Populate form
    document.getElementById('editOrderId').value = order.id;
    document.getElementById('editCustomerName').value = order.customerName;
    document.getElementById('editCustomerEmail').value = order.customerEmail;
    document.getElementById('editCustomerPhone').value = order.customerPhone;
    document.getElementById('editProductType').value = order.productType;
    document.getElementById('editProductName').value = order.productName;
    document.getElementById('editQuantity').value = order.quantity;
    document.getElementById('editTotalPrice').value = order.totalPrice;
    document.getElementById('editOrderStatus').value = order.status;
    
    // Open modal
    document.getElementById('editModal').classList.remove('hidden');
}

// Save order changes
function saveOrderChanges(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('editOrderId').value;
    const orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return;
    
    orders[orderIndex] = {
        ...orders[orderIndex],
        customerName: document.getElementById('editCustomerName').value,
        customerEmail: document.getElementById('editCustomerEmail').value,
        customerPhone: document.getElementById('editCustomerPhone').value,
        productType: document.getElementById('editProductType').value,
        productName: document.getElementById('editProductName').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        totalPrice: parseFloat(document.getElementById('editTotalPrice').value),
        status: document.getElementById('editOrderStatus').value
    };
    
    localStorage.setItem('cakeOrders', JSON.stringify(orders));
    
    closeEditModal();
    showNotification('Order updated successfully!', 'success');
    loadOrders();
    updateStatistics();
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editOrderForm').reset();
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    let orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('cakeOrders', JSON.stringify(orders));
    
    showNotification('Order deleted successfully!', 'success');
    loadOrders();
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]');
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    const totalOrdersEl = document.getElementById('totalOrdersCount');
    const pendingOrdersEl = document.getElementById('pendingOrdersCount');
    const completedOrdersEl = document.getElementById('completedOrdersCount');
    const totalRevenueEl = document.getElementById('totalRevenue');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toFixed(2);
}

// Helper functions
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${type === 'success' ? '#00cc66' : '#0066ff'};
        color: black;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInLeft 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 200, 150, 0.3);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

