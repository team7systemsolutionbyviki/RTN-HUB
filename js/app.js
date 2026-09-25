// Global Application Logic

// DOM Elements
const searchInputs = document.querySelectorAll('.search-input');
const cartCountElements = document.querySelectorAll('.cart-count');
const wishlistCountElements = document.querySelectorAll('.wishlist-count');
const toastContainer = document.getElementById('toast-container');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

// Format Currency
function formatCurrency(amount) {
    return SHOP_CONFIG.currency + amount.toLocaleString('en-IN');
}

// Mobile Menu Toggle
if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Toast Notifications
function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Wishlist Logic
function getWishlist() {
    return JSON.parse(localStorage.getItem('glow_wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('glow_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showToast('Added to wishlist');
    }
    
    saveWishlist(wishlist);
    
    // Update DOM buttons if they exist
    const btns = document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`);
    btns.forEach(btn => {
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (btn.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    });
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    wishlistCountElements.forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
}

// Render a single product card HTML
function createProductCard(product) {
    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(product.id);
    
    const priceHtml = product.offerPrice 
        ? `<span class="price-old">${formatCurrency(product.price)}</span>
           <span>${formatCurrency(product.offerPrice)}</span>`
        : `<span>${formatCurrency(product.price)}</span>`;
        
    let badges = '';
    if (!product.stock) badges += `<span class="product-badge badge-outstock">Out of Stock</span>`;
    else if (product.offerPrice) badges += `<span class="product-badge badge-offer">Sale</span>`;
    else if (product.isNew) badges += `<span class="product-badge badge-new">New</span>`;

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-badges">${badges}</div>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" onclick="toggleWishlist(${product.id})">
                <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <a href="product.html?id=${product.id}" class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </a>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-rating">
                    <i class="fas fa-star"></i> ${product.rating}
                </div>
                <div class="product-price">${priceHtml}</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})" ${!product.stock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-whatsapp-order" onclick="sendProductWhatsAppOrder(${product.id})" ${!product.stock ? 'disabled' : ''}>
                        <i class="fab fa-whatsapp"></i> Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Search functionality
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    }
}

searchInputs.forEach(input => {
    input.addEventListener('keypress', handleSearch);
});

// Initialize app data
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
    if(typeof updateCartCount === 'function') updateCartCount();
    
    // Update shop config texts if elements exist
    document.querySelectorAll('.shop-name-text').forEach(el => el.textContent = SHOP_CONFIG.name);
    document.querySelectorAll('.shop-phone-text').forEach(el => el.textContent = SHOP_CONFIG.phone);
    document.querySelectorAll('.shop-address-text').forEach(el => el.textContent = SHOP_CONFIG.address);
    document.querySelectorAll('.shop-email-text').forEach(el => el.textContent = SHOP_CONFIG.email);
    
    // Update logo
    document.querySelectorAll('.logo img').forEach(img => img.src = SHOP_CONFIG.logo);
    document.querySelectorAll('footer img[alt="Logo"]').forEach(img => img.src = SHOP_CONFIG.logo);
    
    // Init Banner Slider
    const heroSlides = document.getElementById('hero-slides');
    if (heroSlides && SHOP_CONFIG.banners) {
        SHOP_CONFIG.banners.forEach(bannerSrc => {
            const slide = document.createElement('div');
            slide.style.minWidth = '100%';
            slide.style.height = '100%';
            slide.style.backgroundImage = `url('${bannerSrc}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            heroSlides.appendChild(slide);
        });
        
        let currentSlide = 0;
        const totalSlides = SHOP_CONFIG.banners.length;
        
        window.nextSlide = function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            heroSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        };
        
        window.prevSlide = function() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            heroSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        };
        
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        if (prevBtn) prevBtn.addEventListener('click', window.prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', window.nextSlide);
        
        if (totalSlides <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            setInterval(window.nextSlide, 5000); // Auto-advance every 5s
        }
    }
    
    // Check for file protocol and show warning
    if (window.location.protocol === 'file:') {
        console.warn("You are opening files directly via the file:// protocol. LocalStorage may not be shared between files in some browsers (like Chrome).");
        if (document.getElementById('toast-container') && !sessionStorage.getItem('file_warning_shown')) {
            showToast("Warning: Admin changes might not reflect on other pages when opened directly from folder. Please use a local server like VS Code Live Server.", "error");
            sessionStorage.setItem('file_warning_shown', 'true');
        }
    }
});
