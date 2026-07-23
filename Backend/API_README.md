# HE Skincare E-Commerce Platform — API Reference Manual

This is the reference documentation for the HE Skincare REST API. All endpoints process JSON bodies and expect standard content negotiation headers unless specified otherwise (e.g. image uploads which require `multipart/form-data`).

---

## ⚙️ Base Configuration
- **Base API Path**: `http://localhost:5000/api`
- **Response Format**: `application/json`
- **Request Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (for protected endpoints)

---

## 🔒 Authentication Routes (`/auth`)

### 1. Login User
Authenticates admin credentials, sets up a secure session cookie, and issues a stateless JWT.
- **Route:** `POST /auth/login`
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "email": "admin@skincare.com",
    "password": "your_secure_password"
  }
  ```
- **Responses:**
  - **`200 OK`**:
    ```json
    {
      "_id": "603dcf9e1081a94248a31a12",
      "email": "admin@skincare.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **`400 Bad Request`**: Missing parameters.
  - **`401 Unauthorized`**: Invalid email or password.

---

### 2. Register User
Registers a new administrator (secured internally).
- **Route:** `POST /auth/register`
- **Access:** Public
- **Payload:**
  ```json
  {
    "email": "new_admin@skincare.com",
    "password": "secure_password"
  }
  ```
- **Responses:**
  - **`201 Created`**:
    ```json
    {
      "_id": "603dcf9e1081a94248a31a13",
      "email": "new_admin@skincare.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

### 3. Session Refresh
Revokes the current JWT, extends session lifespan, and issues a new signed token.
- **Route:** `POST /auth/refresh`
- **Access:** Private (Admin JWT required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Responses:**
  - **`200 OK`**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newtoken..."
    }
    ```

---

### 4. Logout User
Clears the session cookie, destroys the server session, and blacklists the token in MongoDB.
- **Route:** `POST /auth/logout`
- **Access:** Public
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Responses:**
  - **`200 OK`**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

### 5. Fetch Admin Profile
Returns details of the authenticated administrator.
- **Route:** `GET /auth/profile`
- **Access:** Private (Admin JWT required)
- **Responses:**
  - **`200 OK`**:
    ```json
    {
      "_id": "603dcf9e1081a94248a31a12",
      "email": "admin@skincare.com"
    }
    ```

---

## 🧴 Product Catalog Routes (`/products`)

### 1. Fetch All Products
- **Route:** `GET /products`
- **Access:** Public
- **Query Params:** `?category=<category_id>` (optional filter)
- **Responses:**
  - **`200 OK`**:
    ```json
    [
      {
        "_id": "603dcf9e1081a94248a31a15",
        "name": { "en": "Hydrating Serum", "ar": "سيروم الترطيب" },
        "tagline": { "en": "Restore skin bounce", "ar": "يعيد مرونة البشرة" },
        "price": 450,
        "offerPrice": 380,
        "stock": 25,
        "isNewArrival": true,
        "category": "603dcf9e1081a94248a31a14"
      }
    ]
    ```

---

### 2. Create Product
- **Route:** `POST /products`
- **Access:** Private (Admin JWT required)
- **Format:** `multipart/form-data`
- **Payload:**
  - `name[en]` (String, Required)
  - `name[ar]` (String, Required)
  - `price` (Number, Required)
  - `stock` (Number, Required)
  - `category` (ObjectId, Required)
  - `image` (File, Optional)
- **Responses:**
  - **`201 Created`**: Returns the saved product object.

---

### 3. Update Product
- **Route:** `PUT /products/:id`
- **Access:** Private (Admin JWT required)
- **Format:** `multipart/form-data` or `application/json`
- **Responses:**
  - **`200 OK`**: Returns the modified product object.

---

### 4. Delete Product
- **Route:** `DELETE /products/:id`
- **Access:** Private (Admin JWT required)
- **Responses:**
  - **`200 OK`**: `{ "message": "Product removed successfully" }`

---

## 🗂️ Category Routes (`/categories`)

- **`GET /categories`**: Fetch all categories (Public).
- **`POST /categories`**: Add a new category (Private).
- **`PUT /categories/:id`**: Update category parameters (Private).
- **`DELETE /categories/:id`**: Remove category (Private).

---

## 💳 Payment Type Routes (`/payment-types`)

- **`GET /payment-types`**: Returns active checkout methods (Public).
- **`POST /payment-types`**: Create a payment method (Private).
- **`PUT /payment-types/:id`**: Update parameters or status (Private).
- **`DELETE /payment-types/:id`**: Delete payment method (Private).

---

## 📦 Order Checkout Routes (`/orders`)

- **`GET /orders`**: List all orders (Private).
- **`POST /orders`**: Checkout shopping bag. Sends automatic WhatsApp notification (Public).
- **`PUT /orders/:id/status`**: Update order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) (Private).

---

## ⚙️ Storefront Configurations (`/settings`)

- **`GET /settings`**: Fetch active settings, testimonials, and about text (Public).
- **`PUT /settings`**: Update store branding parameters (Private).
- **`POST /settings/testimonials`**: Add customer reviews with optional file screenshots (Private).

---

## 📧 Messages (`/messages`)

- **`GET /messages`**: Review contact submissions (Private).
- **`POST /messages`**: Submit contact form. Sends WhatsApp notification (Public).

---

## 📈 Analytics Dashboard (`/analytics`)

- **`GET /analytics/overview`**: Returns revenue calculations, total visits, and order progress (Private).
- **`POST /analytics/visit`**: Log a unique visit tracking IP (Public).
