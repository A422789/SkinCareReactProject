const mongoose = require('mongoose');

// Global mock for Backend whatsapp helper
jest.mock('../utils/whatsapp', () => ({
  initWhatsApp: jest.fn().mockResolvedValue(true),
  sendWhatsAppMessage: jest.fn().mockResolvedValue(true),
  getQRCodeDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqr'),
  getStatus: jest.fn().mockReturnValue({ isReady: true, hasQR: false }),
}));

// Clean up DB connections and models after all tests in a suite finish
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
