const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const redis = require('../config/redis');
const logger = require('./logger');

let client = null;
let currentQR = null;
let isReady = false;

const sessionPath = path.join(__dirname, '../whatsapp_session');

// Initialize WhatsApp client with local persistence
const initWhatsApp = async () => {
  try {
    const puppeteerOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    };

    if (process.platform === 'win32') {
      puppeteerOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: sessionPath
      }),
      puppeteer: puppeteerOptions,
    });

    client.on('qr', async (qr) => {
      currentQR = qr;
      isReady = false;
      logger.info('WhatsApp QR code received. Scan via /api/whatsapp/qr');
    });

    client.on('ready', async () => {
      currentQR = null;
      isReady = true;
      logger.info('WhatsApp client is ready!');
    });

    client.on('auth_failure', (msg) => {
      isReady = false;
      logger.error(`WhatsApp authentication failed: ${msg}`);
    });

    client.on('disconnected', async (reason) => {
      isReady = false;
      logger.warn(`WhatsApp client disconnected: ${reason}`);
      try {
        await redis.del(REDIS_KEY);
        fs.rmSync(sessionPath, { recursive: true, force: true });
        logger.info('Cleared local and Redis WhatsApp session data.');
      } catch (err) {
        logger.error(`Error clearing session data: ${err.message}`);
      }
    });

    await client.initialize();
  } catch (error) {
    logger.error(`WhatsApp init error: ${error.message}`);
  }
};

const sendWhatsAppMessage = async (phone, message) => {
  if (!client || !isReady) {
    logger.warn('WhatsApp client not ready. Message not sent.');
    return false;
  }
  try {
    const chatId = `${phone.replace(/[^0-9]/g, '')}@c.us`;
    await client.sendMessage(chatId, message);
    logger.info(`WhatsApp message sent to ${phone}`);
    return true;
  } catch (error) {
    logger.error(`WhatsApp send error: ${error.message}`);
    return false;
  }
};

const getQRCodeDataURL = async () => {
  if (!currentQR) return null;
  try {
    return await qrcode.toDataURL(currentQR);
  } catch (error) {
    logger.error(`QR generation error: ${error.message}`);
    return null;
  }
};

const getStatus = () => ({
  isReady,
  hasQR: !!currentQR,
});

module.exports = {
  initWhatsApp,
  sendWhatsAppMessage,
  getQRCodeDataURL,
  getStatus,
};
