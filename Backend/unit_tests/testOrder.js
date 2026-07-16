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

async function runOrderTest() {
  console.log('=== Starting Order CRUD Unit Test ===\n');

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

  // Step 2: Fetch existing products and payment types to build valid Order
  console.log('Step 2: Fetching valid product and payment type for order...');
  const prodRes = await request('/products', 'GET');
  const payRes = await request('/payment-types', 'GET');

  if (prodRes.status !== 200 || prodRes.data.length === 0 || payRes.status !== 200 || payRes.data.length === 0) {
    console.error('❌ Products or PaymentTypes are empty. Seed data first.', { products: prodRes.status, payments: payRes.status });
    return;
  }

  const selectedProduct = prodRes.data[0];
  const selectedPayment = payRes.data[0];
  console.log(`🟢 Selected Product: "${selectedProduct.name.en}" (ID: ${selectedProduct._id})`);
  console.log(`🟢 Selected Payment Type: "${selectedPayment.name.en || selectedPayment.name}" (ID: ${selectedPayment._id})\n`);

  // Order Payload conforming to Schema
  const orderPayload = {
    customer: {
      name: 'Test Customer',
      phone: '+1234567890',
      city: 'Cairo',
      address: '123 Test Street, Building 4',
      notes: 'Leave with concierge'
    },
    paymentType: selectedPayment._id,
    orderItems: [
      {
        product: selectedProduct._id,
        quantity: 2,
        price: selectedProduct.price
      }
    ]
  };
  let createdOrderId = '';

  // Step 3: Create Order (POST)
  console.log('Step 3: Creating a new Order...');
  const createRes = await request('/orders', 'POST', orderPayload);

  if (createRes.status !== 201) {
    console.error('❌ Failed to create Order.', createRes.data);
    return;
  }
  createdOrderId = createRes.data._id;
  console.log(`🟢 Order created successfully! DB ID: ${createdOrderId}\n`);

  // Step 4: Get All Orders (GET)
  console.log('Step 4: Fetching all orders...');
  const getListRes = await request('/orders', 'GET', null, token);
  if (getListRes.status !== 200 || !Array.isArray(getListRes.data)) {
    console.error('❌ Failed to fetch orders list.', getListRes.data);
    return;
  }
  console.log(`🟢 Fetched ${getListRes.data.length} orders successfully.\n`);

  // Step 5: Update Order Status (PUT)
  console.log('Step 5: Updating Order Status to Shipped...');
  const updateRes = await request(`/orders/${createdOrderId}`, 'PUT', { status: 'Shipped' }, token);

  if (updateRes.status !== 200) {
    console.error('❌ Failed to update Order status.', updateRes.data);
    return;
  }
  console.log('🟢 Order status updated to Shipped successfully!\n');

  // Step 6: Delete Order (DELETE)
  console.log('Step 6: Deleting the test Order...');
  const deleteRes = await request(`/orders/${createdOrderId}`, 'DELETE', null, token);

  if (deleteRes.status !== 200) {
    console.error('❌ Failed to delete Order.', deleteRes.data);
    return;
  }
  console.log('🟢 Order deleted successfully!\n');

  console.log('✅ All Order CRUD Unit Test steps passed successfully!');
}

runOrderTest();
