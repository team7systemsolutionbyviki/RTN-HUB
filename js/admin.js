// Admin logic to manage products using localStorage
// This simulates a backend for GitHub Pages deployment.

if (typeof showToast === 'undefined') {
    window.showToast = function(message) {
        console.log(message);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    if (sessionStorage.getItem('glow_admin_auth') === 'true') {
        showAdminDashboard();
    } else {
        document.getElementById('login-container').style.display = 'block';
    }

    if (document.getElementById('admin-product-list')) {
        renderAdminProducts();
    }
    if (document.getElementById('admin-banner-list')) {
        renderAdminBanners();
    }
    if (document.getElementById('config-form')) {
        populateConfigForm();
    }
});

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    
    const isUser1 = (user === 'VIKI' && pass === '1101VIKI');
    const isUser2 = (user === 'RTN' && pass === 'RTN1101');
    
    if (isUser1 || isUser2) {
        sessionStorage.setItem('glow_admin_auth', 'true');
        showAdminDashboard();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function handleLogout() {
    sessionStorage.removeItem('glow_admin_auth');
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').style.display = 'none';
    if (typeof showToast !== 'undefined') showToast('Logged out successfully');
}

function showAdminDashboard() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'inline-block';
}

function populateConfigForm() {
    document.getElementById('c-name').value = SHOP_CONFIG.name;
    document.getElementById('c-logo').value = SHOP_CONFIG.logo;
    document.getElementById('c-whatsapp').value = SHOP_CONFIG.whatsapp;
    document.getElementById('c-phone').value = SHOP_CONFIG.phone;
    document.getElementById('c-email').value = SHOP_CONFIG.email;
    document.getElementById('c-currency').value = SHOP_CONFIG.currency;
    document.getElementById('c-address').value = SHOP_CONFIG.address;
    if (document.getElementById('c-map')) document.getElementById('c-map').value = SHOP_CONFIG.mapIframe || "";
}

function handleSaveConfig(event) {
    event.preventDefault();
    const config = {
        name: document.getElementById('c-name').value,
        logo: document.getElementById('c-logo').value,
        whatsapp: document.getElementById('c-whatsapp').value,
        phone: document.getElementById('c-phone').value,
        email: document.getElementById('c-email').value,
        currency: document.getElementById('c-currency').value,
        address: document.getElementById('c-address').value,
        mapIframe: document.getElementById('c-map') ? document.getElementById('c-map').value : "",
        instagram: SHOP_CONFIG.instagram,
        hours: SHOP_CONFIG.hours,
        banners: SHOP_CONFIG.banners
    };
    try {
        localStorage.setItem('glow_shop_config', JSON.stringify(config));
        
        Object.assign(SHOP_CONFIG, config);
        
        // --- Push to Firebase ---
        if (window.firebaseSetDoc && window.firebaseDb) {
            const shopRef = window.firebaseDoc(window.firebaseDb, "shop", "info");
            window.firebaseSetDoc(shopRef, config, { merge: true })
                .then(() => console.log("Firebase: Shop info updated!"))
                .catch(err => console.error("Firebase error: ", err));
        }
        
        if (typeof showToast !== 'undefined') {
            showToast('Shop Settings Saved! Reloading...');
        } else {
            alert('Shop Settings Saved! Reloading...');
        }
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (e) {
        console.error(e);
        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
            alert('Error: The logo image you uploaded is too large! Please upload a smaller image (under 1MB) or use an image URL instead.');
        } else {
            alert('An error occurred while saving settings: ' + e.message);
        }
    }
}

