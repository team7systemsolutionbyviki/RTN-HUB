// Shopping Cart Logic

function getCart() {
    return JSON.parse(localStorage.getItem('glow_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('glow_cart', JSON.stringify(cart));
    updateCartCount();
    if(typeof renderCart === 'function') renderCart();
}

function addToCart(productId, quantity = 1) {
    const products = getProducts();
    const product = products.find(p => p.id == productId);
    
    if (!product || !product.stock) {
        showToast('Product unavailable', 'error');
        return;
    }

    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id == productId);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.offerPrice || product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Item removed from cart');
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('glow_cart');
    updateCartCount();
    if(typeof renderCart === 'function') renderCart();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const elements = document.querySelectorAll('.cart-count');
    elements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Global modal handling for cart
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        renderCart();
        modal.classList.add('active');
    } else {
        // If modal doesn't exist on page, we might want to redirect or show it
        window.location.href = 'index.html#cart'; // fallback
    }
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('active');
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total-amount');
    
    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        document.getElementById('checkout-btn').style.display = 'none';
        document.getElementById('checkout-form').style.display = 'none';
        cartTotalElement.textContent = formatCurrency(0);
        return;
    }

    document.getElementById('checkout-btn').style.display = 'block';
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    <div class="quantity-control mt-2" style="margin-top: 10px;">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotalElement.textContent = formatCurrency(getCartTotal());
}

function toggleCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}
