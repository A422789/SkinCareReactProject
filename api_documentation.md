# SkinCare Project API Documentation

Welcome to the official API Documentation for the SkinCare E-Commerce platform. All endpoints return JSON payloads and require standard HTTP headers unless specified otherwise.

---

## Base Configuration
- **Base URL (Local)**: `http://localhost:5000/api`
- **Content-Type**: `application/json` (except for endpoints handling image uploads which expect `multipart/form-data`)

---

## Table of Contents
1. [Authentication (`/auth`)](#1-authentication-auth)
2. [Products (`/products`)](#2-products-products)
3. [Categories (`/categories`)](#3-categories-categories)
4. [Payment Types (`/payment-types`)](#4-payment-types-payment-types)
5. [Orders (`/orders`)](#5-orders-orders)
6. [Settings & Testimonials (`/settings`)](#6-settings--testimonials-settings)
7. [Messages (`/messages`)](#7-messages-messages)
8. [Analytics & Overview (`/analytics`)](#8-analytics--overview-analytics)
9. [Notifications (`/notifications`)](#9-notifications-notifications)

---

## 1. Authentication (`/auth`)

### Login Administrator
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Body**:
```json
{
  "email": "admin@skincareproject.com",
  "password": "your_secure_password"
}
```
* **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Register New Administrator
* **Endpoint**: `POST /auth/register`
* **Access**: Private/Admin (Requires Bearer Token)
* **Request Body**:
```json
{
  "email": "new_admin@skincareproject.com",
  "password": "new_secure_password"
}
```
* **Success Response (210 Created)**:
```json
{
  "_id": "6a57e4901bdbdf0776175ec6",
  "email": "new_admin@skincareproject.com",
  "token": "eyJhbGciOiJI..."
}
```

### Fetch Authenticated Admin Profile
* **Endpoint**: `GET /auth/profile`
* **Access**: Private/Admin (Requires Bearer Token)
* **Success Response (200 OK)**:
```json
{
  "_id": "6a57e4901bdbdf0776175ec6",
  "email": "admin@skincareproject.com"
}
```

---

## 2. Products (`/products`)

### Fetch All Products
* **Endpoint**: `GET /products`
* **Access**: Public
* **Query Params (Optional)**: `?category=serums`
* **Success Response (200 OK)**:
```json
[
  {
    "_id": "6a57e4901bdbdf0776175ec6",
    "name": { "en": "Hydrating Serum", "ar": "سيروم الترطيب" },
    "price": 62,
    "stock": 80,
    "category": "serums"
  }
]
```

### Create Product
* **Endpoint**: `POST /products`
* **Access**: Private/Admin
* **Request Body**: (Multipart/Form-Data supporting file upload)
  * `name[en]`: String (required)
  * `price`: Number (required)
  * `stock`: Number (required)
  * `category`: String (required)
  * `image`: File (optional, uploads to Cloudinary)

---

## 3. Categories (`/categories`)

### Fetch All Categories
* **Endpoint**: `GET /categories`
* **Access**: Public
* **Success Response (200 OK)**:
```json
[
  {
    "_id": "6a57e4901bdbdf0776175ec1",
    "name": "serums",
    "isActive": true
  }
]
```

---

## 4. Payment Types (`/payment-types`)

### Fetch Payment Methods
* **Endpoint**: `GET /payment-types`
* **Access**: Public
* **Success Response (200 OK)**:
```json
[
  {
    "_id": "6a57ef56b7227631be707196",
    "id": "cod",
    "name": "Cash on Delivery",
    "isActive": true
  }
]
```

---

## 5. Orders (`/orders`)

### Place E-Commerce Order (Checkout)
* **Endpoint**: `POST /orders`
* **Access**: Public
* **Request Body**:
```json
{
  "customer": {
    "name": "Sarah Johnson",
    "phone": "+1 (555) 111-2222",
    "city": "New York",
    "address": "123 Fifth Avenue",
    "notes": "Leave at front door"
  },
  "paymentType": "6a57ef56b7227631be707196",
  "orderItems": [
    {
      "product": "6a57e4901bdbdf0776175ec6",
      "quantity": 1,
      "price": 62
    }
  ],
  "totalPrice": 62
}
```

### Fetch Orders Feed
* **Endpoint**: `GET /orders`
* **Access**: Private/Admin
* **Success Response (200 OK)**:
```json
[
  {
    "_id": "6a594d8bd852bdb7194f270f",
    "orderId": "ORD-001",
    "status": "Pending",
    "totalPrice": 62,
    "customer": { "name": "Sarah Johnson", "phone": "+1 (555) 111-2222" }
  }
]
```

### Update Order Status
* **Endpoint**: `PUT /orders/:id`
* **Access**: Private/Admin
* **Request Body**:
```json
{
  "status": "Shipped"
}
```

### Delete Order
* **Endpoint**: `DELETE /orders/:id`
* **Access**: Private/Admin

---

## 6. Settings & Testimonials (`/settings`)

### Fetch Store Settings
* **Endpoint**: `GET /settings`
* **Access**: Private/Admin & Public
* **Success Response (200 OK)**:
```json
{
  "name": { "en": "SkinCare Elegance", "ar": "إناقة العناية بالبشرة" },
  "logoUrl": "/images/logo.png",
  "contact": { "email": "hello@skincareelegance.com" },
  "testimonials": []
}
```

### Update Store Settings
* **Endpoint**: `PUT /settings`
* **Access**: Private/Admin
* **Request Headers**: Expects `multipart/form-data`
* **Supported Files**: `logo`, `sec2Image`, `sec3Image`, `leftBottle`, `rightBottle` (all uploaded automatically to Cloudinary).

---

### Testimonials Sub-resource

#### Add Testimonial Review
* **Endpoint**: `POST /settings/testimonials`
* **Access**: Private/Admin
* **Request Headers**: Expects `multipart/form-data`
* **Fields**:
  * `type`: "text" | "screenshot"
  * `author`: String
  * `quote`: String
  * `rating`: Number (1-5)
  * `screenshot`: File (optional, screenshot image)

#### Delete Testimonial
* **Endpoint**: `DELETE /settings/testimonials/:id`
* **Access**: Private/Admin

---

## 7. Messages (`/messages`)

### Submit Contact Us Message
* **Endpoint**: `POST /messages`
* **Access**: Public
* **Request Body**:
```json
{
  "name": "Sarah Ahmed",
  "email": "sarah.ahmed@example.com",
  "phone": "+201225044423",
  "subject": "Inquiry about Rose Serum",
  "message": "Is the Rose Renewal Serum suitable for combination skin?"
}
```

### Toggle Read/Unread Status
* **Endpoint**: `PUT /messages/:id/read`
* **Access**: Private/Admin
* **Request Body**:
```json
{
  "read": true
}
```

### Reply to Message (Sends Direct WhatsApp to Customer)
* **Endpoint**: `POST /messages/:id/reply`
* **Access**: Private/Admin
* **Request Body**:
```json
{
  "replyText": "Hello Sarah, yes! It works beautifully on combination skin."
}
```

---

## 8. Analytics & Overview (`/analytics`)

### Register Webpage Visit
* **Endpoint**: `POST /analytics/visit`
* **Access**: Public (Called automatically upon client webpage load)
* **Success Response (200 OK)**:
```json
{
  "success": true
}
```

### Fetch Dashboard Analytics Overview
* **Endpoint**: `GET /analytics/overview`
* **Access**: Private/Admin
* **Success Response (200 OK)**:
```json
{
  "totalRevenue": 235,
  "totalOrders": 3,
  "totalVisits": 45,
  "salesData": [
    { "name": "Mon", "sales": 120 },
    { "name": "Tue", "sales": 0 }
  ]
}
```

---

## 9. Notifications (`/notifications`)

### Fetch Alerts Feed (Unread messages & pending orders)
* **Endpoint**: `GET /notifications`
* **Access**: Private/Admin
* **Success Response (200 OK)**:
```json
{
  "unreadMessagesCount": 4,
  "pendingOrdersCount": 2,
  "totalNotificationCount": 6,
  "alerts": [
    {
      "id": "order-6a594d8bd852bdb7194f270f",
      "type": "order",
      "message": "New order #ORD-001 received from Sarah Johnson",
      "time": "2026-07-16T22:04:19Z"
    }
  ]
}
```
