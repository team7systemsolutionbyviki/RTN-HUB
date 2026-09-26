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

function updateShopUI() {
    document.querySelectorAll('.shop-name-text').forEach(el => el.textContent = SHOP_CONFIG.name);
    document.querySelectorAll('.shop-phone-text').forEach(el => el.textContent = SHOP_CONFIG.phone);
    document.querySelectorAll('.shop-address-text').forEach(el => el.textContent = SHOP_CONFIG.address);
    document.querySelectorAll('.shop-email-text').forEach(el => el.textContent = SHOP_CONFIG.email);
    
    // Update logo
    document.querySelectorAll('.logo img').forEach(img => img.src = SHOP_CONFIG.logo);
    document.querySelectorAll('footer img[alt="Logo"]').forEach(img => img.src = SHOP_CONFIG.logo);
    
    // Update document title dynamically
    if (document.title.includes('RTN LETZZ NATURE') && SHOP_CONFIG.name !== 'RTN LETZZ NATURE') {
        document.title = document.title.replace('RTN LETZZ NATURE', SHOP_CONFIG.name);
    } else if (!document.title.includes(SHOP_CONFIG.name)) {
        document.title = SHOP_CONFIG.name + ' | Premium Cosmetics';
    }
}

// Initialize app data
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
    if(typeof updateCartCount === 'function') updateCartCount();
    
    // Apply UI immediately from localStorage
    updateShopUI();
    
    // Attempt to pull latest config from Firebase
    if (window.firebaseGetDoc && window.firebaseDb) {
        const shopRef = window.firebaseDoc(window.firebaseDb, "shop", "info");
        window.firebaseGetDoc(shopRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const oldConfigStr = localStorage.getItem('glow_shop_config');
                let isDifferent = true;
                
                if (oldConfigStr) {
                    try {
                        const oldConfig = JSON.parse(oldConfigStr);
                        const standardize = obj => JSON.stringify(obj, Object.keys(obj).sort());
                        if (standardize(oldConfig) === standardize(data)) {
                            isDifferent = false;
                        }
                    } catch (e) {}
                }

                if (isDifferent) {
                    localStorage.setItem('glow_shop_config', JSON.stringify(data));
                    Object.assign(SHOP_CONFIG, data);
                    updateShopUI();
                }
            }
        }).catch(err => console.error("Firebase load error: ", err));
    }
    
    // Attempt to pull latest products from Firebase
    if (window.firebaseGetDocs && window.firebaseCollection && window.firebaseDb) {
        window.firebaseGetDocs(window.firebaseCollection(window.firebaseDb, "products")).then(snapshot => {
            if (!snapshot.empty) {
                let remoteProducts = [];
                snapshot.forEach(doc => {
                    remoteProducts.push(doc.data());
                });
                
                // Sort products numerically by ID
                remoteProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));

                const oldProductsStr = localStorage.getItem('glow_products');
                let isDifferent = true;
                
                if (oldProductsStr) {
                    try {
                        const oldProducts = JSON.parse(oldProductsStr);
                        // Simple deep check (ignoring key order) by standardizing JSON
                        const standardize = obj => JSON.stringify(obj, Object.keys(obj).sort());
                        if (oldProducts.length === remoteProducts.length) {
                            const oldHash = oldProducts.map(standardize).join('');
                            const newHash = remoteProducts.map(standardize).join('');
                            if (oldHash === newHash) isDifferent = false;
                        }
                    } catch (e) { console.error(e); }
                }

                if (isDifferent) {
                    localStorage.setItem('glow_products', JSON.stringify(remoteProducts));
                    const isAdminPage = window.location.pathname.includes('admin.html');
                    if (!isAdminPage) {
                        // Reload to apply new products if we are on shop or home page
                        window.location.reload();
                    } else if (typeof renderAdminProducts === 'function') {
                        renderAdminProducts();
                    }
                }
            }
        }).catch(err => console.error("Firebase products load error: ", err));
    }
    
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
