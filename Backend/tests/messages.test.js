const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Messages API Integration Tests', () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skincareproject.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y';
  let token;
  let createdMessageId;

  beforeAll(async () => {
    // Authenticate admin to get token for protected routes
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });
    token = res.body.token;
  });

  it('should allow customer to submit a new message (Public)', async () => {
    const messagePayload = {
      name: 'Customer Test',
      email: 'customer@example.com',
      phone: '+1234567890',
      subject: 'Consultation',
      message: 'Hello, is Vitamin C suitable for dry skin?',
    };

    const res = await request(app)
      .post('/api/messages')
      .send(messagePayload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message.name).toEqual('Customer Test');
    createdMessageId = res.body.message._id;
  });

  it('should deny fetching messages list without token', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toEqual(401);
  });

  it('should fetch messages list for authenticated admin', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should send a reply and trigger mock WhatsApp response', async () => {
    const res = await request(app)
      .post(`/api/messages/${createdMessageId}/reply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        replyText: 'Yes, Vitamin C is safe but use it with moisturizer.',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('Reply sent');
  });

  it('should delete the test message successfully', async () => {
    const res = await request(app)
      .delete(`/api/messages/${createdMessageId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deleted');
  });
});
