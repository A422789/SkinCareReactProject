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

async function runAnalyticsTest() {
  console.log('=== Starting Analytics & Visit Tracking Unit Test ===\n');

  // Step 1: Record a new public visit (POST /analytics/visit)
  console.log('Step 1: Simulating a public visitor session (recording visit)...');
  const visitRes = await request('/analytics/visit', 'POST');
  if (visitRes.status !== 200 || !visitRes.data.success) {
    console.error('❌ Failed to record visit.', visitRes.data);
    return;
  }
  console.log('🟢 Visitor registered successfully!\n');

  // Step 2: Login to fetch protected Dashboard overview
  console.log('Step 2: Authenticating Admin...');
  const authRes = await request('/auth/login', 'POST', {
    email: process.env.ADMIN_EMAIL || 'admin@skincareproject.com',
    password: process.env.ADMIN_PASSWORD || 'x7K9$vP2mB!w8Z*qQ_4y'
  });

  if (authRes.status !== 200 || !authRes.data.token) {
    console.error('❌ Authentication failed. Cannot proceed.', authRes.data);
    return;
  }
  const token = authRes.data.token;
  console.log('🟢 Authenticated successfully.\n');

  // Step 3: Fetch Analytics Overview (GET /analytics/overview)
  console.log('Step 3: Fetching Dashboard Analytics Overview...');
  const overviewRes = await request('/analytics/overview', 'GET', null, token);
  
  if (overviewRes.status !== 200) {
    console.error('❌ Failed to fetch overview data.', overviewRes.data);
    return;
  }
  
  console.log('🟢 Analytics Overview fetched successfully:');
  console.log(`📊 Total Revenue: $${overviewRes.data.totalRevenue}`);
  console.log(`📦 Total Orders: ${overviewRes.data.totalOrders}`);
  console.log(`👥 Total Unique Visits: ${overviewRes.data.totalVisits}`);
  console.log(`📈 Chart Data Points (salesData): ${overviewRes.data.salesData.length} items`);

  console.log('\n✅ Analytics & Visit Tracking Unit Test completed successfully!');
}

runAnalyticsTest();
