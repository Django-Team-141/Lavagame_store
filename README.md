# 🎮 LavaGame

LavaGame is a full-stack online gaming and computer accessories store built with Django and React/Vite.

The project includes a Django REST API backend and a modern frontend for browsing products, managing a shopping cart, user authentication, orders, payments, and customer support.

---

## ✨ Features

- 🛍️ Product catalog
- 📂 Product categories
- 🔎 Product browsing
- 🛒 Shopping cart
- ➕ Increase/decrease product quantity
- 🗑️ Remove products from cart
- 👤 User registration and login
- 📦 Order management
- 💳 Payment system
- 💬 Customer chat
- 🖼️ Product images
- 🌐 REST API
- 📱 Responsive frontend
- 🌙 Modern gaming-style UI

---

## 🏗️ Project Structure

```text
LavaGame/
│
├── back/
│   ├── accounts/
│   ├── cart/
│   ├── chats/
│   ├── orders/
│   ├── payments/
│   ├── products/
│   ├── LavaGame/
│   ├── media/
│   ├── manage.py
│   └── requierments.txt
│
├── shop-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
⚙️ Technologies
Backend
Python
Django
Django REST Framework
SQLite
REST API
Frontend
React
Vite
JavaScript
CSS
🚀 Installation
1. Clone the repository
git clone https://github.com/Django-Team-141/Lavagame_store.git
cd Lavagame_store
🔧 Backend Setup

Open a terminal inside the project directory:

cd back

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

.\venv\Scripts\Activate.ps1

If PowerShell blocks script execution, you can use Command Prompt:

venv\Scripts\activate.bat

Install the required packages:

pip install -r requierments.txt

Run database migrations:

python manage.py migrate

Create an admin user:

python manage.py createsuperuser

Start the Django server:

python manage.py runserver

The backend will be available at:

http://127.0.0.1:8000/

Django Admin:

http://127.0.0.1:8000/admin/
🎨 Frontend Setup

Open another terminal:

cd shop-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173/
🔌 API Endpoints

The backend provides the following main API routes:

/api/products/
/api/accounts/
/api/cart/
/api/orders/
/api/payments/
/api/chats/
📦 Product Management

Products are managed through the Django backend.

Product images are stored inside:

back/media/

The project supports product categories and product images.

👤 Authentication

Users can:

Register an account
Log in
Access their account
Manage their shopping cart
Create orders

Authentication is handled by the Django backend.

🛒 Shopping Cart

The shopping cart supports:

Adding products
Increasing quantity
Decreasing quantity
Removing products
Calculating the cart contents
💳 Orders & Payments

The backend contains separate Django applications for:

orders/
payments/

These applications handle order and payment related functionality.

💬 Customer Support

LavaGame includes a chat system through the:

chats/

Django application.

🔐 Environment Variables

Sensitive environment variables should not be committed to GitHub.

Examples:

.env
.env.local

These files are excluded using .gitignore.

For local development, create the required environment files based on the project's configuration.

⚠️ Important

Do not upload sensitive information such as:

API keys
Secret keys
Passwords
Access tokens
Production credentials
Private environment variables
🧪 Development

Backend:

cd back
python manage.py runserver

Frontend:

cd shop-frontend
npm run dev

Both servers should be running during local development.

📁 Main Applications
Application	Description
accounts	User authentication and accounts
products	Product catalog and categories
cart	Shopping cart
orders	Customer orders
payments	Payment functionality
chats	Customer support/chat

🎮 LavaGame

LavaGame is designed as a modern gaming-oriented online store with a dedicated backend API and interactive frontend.

📜 License

This project is currently intended for development and educational purposes.
