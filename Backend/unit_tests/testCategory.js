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

async function runCategoryTest() {
  console.log('=== Starting Category CRUD Unit Test ===\n');

  // Step 1: Login to get admin token
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

  // Test Data
  const categoryPayload = {
    id: `test-cat-${Date.now()}`,
    name: 'Test Skincare Category'
  };
  let createdCategoryDbId = '';

  // Step 2: Create Category (POST)
  console.log('Step 2: Creating a new Category...');
  const createRes = await request('/categories', 'POST', categoryPayload, token);

  if (createRes.status !== 201) {
    console.error('❌ Failed to create Category.', createRes.data);
    return;
  }
  createdCategoryDbId = createRes.data._id;
  console.log(`🟢 Category created successfully! DB ID: ${createdCategoryDbId}\n`);

  // Step 3: Get All Categories (GET)
  console.log('Step 3: Fetching all categories...');
  const getListRes = await request('/categories', 'GET');
  if (getListRes.status !== 200 || !Array.isArray(getListRes.data)) {
    console.error('❌ Failed to fetch categories list.', getListRes.data);
    return;
  }
  console.log(`🟢 Fetched ${getListRes.data.length} categories successfully.\n`);

  // Step 4: Update Category (PUT)
  console.log('Step 4: Updating the created Category...');
  const updatePayload = {
    id: categoryPayload.id,
    name: 'Updated Test Category'
  };
  const updateRes = await request(`/categories/${createdCategoryDbId}`, 'PUT', updatePayload, token);

  if (updateRes.status !== 200) {
    console.error('❌ Failed to update Category.', updateRes.data);
    return;
  }
  console.log('🟢 Category updated successfully!\n');

  // Step 5: Delete Category (DELETE)
  console.log('Step 5: Deleting the test Category...');
  const deleteRes = await request(`/categories/${createdCategoryDbId}`, 'DELETE', null, token);

  if (deleteRes.status !== 200) {
    console.error('❌ Failed to delete Category.', deleteRes.data);
    return;
  }
  console.log('🟢 Category deleted successfully!\n');

  console.log('✅ All Category CRUD Unit Test steps passed successfully!');
}

runCategoryTest();
