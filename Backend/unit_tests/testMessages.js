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

async function runMessagesTest() {
  console.log('=== Starting Messages CRUD & Reply Unit Test ===\n');

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

  // Message Payload (Use Admin WhatsApp number as the customer's phone for testing the reply feature)
  const messagePayload = {
    name: 'Customer Test',
    email: 'customer@example.com',
    phone: process.env.ADMIN_WHATSAPP || '+1234567890',
    subject: 'Skincare Consultation Request',
    message: 'Hello, I want to ask if the Vitamin C cream is good for acne scars.'
  };
  let createdMessageId = '';

  // Step 2: Submit Customer Message (POST - Public)
  console.log('Step 2: Submitting a new Customer Message...');
  const createRes = await request('/messages', 'POST', messagePayload);

  if (createRes.status !== 201) {
    console.error('❌ Failed to submit Message.', createRes.data);
    return;
  }
  createdMessageId = createRes.data.message._id;
  console.log(`🟢 Message submitted successfully! DB ID: ${createdMessageId}`);
  console.log(`📱 WhatsApp Notification to Admin: ${createRes.data.whatsappNotify.success ? '🟢 SENT' : '🔴 FAILED'}\n`);

  // Step 3: Get All Messages (GET - Protected)
  console.log('Step 3: Fetching all messages as Admin...');
  const getListRes = await request('/messages', 'GET', null, token);
  if (getListRes.status !== 200 || !Array.isArray(getListRes.data)) {
    console.error('❌ Failed to fetch messages list.', getListRes.data);
    return;
  }
  console.log(`🟢 Fetched ${getListRes.data.length} messages successfully.\n`);

  // Step 4: Reply to Message (POST - Protected, triggers WhatsApp reply to customer)
  console.log('Step 4: Replying to the Message (sends WhatsApp directly to customer)...');
  const replyPayload = {
    replyText: 'Dear customer, Yes! Vitamin C is highly recommended for reducing acne scars as it promotes collagen synthesis and fades hyperpigmentation.'
  };
  const replyRes = await request(`/messages/${createdMessageId}/reply`, 'POST', replyPayload, token);

  if (replyRes.status !== 200) {
    console.error('❌ Failed to send reply.', replyRes.data);
    return;
  }
  console.log('🟢 WhatsApp Reply sent to customer successfully!\n');

  // Step 5: Delete Message (DELETE - Protected)
  console.log('Step 5: Deleting the test Message...');
  const deleteRes = await request(`/messages/${createdMessageId}`, 'DELETE', null, token);

  if (deleteRes.status !== 200) {
    console.error('❌ Failed to delete Message.', deleteRes.data);
    return;
  }
  console.log('🟢 Message deleted successfully from DB!\n');

  console.log('✅ All Messages CRUD & Reply Unit Test steps passed successfully!');
}

runMessagesTest();
