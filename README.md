# GameShop – E-Commerce Platform

Welcome to **GameShop**, a modern and robust e-commerce web application designed for digital gaming products and gift cards. This project demonstrates a full-stack implementation of a real-world online store, featuring user authentication, product management, a shopping cart, and an admin dashboard.

---

## 🚩 Project Overview

GameShop is a web-based e-commerce platform where users can browse, search, and purchase digital games and gift cards. The application is built with a focus on security, usability, and scalability, providing both end-users and administrators with a seamless experience.

---

## ✨ Key Features

- **User Authentication:** Secure registration, login, password reset, and session management.
- **Product Catalog:** Dynamic listing of games and gift cards, loaded from a MySQL database.
- **Advanced Search & Filtering:** Search by keyword, filter by category, platform, and price range.
- **Product Details:** Dedicated page for each item with detailed description, price, and add-to-cart option.
- **Shopping Cart:** Add, update, or remove items; view cart contents and total price in real time.
- **Order Management:** Users can place orders; admins can view and manage all orders.
- **Admin Dashboard:** Admins can add, edit, or delete products and manage users securely.
- **Role-Based Access:** Strict separation between user and admin functionalities.
- **Responsive UI:** Modern, mobile-friendly interface with instant feedback and smooth navigation.
- **Newsletter & Contact:** Users can subscribe to updates and contact support directly from the site.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla, AJAX)
- **Backend:** PHP (OOP & procedural), RESTful endpoints
- **Database:** MySQL
- **Session & Cookie Management:** Secure handling of user sessions and cookies
- **Other:** Responsive design, accessibility best practices

---

## 🗄️ Database Schema

The platform uses a MySQL database with the following main tables:

- `users`: Stores user credentials, roles (`user`, `admin`), and password reset tokens.
- `items`: Contains product details (games, gift cards), categories, prices, and descriptions.
- `cart`: Tracks items added to user carts and order status.

Refer to [`database.sql`](database.sql) for the full schema and sample data.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   ```
2. **Set up the database:**
   - Import `database.sql` into your MySQL server.
   - Update database credentials in `php/db.php` if needed.
3. **Run the application:**
   - Place the project in your web server directory (e.g., `htdocs` for XAMPP).
   - Access `index.php` via your browser.

---

## 🔒 Security & Roles

- All sensitive actions (admin, user management, product editing) are protected by authentication and role checks.
- Passwords are securely hashed.
- Admin access is strictly enforced.

---

## 📦 Project Structure

- `index.php` – Main entry point, handles routing and AJAX for the shop
- `php/` – Backend logic (authentication, database, business logic)
- `templates/` – HTML templates for dashboard, admin, users, etc.
- `assets/` – CSS and JavaScript files
- `database.sql` – Database schema and sample data
- `tools/` – Utilities for database setup and maintenance



