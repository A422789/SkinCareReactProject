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

async function runProductTest() {
  console.log('=== Starting Product CRUD Unit Test ===\n');

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

  // Step 2: Fetch existing Categories to use for the product relation
  console.log('Step 2: Fetching existing categories to link to the test product...');
  const catListRes = await request('/categories', 'GET');
  
  if (catListRes.status !== 200 || !Array.isArray(catListRes.data) || catListRes.data.length === 0) {
    console.error('❌ No categories found in database. Please seed or create a category first.');
    return;
  }
  
  const categoryObjectId = catListRes.data[0]._id;
  const categoryName = catListRes.data[0].name;
  console.log(`🟢 Category found: "${categoryName}" (DB ID: ${categoryObjectId})\n`);

  // Product Test Data
  const productPayload = {
    name: { en: 'Test Hydration Cream', ar: 'كريم ترطيب تجريبي' },
    tagline: { en: 'Hydrate · Refresh', ar: 'ترطيب · انتعاش' },
    price: 99.9,
    stock: 50,
    category: categoryObjectId,
    description: { en: 'Excellent hydration cream test', ar: 'كريم ترطيب تجريبي ممتاز' },
    ingredients: { en: 'Water, Glycerin', ar: 'ماء، جليسرين' },
    howToUse: { en: 'Apply daily', ar: 'ضعه يومياً' }
  };
  let createdProductDbId = '';

  // Step 3: Create Product (POST)
  console.log('Step 3: Creating a new Product...');
  const createRes = await request('/products', 'POST', productPayload, token);

  if (createRes.status !== 201) {
    console.error('❌ Failed to create Product.', createRes.data);
    return;
  }
  createdProductDbId = createRes.data._id;
  console.log(`🟢 Product created successfully! DB ID: ${createdProductDbId}\n`);

  // Step 4: Get All Products (GET)
  console.log('Step 4: Fetching all products...');
  const getListRes = await request('/products', 'GET');
  if (getListRes.status !== 200 || !Array.isArray(getListRes.data)) {
    console.error('❌ Failed to fetch products list.', getListRes.data);
    return;
  }
  console.log(`🟢 Fetched ${getListRes.data.length} products successfully.\n`);

  // Step 5: Update Product (PUT)
  console.log('Step 5: Updating the created Product...');
  const updatePayload = {
    ...productPayload,
    price: 120.0,
    stock: 45
  };
  const updateRes = await request(`/products/${createdProductDbId}`, 'PUT', updatePayload, token);

  if (updateRes.status !== 200) {
    console.error('❌ Failed to update Product.', updateRes.data);
    return;
  }
  console.log('🟢 Product updated successfully! New Price: 120.0, Stock: 45\n');

  // Step 6: Delete Product (DELETE)
  console.log('Step 6: Deleting the test Product...');
  const deleteProdRes = await request(`/products/${createdProductDbId}`, 'DELETE', null, token);

  if (deleteProdRes.status !== 200) {
    console.error('❌ Failed to delete Product.', deleteProdRes.data);
    return;
  }
  console.log('🟢 Product deleted successfully!\n');

  console.log('✅ All Product CRUD Unit Test steps passed successfully!');
}

runProductTest();
