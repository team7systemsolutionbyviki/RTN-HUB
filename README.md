# Glow & Co. Cosmetics Shop

A complete, modern, mobile-friendly cosmetics shop website built with HTML5, CSS3, and Vanilla JavaScript.
Designed to be hosted directly on GitHub Pages without the need for a backend server.

## Features

- **No Backend Required:** Runs entirely in the browser using `localStorage` for data persistence.
- **WhatsApp Ordering System:** Customers can add items to their cart, fill out their details, and send a structured order directly to your shop's WhatsApp number.
- **Client-Side Search & Filtering:** Fast, instantaneous search and category filtering.
- **Admin Management Panel:** A hidden `admin.html` page that allows the store owner to add, edit, and delete products (changes are saved to the browser's local storage).
- **Responsive Design:** Mobile-first approach, works beautifully on iPhones, Androids, Tablets, and Desktops.
- **Shopping Cart & Wishlist:** Fully functional cart system with quantity adjustments.

## How to Configure Your Shop

All configuration settings are centralized in the `js/config.js` file.
Open `js/config.js` in a text editor to change:

1. **Shop Name:** `name: "YOUR COSMETICS SHOP"`
2. **WhatsApp Number:** `whatsapp: "91XXXXXXXXXX"` (Include country code, no `+` sign).
3. **Phone Number:** `phone: "+91 XXXXXXXXXX"` (For display purposes).
4. **Address:** `address: "123 Beauty Avenue..."`

## How to Manage Products

There are two ways to manage products:

**Method 1: Hardcoding (Recommended for initial setup and GitHub Pages)**
Open `js/products.js` and modify the `defaultProducts` array. This is the permanent data store that users will load the first time they visit the site.

**Method 2: Using the Admin Panel (For quick local edits)**
1. Open `admin.html` in your browser.
2. Add, Edit, or Delete products.
3. *Note: Changes made in the Admin Panel are saved via `localStorage` on that specific device. They do not automatically update the `js/products.js` file for other internet users.*

## How to Change Images

1. Place your new images inside the `images/` or `images/products/` folder.
2. Update the `image:` property in `js/products.js` to point to the new file name (e.g., `image: "images/products/my-new-cream.jpg"`).

## How to Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g., `my-cosmetics-shop`).
2. Upload all the files and folders from this directory to the repository.
3. Go to the repository **Settings** > **Pages**.
4. Under **Build and deployment**, set the **Source** to `Deploy from a branch`.
5. Select the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait a few minutes. Your site will be live at `https://[your-username].github.io/my-cosmetics-shop/`!

## SEO and Customization

- To update page titles, meta descriptions, and keywords, edit the `<head>` section of `index.html`, `shop.html`, and `product.html`.
- To change theme colors, open `css/style.css` and modify the `:root` variables at the top of the file.
