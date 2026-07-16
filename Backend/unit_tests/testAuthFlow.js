require('dotenv').config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api/auth`;

// Helper to handle requests cleanly
async function request(endpoint, method, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runAuthFlowTest() {
  console.log('=== Starting Admin Auth Flow Test ===\n');

  // Credentials
  const currentAdmin = {
    email: process.env.ADMIN_EMAIL || 'admin@skincareproject.com',
    password: process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y'
  };

  const newAdmin = {
    email: `new_admin_${Date.now()}@skincareproject.com`,
    password: 'SecurePassword123!'
  };

  // Step 1: Login with current Admin credentials
  console.log('Step 1: Logging in with current Admin...');
  const loginRes = await request('/login', 'POST', currentAdmin);
  
  if (loginRes.status !== 200 || !loginRes.data.token) {
    console.error('❌ Step 1 Failed! Could not log in with current credentials.', loginRes.data);
    return;
  }
  const currentToken = loginRes.data.token;
  console.log('🟢 Login successful! Token received.\n');

  // Step 2: Register a new Admin (Protected route, requires Token)
  console.log('Step 2: Registering a new Admin (using current token)...');
  const registerRes = await request('/register', 'POST', newAdmin, currentToken);

  if (registerRes.status !== 201) {
    console.error('❌ Step 2 Failed! Could not register new admin.', registerRes.data);
    return;
  }
  console.log('🟢 New Admin registered successfully!\n');

  // Step 3: Login with the NEW Admin credentials
  console.log('Step 3: Logging in with the newly registered Admin...');
  const newLoginRes = await request('/login', 'POST', {
    email: newAdmin.email,
    password: newAdmin.password
  });

  if (newLoginRes.status !== 200 || !newLoginRes.data.token) {
    console.error('❌ Step 3 Failed! Could not log in with new admin credentials.', newLoginRes.data);
    return;
  }
  console.log('🟢 Login with new Admin successful! Token received.');
  console.log('🔑 New Admin Token:', newLoginRes.data.token.substring(0, 20) + '...');
  
  console.log('\n✅ All Auth Flow steps passed successfully!');
}

runAuthFlowTest();
