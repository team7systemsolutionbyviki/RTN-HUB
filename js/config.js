const defaultShopConfig = {
    name: "RTN LETZZ NATURE SKIN CARE",
    whatsapp: "919876543210",
    phone: "+91 98765 43210",
    address: "123 Beauty Avenue, Makeup District, Mumbai 400001",
    currency: "₹",
    email: "contact@glowandco.in",
    instagram: "glowandco_in",
    hours: "Mon - Sat: 10:00 AM - 8:00 PM",
    logo: "images/logo.jpg",
    banners: ["images/banner1.jpg"],
    mapIframe: ""
};

const SHOP_CONFIG = JSON.parse(localStorage.getItem('glow_shop_config')) || defaultShopConfig;
// Backward compatibility for old configs without banners
if (!SHOP_CONFIG.banners) SHOP_CONFIG.banners = ["images/banner1.jpg"];

