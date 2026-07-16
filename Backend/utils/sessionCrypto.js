const crypto = require('crypto');

// Derives a 32-byte key from the session secret to satisfy AES-256 key size requirement
const getSecretKey = (secret) => {
  return crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
};

function encryptSessionData(data, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', getSecretKey(secretKey), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Combine IV with ciphertext to allow decryption
  return iv.toString('hex') + ':' + encrypted;
}

function decryptSessionData(encryptedData, secretKey) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', getSecretKey(secretKey), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encryptSessionData,
  decryptSessionData,
};
