const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth API Integration Tests', () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skincareproject.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y';

  it('should authenticate admin and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual(adminEmail);
  });

  it('should reject login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@admin.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should fetch admin profile when provided a valid token', async () => {
    // Login first to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    const token = loginRes.body.token;

    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body.email).toEqual(adminEmail);
  });
});
