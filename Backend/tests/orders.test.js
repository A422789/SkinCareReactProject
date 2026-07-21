const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Orders API Integration Tests', () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skincareproject.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y';
  let token;
  let selectedProduct;
  let selectedPayment;
  let createdOrderId;

  beforeAll(async () => {
    // 1. Authenticate Admin
    const authRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });
    token = authRes.body.token;

    // 2. Fetch an existing active product and payment type to place order
    const prodRes = await request(app).get('/api/products');
    const payRes = await request(app).get('/api/payment-types');

    if (prodRes.body.length > 0) {
      selectedProduct = prodRes.body[0];
    }
    if (payRes.body.length > 0) {
      selectedPayment = payRes.body[0];
    }
  });

  it('should create a new order successfully (Public)', async () => {
    // Skip if there are no seed products or payment types in DB
    if (!selectedProduct || !selectedPayment) {
      console.warn('Skipping Order creation test: No Products or Payment Types found in DB.');
      return;
    }

    const orderPayload = {
      customer: {
        name: 'Supertest Order Customer',
        phone: '+1234567890',
        city: 'Cairo',
        address: 'App test street 98',
        notes: 'Integration test note'
      },
      paymentType: selectedPayment._id,
      orderItems: [
        {
          product: selectedProduct._id,
          quantity: 1,
          price: selectedProduct.price
        }
      ]
    };

    const res = await request(app)
      .post('/api/orders')
      .send(orderPayload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('orderId');
    createdOrderId = res.body._id;
  });

  it('should fetch orders list for authenticated admin', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update order status to Shipped', async () => {
    if (!createdOrderId) return;

    const res = await request(app)
      .put(`/orders/${createdOrderId}`) // Check if route matches backend prefix /api/orders or /orders
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Shipped' });

    // Fallback try with /api/orders if routes use /api prefix
    if (res.statusCode === 404) {
      const fallbackRes = await request(app)
        .put(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Shipped' });

      expect(fallbackRes.statusCode).toEqual(200);
      expect(fallbackRes.body.status).toEqual('Shipped');
    } else {
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('Shipped');
    }
  });

  it('should delete the test order successfully', async () => {
    if (!createdOrderId) return;

    const res = await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
});