function resetConfigToDefault() {
    if(confirm('This will restore all default shop settings. Continue?')) {
        localStorage.removeItem('glow_shop_config');
        if (typeof showToast !== 'undefined') {
            showToast('Settings reset to default. Reloading...');
        } else {
            alert('Settings reset to default. Reloading...');
        }
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

function getImageStatsText(img, file) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const width = img.width;
    const height = img.height;
    const megapixels = ((width * height) / 1000000).toFixed(1);
    
    // Determine orientation
    let orientation = "Square";
    if (width > height) {
        orientation = "Landscape";
    } else if (height > width) {
        orientation = "Portrait";
    }
    
    // Calculate physical dimensions assuming standard 96 DPI screen/web resolution
    const widthInches = (width / 96).toFixed(1);
    const heightInches = (height / 96).toFixed(1);
    const widthCm = (widthInches * 2.54).toFixed(1);
    const heightCm = (heightInches * 2.54).toFixed(1);
    
    return `Orientation: ${orientation} | Original: ${width}x${height}px (${megapixels} MP) | Print Size (~96dpi): ${widthInches}"x${heightInches}" (${widthCm}x${heightCm} cm) | Size: ${fileSizeMB} MB`;
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Update stats UI
                const statsEl = document.getElementById('c-logo-stats');
                if (statsEl) statsEl.textContent = getImageStatsText(img, file);

                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Max width/height for logo
                const MAX_SIZE = 300;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress heavily for localStorage
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                document.getElementById('c-logo').value = dataUrl;
                if (typeof showToast !== 'undefined') showToast('Logo compressed and ready to save.');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function renderAdminBanners() {
    const container = document.getElementById('admin-banner-list');
    const banners = SHOP_CONFIG.banners || [];
    
    if (banners.length === 0) {
        container.innerHTML = '<p>No banners found.</p>';
        return;
    }

    let html = `
        <table style="width:100%; border-collapse: collapse; margin-top:20px;">
            <tr style="background:#f4f4f4; border-bottom:2px solid #ccc;">
                <th style="padding:10px; text-align:left;">Preview</th>
                <th style="padding:10px; text-align:left;">URL/Path</th>
                <th style="padding:10px; text-align:left;">Actions</th>
            </tr>
    `;

    banners.forEach((src, index) => {
        html += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;"><img src="${src}" width="150" style="border-radius:4px; max-height: 80px; object-fit: cover;"></td>
                <td style="padding:10px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${src}</td>
                <td style="padding:10px;">
                    <button onclick="deleteBanner(${index})" style="padding:5px 10px; background:red; color:white; border-radius:4px;">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</table>';
    container.innerHTML = html;
    
    // Disable add button if >= 3
    const addBtn = document.getElementById('add-banner-btn');
    if (addBtn) {
        addBtn.disabled = banners.length >= 3;
        addBtn.textContent = banners.length >= 3 ? 'Max 3 Banners Reached' : 'Add Banner';
    }
}

function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Update stats UI
                const statsEl = document.getElementById('c-banner-stats');
                if (statsEl) statsEl.textContent = getImageStatsText(img, file);

                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Max width/height for banner (compress heavily)
                const MAX_WIDTH = 1024;
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                document.getElementById('c-banner-url').value = dataUrl;
                if (typeof showToast !== 'undefined') showToast('Banner compressed and ready to add.');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleAddBanner(event) {
    event.preventDefault();
    const urlInput = document.getElementById('c-banner-url');
    if (!urlInput.value) return;
    
    if (!SHOP_CONFIG.banners) SHOP_CONFIG.banners = [];
    if (SHOP_CONFIG.banners.length >= 3) {
        alert('Maximum 3 banners allowed.');
        return;
    }
    
    SHOP_CONFIG.banners.push(urlInput.value);
    
    try {
        localStorage.setItem('glow_shop_config', JSON.stringify(SHOP_CONFIG));
        
        // --- Push to Firebase ---
        if (window.firebaseSetDoc && window.firebaseDb) {
            const shopRef = window.firebaseDoc(window.firebaseDb, "shop", "info");
            window.firebaseSetDoc(shopRef, SHOP_CONFIG, { merge: true })
                .catch(err => console.error("Firebase error: ", err));
        }

        urlInput.value = '';
        document.getElementById('c-banner-upload').value = '';
        renderAdminBanners();
        if (typeof showToast !== 'undefined') showToast('Banner added successfully!');
    } catch (e) {
        console.error(e);
        SHOP_CONFIG.banners.pop(); // Revert
        alert('Error saving banner. The image might be too large. Try a smaller one.');
    }
}

function deleteBanner(index) {
    if(confirm('Are you sure you want to delete this banner?')) {
        SHOP_CONFIG.banners.splice(index, 1);
        localStorage.setItem('glow_shop_config', JSON.stringify(SHOP_CONFIG));
        
        // --- Push to Firebase ---
        if (window.firebaseSetDoc && window.firebaseDb) {
            const shopRef = window.firebaseDoc(window.firebaseDb, "shop", "info");
            window.firebaseSetDoc(shopRef, SHOP_CONFIG, { merge: true })
                .catch(err => console.error("Firebase error: ", err));
        }
        
        renderAdminBanners();
        if (typeof showToast !== 'undefined') showToast('Banner deleted');
    }
}

function renderAdminProducts() {
    const container = document.getElementById('admin-product-list');
    const products = getProducts();
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }

    let html = `
        <table style="width:100%; border-collapse: collapse; margin-top:20px;">
            <tr style="background:#f4f4f4; border-bottom:2px solid #ccc;">
                <th style="padding:10px; text-align:left;">ID</th>
                <th style="padding:10px; text-align:left;">Image</th>
                <th style="padding:10px; text-align:left;">Name</th>
                <th style="padding:10px; text-align:left;">Price</th>
                <th style="padding:10px; text-align:left;">Offer</th>
                <th style="padding:10px; text-align:left;">Stock</th>
                <th style="padding:10px; text-align:left;">Actions</th>
            </tr>
    `;

    products.forEach(p => {
        html += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${p.id}</td>
                <td style="padding:10px;"><img src="${p.image}" width="50" style="border-radius:4px;"></td>
                <td style="padding:10px;">${p.name} <br><small>${p.category}</small></td>
                <td style="padding:10px;">${p.price}</td>
                <td style="padding:10px;">${p.offerPrice || '-'}</td>
                <td style="padding:10px;">
                    <span style="color: ${p.stock ? 'green' : 'red'};">${p.stock ? 'In Stock' : 'Out of Stock'}</span>
                </td>
                <td style="padding:10px;">
                    <button onclick="editProduct(${p.id})" style="padding:5px 10px; background:var(--primary-color); color:white; border-radius:4px;">Edit</button>
                    <button onclick="deleteProduct(${p.id})" style="padding:5px 10px; background:red; color:white; border-radius:4px;">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</table>';
    container.innerHTML = html;
}

function deleteProduct(id) {
    if(confirm('Are you sure you want to delete this product?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('glow_products', JSON.stringify(products));

        // --- Remove from Firebase ---
        if (window.firebaseDeleteDoc && window.firebaseDb) {
            const productRef = window.firebaseDoc(window.firebaseDb, "products", id.toString());
            window.firebaseDeleteDoc(productRef)
                .then(() => console.log("Firebase: Product " + id + " deleted!"))
                .catch(err => console.error("Firebase error: ", err));
        }

        renderAdminProducts();
        showToast('Product deleted');
    }
}

function handleAddProduct(event) {
    event.preventDefault();
    
    let products = getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const product = {
        id: document.getElementById('edit-id').value ? parseInt(document.getElementById('edit-id').value) : newId,
        name: document.getElementById('p-name').value,
        brand: document.getElementById('p-brand').value,
        category: document.getElementById('p-category').value,
        price: parseFloat(document.getElementById('p-price').value),
        offerPrice: document.getElementById('p-offer').value ? parseFloat(document.getElementById('p-offer').value) : null,
        stock: document.getElementById('p-stock').checked,
        image: document.getElementById('p-image').value || 'images/products/serum.jpg',
        description: document.getElementById('p-desc').value,
        isNew: document.getElementById('p-new').checked,
        isBestSeller: document.getElementById('p-best').checked,
        rating: 5.0
    };

    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
        products[existingIndex] = product;
        if (typeof showToast !== 'undefined') showToast('Product updated');
    } else {
        products.push(product);
        if (typeof showToast !== 'undefined') showToast('Product added');
    }

    try {
        localStorage.setItem('glow_products', JSON.stringify(products));

        // --- Push to Firebase ---
        if (window.firebaseSetDoc && window.firebaseDb) {
            const productRef = window.firebaseDoc(window.firebaseDb, "products", product.id.toString());
            window.firebaseSetDoc(productRef, product, { merge: true })
                .then(() => console.log("Firebase: Product " + product.id + " saved!"))
                .catch(err => console.error("Firebase error: ", err));
        }

        document.getElementById('admin-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('p-image-stats').textContent = '';
        renderAdminProducts();
    } catch (e) {
        console.error(e);
        alert('Error saving product! The image might be too large. Try uploading a smaller image.');
    }
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const width = img.width;
                const height = img.height;
                
                // Display stats to user
                const statsEl = document.getElementById('p-image-stats');
                if (statsEl) {
                    statsEl.textContent = getImageStatsText(img, file) + " (Image will be compressed)";
                }
                
                // Compress for localStorage
                const canvas = document.createElement('canvas');
                let targetWidth = width;
                let targetHeight = height;
                
                // Max 800px for products to save quota
                const MAX_SIZE = 800;
                if (targetWidth > targetHeight) {
                    if (targetWidth > MAX_SIZE) {
                        targetHeight *= MAX_SIZE / targetWidth;
                        targetWidth = MAX_SIZE;
                    }
                } else {
                    if (targetHeight > MAX_SIZE) {
                        targetWidth *= MAX_SIZE / targetHeight;
                        targetHeight = MAX_SIZE;
                    }
                }
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                document.getElementById('p-image').value = dataUrl;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function editProduct(id) {
    const products = getProducts();
    const p = products.find(prod => prod.id === id);
    if(!p) return;

    document.getElementById('edit-id').value = p.id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-brand').value = p.brand;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-offer').value = p.offerPrice || '';
    document.getElementById('p-stock').checked = p.stock;
    document.getElementById('p-image').value = p.image;
    document.getElementById('p-desc').value = p.description;
    document.getElementById('p-new').checked = p.isNew;
    document.getElementById('p-best').checked = p.isBestSeller;
    
    document.getElementById('admin-form').scrollIntoView({behavior: 'smooth'});
}

function resetProductsToDefault() {
    if(confirm('This will wipe all custom changes and restore the default 8 products. Continue?')) {
        localStorage.removeItem('glow_products');
        initializeProducts();
        renderAdminProducts();
        showToast('Products reset to default');
    }
}
