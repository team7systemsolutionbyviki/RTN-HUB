// WhatsApp Ordering Logic

function encodeMessage(text) {
    return encodeURIComponent(text);
}

// Order Single Product
function sendProductWhatsAppOrder(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const price = product.offerPrice || product.price;

    let message = `Hello ${SHOP_CONFIG.name},\n\n`;
    message += `I am interested in this product:\n\n`;
    message += `Product: ${product.name}\n`;
    message += `Brand: ${product.brand}\n`;
    message += `Price: ${formatCurrency(price)}\n\n`;
    message += `Is this product available?`;

    const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsapp}?text=${encodeMessage(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Order Full Cart
function submitCartOrder(event) {
    event.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty", "error");
        return;
    }

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const area = document.getElementById('customer-area').value;
    const pincode = document.getElementById('customer-pincode').value;
    const notes = document.getElementById('customer-notes').value;

    if (!name || !phone || !address || !area || !pincode) {
        showToast("Please fill all required fields", "error");
        return;
    }

    let message = `Hello ${SHOP_CONFIG.name},\n\n`;
    message += `I would like to order:\n\n`;

    let totalItems = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalItems += item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `Qty: ${item.quantity}\n`;
        message += `Price: ${formatCurrency(item.price)}\n`;
        message += `Subtotal: ${formatCurrency(subtotal)}\n\n`;
    });

    const grandTotal = getCartTotal();

    message += `--------------------\n`;
    message += `Total Items: ${totalItems}\n`;
    message += `Total Amount: ${formatCurrency(grandTotal)}\n`;
    message += `--------------------\n\n`;

    message += `Customer Details:\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Delivery Address: ${address}, ${area}, ${pincode}\n`;
    if (notes) {
        message += `Notes: ${notes}\n`;
    }
    message += `\nPlease confirm my order.`;

    const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsapp}?text=${encodeMessage(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after opening WhatsApp
    setTimeout(() => {
        clearCart();
        closeCartModal();
        showToast("Order request sent via WhatsApp!");
    }, 1000);
}

// General Inquiry
function sendGeneralInquiry() {
    let message = `Hello, I would like to know more about your cosmetics products.`;
    const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsapp}?text=${encodeMessage(message)}`;
    window.open(whatsappUrl, '_blank');
}
