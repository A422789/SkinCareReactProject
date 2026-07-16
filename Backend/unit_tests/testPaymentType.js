require('dotenv').config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

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

async function runPaymentTypeTest() {
  console.log('=== Starting PaymentType CRUD Unit Test ===\n');

  // Step 1: Login
  console.log('Step 1: Authenticating Admin...');
  const authRes = await request('/auth/login', 'POST', {
    email: process.env.ADMIN_EMAIL || 'admin@skincareproject.com',
    password: process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y'
  });

  if (authRes.status !== 200 || !authRes.data.token) {
    console.error('❌ Authentication failed. Cannot proceed with test.', authRes.data);
    return;
  }
  const token = authRes.data.token;
  console.log('🟢 Authenticated successfully.\n');

  // Data
  const paymentPayload = {
    id: `test-pay-${Date.now()}`,
    name: 'Test Cash on Delivery',
    isActive: true
  };
  let createdPaymentDbId = '';

  // Step 2: Create Payment Type (POST)
  console.log('Step 2: Creating a new Payment Type...');
  const createRes = await request('/payment-types', 'POST', paymentPayload, token);

  if (createRes.status !== 201) {
    console.error('❌ Failed to create Payment Type.', createRes.data);
    return;
  }
  createdPaymentDbId = createRes.data._id;
  console.log(`🟢 Payment Type created successfully! DB ID: ${createdPaymentDbId}\n`);

  // Step 3: Get All Payment Types (GET)
  console.log('Step 3: Fetching all payment types...');
  const getListRes = await request('/payment-types', 'GET');
  if (getListRes.status !== 200 || !Array.isArray(getListRes.data)) {
    console.error('❌ Failed to fetch payment types list.', getListRes.data);
    return;
  }
  console.log(`🟢 Fetched ${getListRes.data.length} payment types successfully.\n`);

  // Step 4: Update Payment Type (PUT)
  console.log('Step 4: Updating the created Payment Type...');
  const updatePayload = {
    id: paymentPayload.id,
    name: 'Updated Test Payment',
    isActive: false
  };
  const updateRes = await request(`/payment-types/${createdPaymentDbId}`, 'PUT', updatePayload, token);

  if (updateRes.status !== 200) {
    console.error('❌ Failed to update Payment Type.', updateRes.data);
    return;
  }
  console.log('🟢 Payment Type updated successfully (isActive: false)!\n');

  // Step 5: Delete Payment Type (DELETE)
  console.log('Step 5: Deleting the test Payment Type...');
  const deleteRes = await request(`/payment-types/${createdPaymentDbId}`, 'DELETE', null, token);

  if (deleteRes.status !== 200) {
    console.error('❌ Failed to delete Payment Type.', deleteRes.data);
    return;
  }
  console.log('🟢 Payment Type deleted successfully!\n');

  console.log('✅ All PaymentType CRUD Unit Test steps passed successfully!');
}

runPaymentTypeTest();
