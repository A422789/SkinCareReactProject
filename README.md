# SkinCare E-Commerce Platform

A premium skincare e-commerce platform featuring an elegant, modern frontend store, an advanced admin control dashboard, and a robust Node.js backend.

## Project Structure
- `/Backend`: Node.js, Express, MongoDB REST API. Handles product collections, custom billing, WhatsApp messaging automation, and dashboard analytics.
- `/Frontend/WebPage`: Elegant client-facing showcase website using React and CSS styling.
- `/Frontend/Dashboard`: Admin management panel for orders, messages, inventory, store settings, and real-time alerts.

---

## Key Features

1. **WhatsApp Messaging & Automation**:
   - Automated notification dispatches to store owners upon new orders or messages.
   - Direct communication channels allowing administrators to message customers from the Dashboard via WhatsApp.
   - Purely localized session authentication stored at `/Backend/whatsapp_session`.

2. **Dynamic Live Analytics**:
   - Automatic recording of unique daily visits.
   - Real-time aggregation of total revenue, processed orders, and unique site visits.
   - Dynamic weekly revenue aggregation mapped directly from current database orders.

3. **Global Custom Store Configuration**:
   - Bilingual support for English and Arabic layout configurations.
   - Cloudinary integration for quick and seamless store image & logo uploads.
   - Customizable customer testimonials with direct screenshot upload support.

---

## Quick Start & Installation

### Prerequisite Setup
Configure your environment variables in `/Backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skincare
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@skincareproject.com
ADMIN_PASSWORD=your_secure_password
```

### 1. Launch Backend Server
```bash
cd Backend
npm install
# Seed the default catalog settings, payments, and sample products
node scripts/seedSettings.js
node scripts/seedOrders.js
node scripts/seedMessages.js

# Start express server
npm start
```

### 2. Launch Web Storefront
```bash
cd Frontend/WebPage
npm install
npm run dev
```

### 3. Launch Admin Dashboard
```bash
cd Frontend/Dashboard
npm install
npm run dev
```

---

## Running Unit Tests
All backend collections and integration suites are covered by local unit tests:
```bash
cd Backend
# Run specific test suites
node unit_tests/testPaymentType.js
node unit_tests/testOrder.js
node unit_tests/testSettings.js
node unit_tests/testMessages.js
node unit_tests/testAnalytics.js
```

---

## API Reference
For detailed schema payloads and endpoints configuration, refer to the [api_documentation.md](./api_documentation.md) file.
