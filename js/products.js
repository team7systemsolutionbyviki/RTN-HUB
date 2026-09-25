// Default products array
// In a real application without backend, we can load from this array if localStorage is empty
const defaultProducts = [
    {
        id: 1,
        name: "Vitamin C Glow Serum",
        brand: "GlowRecipe",
        category: "Serum",
        price: 899,
        offerPrice: 699,
        stock: true,
        image: "images/products/serum.jpg",
        description: "Brightening vitamin C serum that boosts radiance and helps firm skin for a glowing complexion.",
        isNew: true,
        isBestSeller: true,
        rating: 4.8
    },
    {
        id: 2,
        name: "Hydrating Face Wash",
        brand: "DermaCo",
        category: "Face Wash",
        price: 349,
        offerPrice: 299,
        stock: true,
        image: "images/products/facewash.jpg",
        description: "Gentle daily cleanser that removes impurities without stripping the skin's natural moisture.",
        isNew: false,
        isBestSeller: true,
        rating: 4.6
    },
    {
        id: 3,
        name: "Matte Liquid Lipstick",
        brand: "ColorPop",
        category: "Makeup",
        price: 599,
        offerPrice: null,
        stock: true,
        image: "images/products/lipstick.jpg",
        description: "Long-lasting, smudge-proof matte liquid lipstick in shade 'Velvet Rose'.",
        isNew: true,
        isBestSeller: false,
        rating: 4.5
    },
    {
        id: 4,
        name: "Nourishing Hair Oil",
        brand: "NatureEssentials",
        category: "Hair Care",
        price: 499,
        offerPrice: 399,
        stock: false, // Out of stock example
        image: "images/products/hairoil.jpg",
        description: "Deep conditioning hair oil enriched with Argan and Almond for strong, shiny hair.",
        isNew: false,
        isBestSeller: false,
        rating: 4.2
    },
    {
        id: 5,
        name: "SPF 50 Sunscreen Gel",
        brand: "SunProtect",
        category: "Sunscreen",
        price: 649,
        offerPrice: 549,
        stock: true,
        image: "images/products/sunscreen.jpg",
        description: "Lightweight, non-greasy sunscreen with broad-spectrum SPF 50 PA+++ protection.",
        isNew: false,
        isBestSeller: true,
        rating: 4.9
    },
    {
        id: 6,
        name: "Rose Water Toner",
        brand: "PureGlow",
        category: "Skin Care",
        price: 299,
        offerPrice: 249,
        stock: true,
        image: "images/products/toner.jpg",
        description: "Refreshing rose water facial mist that hydrates and balances skin pH.",
        isNew: true,
        isBestSeller: false,
        rating: 4.4
    },
    {
        id: 7,
        name: "Intense Repair Shampoo",
        brand: "HairBiotics",
        category: "Shampoo",
        price: 799,
        offerPrice: 599,
        stock: true,
        image: "images/products/shampoo.jpg",
        description: "Sulfate-free shampoo that repairs damaged hair and prevents breakage.",
        isNew: false,
        isBestSeller: true,
        rating: 4.7
    },
    {
        id: 8,
        name: "Signature Perfume",
        brand: "Lumina",
        category: "Perfume",
        price: 1499,
        offerPrice: 1199,
        stock: true,
        image: "images/products/perfume.jpg",
        description: "An elegant floral fragrance with notes of jasmine, rose, and vanilla.",
        isNew: true,
        isBestSeller: false,
        rating: 4.8
    }
];

// Initialize products in local storage if not present
function initializeProducts() {
    let storedProducts = localStorage.getItem('glow_products');
    if (!storedProducts) {
        localStorage.setItem('glow_products', JSON.stringify(defaultProducts));
    }
}

// Get all products
function getProducts() {
    initializeProducts();
    return JSON.parse(localStorage.getItem('glow_products')) || [];
}

// Initialize on script load
initializeProducts();
