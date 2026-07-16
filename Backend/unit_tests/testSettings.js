require('dotenv').config();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

// Helper to make fetch requests (handles JSON or FormData)
async function request(endpoint, method, body, token = null) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON Content-Type
  const isFormData = body instanceof FormData;
  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : null)
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runSettingsTest() {
  console.log('=== Starting Settings & Cloudinary Upload Unit Test ===\n');

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

  // Define paths to real local images in frontend
  const logoPath = path.join(__dirname, '../../Frontend/WebPage/public/images/logo.png');
  const tempImagePath = path.join(__dirname, '../../Frontend/WebPage/public/placeholder.jpg');

  // Read files as buffers
  if (!fs.existsSync(logoPath) || !fs.existsSync(tempImagePath)) {
    console.error('❌ Local test images not found in Frontend folder. Make sure paths are correct.');
    return;
  }

  const logoBuffer = fs.readFileSync(logoPath);
  const tempImageBuffer = fs.readFileSync(tempImagePath);

  // Step 2: Update settings with actual image upload (PUT /settings)
  console.log('Step 2: Uploading Logo & Section Images to Cloudinary (PUT /settings)...');
  const settingsFormData = new FormData();
  
  // Text fields
  settingsFormData.append('name[en]', 'Updated Skincare Elegance');
  settingsFormData.append('name[ar]', 'أناقة العناية بالبشرة المعدل');
  settingsFormData.append('contact[email]', 'test-admin@skincareelegance.com');
  
  // File fields
  settingsFormData.append('logo', new Blob([logoBuffer]), 'logo.png');
  settingsFormData.append('sec2Image', new Blob([tempImageBuffer]), 'about1.jpg');

  const updateRes = await request('/settings', 'PUT', settingsFormData, token);

  if (updateRes.status !== 200) {
    console.error('❌ Failed to upload images to settings.', updateRes.data);
    return;
  }
  console.log('🟢 Settings updated and images uploaded successfully!');
  console.log('🔗 Uploaded Logo Url:', updateRes.data.logoUrl);
  console.log('🔗 Uploaded About Image Url:', updateRes.data.about?.sec2ImageUrl);

  // Step 3: Testimonials CRUD Test with Screenshot Upload (POST /settings/testimonials)
  console.log('\nStep 3: Testing Testimonials with Image Upload...');
  
  const testimonialFormData = new FormData();
  testimonialFormData.append('type', 'screenshot');
  testimonialFormData.append('author', 'Happy Client');
  testimonialFormData.append('quote', 'This product changed my skin completely!');
  testimonialFormData.append('rating', '5');
  testimonialFormData.append('screenshot', new Blob([tempImageBuffer]), 'testimonial_shot.jpg');

  console.log('Uploading testimonial with screenshot...');
  const newTestimonialRes = await request('/settings/testimonials', 'POST', testimonialFormData, token);

  if (newTestimonialRes.status !== 201) {
    console.error('❌ Failed to add testimonial.', newTestimonialRes.data);
    return;
  }
  const testimonialId = newTestimonialRes.data.id;
  console.log(`🟢 Testimonial created! ID: ${testimonialId}`);
  console.log(`🔗 Testimonial Image Url: ${newTestimonialRes.data.screenshotUrl}`);

  // 3b. Delete Testimonial to clean up
  console.log('\nCleaning up testimonial...');
  const deleteTestimonialRes = await request(`/settings/testimonials/${testimonialId}`, 'DELETE', null, token);

  if (deleteTestimonialRes.status !== 200) {
    console.error('❌ Failed to delete testimonial.', deleteTestimonialRes.data);
    return;
  }
  console.log('🟢 Testimonial deleted successfully!');

  console.log('\n✅ Store Settings & Cloudinary upload test completed successfully!');
}

runSettingsTest();
