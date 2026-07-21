const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const logger = require('./logger');

let client = null;
let currentQR = null;
let isReady = false;

const sessionPath = '/app/whatsapp_session';

// Initialize WhatsApp client with local disk persistence
const initWhatsApp = async () => {
  try {
    // Remove stale Chromium lock files (symlinks) left by previous container
    // existsSync() follows symlinks and returns false for broken ones → use lstatSync instead
    const fs = require('fs');
    const lockFiles = [
      `${sessionPath}/session/SingletonLock`,
      `${sessionPath}/session/SingletonCookie`,
      `${sessionPath}/session/SingletonSocket`,
    ];
    for (const lockFile of lockFiles) {
      try {
        fs.lstatSync(lockFile); // throws if file/symlink doesn't exist
        fs.unlinkSync(lockFile);
        logger.info(`Removed stale lock file: ${lockFile}`);
      } catch (_) {
        // File doesn't exist, no action needed
      }
    }

    const puppeteerOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    };

    // Platform-specific browser path resolution
    if (process.platform === 'win32') {
      // Windows: use installed Chrome
      puppeteerOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else if (process.env.CHROMIUM_PATH) {
      // Docker / Linux: use path from environment variable
      puppeteerOptions.executablePath = process.env.CHROMIUM_PATH;
    } else {
      // Linux fallback: common Chromium locations
      const fs2 = require('fs');
      const linuxPaths = [
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome',
      ];
      const foundPath = linuxPaths.find(p => fs2.existsSync(p));
      if (foundPath) {
        puppeteerOptions.executablePath = foundPath;
      }
    }

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: sessionPath,
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

    client.on('disconnected', (reason) => {
      isReady = false;
      logger.warn(`WhatsApp client disconnected: ${reason}`);
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
