const express = require('express');
const router = express.Router();
const { getQRCodeDataURL, getStatus } = require('../utils/whatsapp');

// @desc    Get WhatsApp status
// @route   GET /api/whatsapp/status
// @access  Public (can restrict to admin if needed)
router.get('/status', (req, res) => {
  const status = getStatus();
  res.json(status);
});

// @desc    Get QR Code as an HTML page (scan to connect WhatsApp)
// @route   GET /api/whatsapp/qr
// @access  Public (restrict to admin in production)
router.get('/qr', async (req, res) => {
  const status = getStatus();

  if (status.isReady) {
    return res.send(`
      <html>
        <body style="font-family:sans-serif;text-align:center;padding:40px;background:#0d1117;color:#00c853;">
          <h1>✅ WhatsApp is Connected!</h1>
          <p style="color:#aaa;">The WhatsApp client is already authenticated and ready.</p>
          <p style="color:#aaa;">No QR Code needed.</p>
        </body>
      </html>
    `);
  }

  const qrDataURL = await getQRCodeDataURL();

  if (!qrDataURL) {
    return res.send(`
      <html>
        <body style="font-family:sans-serif;text-align:center;padding:40px;background:#0d1117;color:#ff9800;">
          <h1>⏳ QR Code Not Ready Yet</h1>
          <p style="color:#aaa;">WhatsApp is still initializing. Please wait a few seconds and refresh this page.</p>
          <script>setTimeout(() => location.reload(), 3000);</script>
        </body>
      </html>
    `);
  }

  return res.send(`
    <html>
      <head>
        <title>WhatsApp QR Code</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 40px; background: #0d1117; color: #eee; }
          img { border: 4px solid #25d366; border-radius: 12px; margin-top: 20px; width: 280px; height: 280px; }
          h1 { color: #25d366; }
          p { color: #aaa; }
        </style>
      </head>
      <body>
        <h1>📱 Scan QR Code with WhatsApp</h1>
        <p>Open WhatsApp → Linked Devices → Link a Device → Scan this code</p>
        <img src="${qrDataURL}" alt="WhatsApp QR Code" />
        <p style="margin-top:20px;font-size:0.85em;">This page refreshes automatically every 5 seconds until connected.</p>
        <script>setTimeout(() => location.reload(), 5000);</script>
      </body>
    </html>
  `);
});

module.exports = router;
