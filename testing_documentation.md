# دليل الاختبار الشامل — SkinCare Project

## نظرة عامة على استراتيجية الاختبار

```
┌──────────────────────────────────────────────────┐
│           هرم الاختبار (Testing Pyramid)          │
│                                                  │
│              /‾‾‾‾‾‾‾‾‾‾‾‾‾\                     │
│             /   E2E (Cypress)  \    ← بطيء، قليل │
│            /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\                 │
│           / Integration (Vitest)  \               │
│          /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\               │
│         /     Unit Tests (Vitest)   \  ← سريع، كثير│
│        /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\             │
└──────────────────────────────────────────────────┘
```

---

## 1. WebPage (المتجر الإلكتروني)

**الأدوات المستخدمة:** Vitest + React Testing Library + Cypress

### 1.1 Unit Tests — Vitest

**كيف تشغّلها:**
```bash
cd Frontend/WebPage
npm run test
# أو مباشرة:
npx vitest run
```

---

#### ملف: `src/tests/utils.test.js`

**ما الذي يختبره:**
دالة `formatPrice()` الموجودة في `src/lib/utils.js`

| التيست | ما يفعله |
|---|---|
| `should format price as EGP when language is set to English` | يضع `site_lang=en` في localStorage ويتحقق أن `formatPrice(38)` يرجع `"38.00 EGP"` |
| `should format price as EGP when language is not set` | يمسح localStorage ويتحقق من القيمة الافتراضية (English) |
| `should format price with Arabic suffix` | يضع `site_lang=ar` ويتحقق أن `formatPrice(38)` يرجع `"38 ج"` |

**كيف يشتغل:**
```
بيئة jsdom → يحاكي localStorage → يستدعي formatPrice → يقارن الناتج
```

---

#### ملف: `src/tests/cart-context.test.jsx`

**ما الذي يختبره:**
الـ Context الخاص بالسلة (`CartProvider`) في `src/lib/cart-context.jsx`

> يتم تغليف مكون اختبار مؤقت داخل `CartProvider` للوصول لدوال السلة.

| التيست | ما يفعله |
|---|---|
| `should initialize with an empty cart` | يتحقق أن السلة فارغة عند أول تحميل (`itemCount=0`, `subtotal=0`) |
| `should add products to cart and update quantities & subtotal` | يضيف منتجين ويتحقق من عدد العناصر والإجمالي الصحيح (`1+2=3`, `42+64=106`) |
| `should update item quantities` | يضيف منتج ثم يحدّث كميته لـ 5 ويتحقق من الإجمالي (`5×42=210`) |
| `should remove items from the cart` | يضيف منتجين ثم يحذف الثاني ويتحقق من بقاء الأول فقط |
| `should clear the cart entirely` | يضيف منتج ثم ينادي `clearCart()` ويتحقق أن السلة فارغت |

**كيف يشتغل:**
```
Render(CartProvider > TestComponent) 
→ fireEvent (click button) 
→ act() لتطبيق التغييرات 
→ expect(screen.getByTestId) للتحقق
```

---

#### ملف: `src/tests/ProductCard.test.jsx`

**ما الذي يختبره:**
مكون `ProductCard` في `src/components/ProductCard.jsx`

> **مهم:** يتم عمل Mock (محاكاة) لثلاثة Contexts بالكامل لعزل المكون:
> - `useLanguage` → محاكاة ترجمة ثابتة بالإنجليزية
> - `useSettings` → محاكاة قائمة فئات فارغة
> - `useCart` → محاكاة دالة `addItem`

| التيست | ما يفعله |
|---|---|
| `should render product name, price and image correctly` | يرندر الكرت ويتحقق من اسم المنتج بالإنجليزية، السعر المنسق، ومصدر الصورة |
| `should trigger addItem when Add to Cart button is clicked` | يضغط زر "Add to Cart" ويتحقق أن `addItem` استُدعيت بالمنتج الصحيح |

**كيف يشتغل:**
```
vi.mock() لكل Context 
→ render(BrowserRouter > ProductCard) 
→ screen.getByText / fireEvent.click 
→ expect(mockFn)
```

---

### 1.2 Integration E2E Tests — Cypress

**الـ Base URL:** `http://localhost:5173` (يُشغَّل داخل الـ Runner آلياً)

**كيف تشغّلها:**
```bash
cd Frontend/WebPage
npm run test:e2e
# أو بالواجهة الرسومية:
npx cypress open
```

---

#### ملف: `cypress/e2e/contact.cy.js`

**السيناريو الكامل:** إرسال رسالة تواصل من العميل

| الخطوة | ما يحدث |
|---|---|
| `cy.visit('/contact')` | فتح صفحة التواصل |
| `cy.get('input[name="name"]').type(...)` | تعبئة حقل الاسم |
| `cy.get('input[name="email"]').type(...)` | تعبئة البريد الإلكتروني |
| `cy.get('input[name="phone"]').type(...)` | تعبئة رقم الهاتف |
| `cy.intercept('POST', '**/api/messages')` | اعتراض طلب الـ API لمراقبته |
| `cy.get('button[type="submit"]').click()` | الضغط على إرسال |
| `cy.wait('@submitMessage').its('response.statusCode').should('eq', 201)` | التحقق من نجاح الطلب |
| `cy.contains(/successfully/i)` | التحقق من ظهور رسالة النجاح |
| `cy.get('input[name="name"]').should('have.value', '')` | التحقق من تفريغ الحقول |

---

#### ملف: `cypress/e2e/checkout.cy.js`

**السيناريو الكامل:** دورة الشراء من تصفح المنتج لإتمام الطلب

| الخطوة | ما يحدث |
|---|---|
| `cy.visit('/shop')` | فتح صفحة المتجر |
| `cy.get('.product-card').first().find('a').first().click()` | النقر على أول منتج |
| `cy.url().should('include', '/product/')` | التحقق من الانتقال لصفحة المنتج |
| `cy.contains(/Add to Cart/i).click()` | إضافة المنتج للسلة |
| `cy.visit('/checkout')` | الانتقال لصفحة الدفع |
| تعبئة اسم، هاتف، عنوان، مدينة | ملء بيانات الشحن |
| `cy.get('select[name="paymentType"]').select(1)` | اختيار طريقة الدفع |
| `cy.intercept('POST', '**/api/orders')` | اعتراض طلب إنشاء الأوردر |
| `cy.get('button[type="submit"]').click()` | إتمام الطلب |
| `cy.wait('@placeOrder').its('response.statusCode').should('eq', 201)` | التحقق من نجاح إنشاء الأوردر |

---

## 2. Dashboard (لوحة التحكم)

**الأدوات المستخدمة:** Vitest + React Testing Library + Cypress

### 2.1 Unit Tests — Vitest

**كيف تشغّلها:**
```bash
cd Frontend/Dashboard
npm run test
```

---

#### ملف: `src/tests/DashboardLayout.test.jsx`

**ما الذي يختبره:**
مكون الـ Sidebar والتنقلات (`DashboardLayout`)

> يتم عمل Mock لـ `useLanguage` و `useTheme`.

| التيست | ما يفعله |
|---|---|
| `should render the sidebar with navigation links and admin title` | يتحقق من وجود: اسم المتجر (HE Admin)، وروابط: Overview، Products، Orders، Messages، Settings، Logout |

---

#### ملف: `src/tests/Overview.test.jsx`

**ما الذي يختبره:**
صفحة الأوفرفيو بعد استجابة الـ API

> يتم عمل Mock لـ `global.fetch` للتحكم في ردود الـ API.

| التيست | ما يفعله |
|---|---|
| `should show loader then display analytics metrics on success` | يتحقق أولاً من ظهور رسالة التحميل، ثم بعد `waitFor` يتحقق من ظهور الأرقام الصحيحة (15,400 EGP، 145 أوردر، 3,200 زيارة) |

**كيف يشتغل:**
```
vi.fn() لـ global.fetch 
→ render(Overview) 
→ expect(Loading...) 
→ waitFor() حتى تختفي رسالة التحميل
→ expect(الأرقام الصحيحة)
```

---

### 2.2 Integration E2E Tests — Cypress

**الـ Base URL:** `http://localhost:5174` (منفذ مختلف عن الويب بيج)

**كيف تشغّلها:**
```bash
cd Frontend/Dashboard
npm run test:e2e
```

---

#### ملف: `cypress/e2e/login.cy.js`

**السيناريو الكامل:** عملية تسجيل دخول الأدمن

| التيست | ما يفعله |
|---|---|
| `should show validation errors for empty form` | يضغط Submit بدون تعبئة ويتحقق من ظهور رسائل الحقول المطلوبة |
| `should show validation error for invalid email` | يدخل بريد بصيغة خاطئة ويتحقق من رسالة التحقق |
| `should show error on wrong credentials` | يستعلم الـ API بمعلومات خاطئة ويتحقق من ظهور رسالة خطأ (401) |
| `should login and redirect to dashboard` | يسجل بمعلومات صحيحة ويتحقق من التحويل للرئيسية وحفظ الـ Token في localStorage |

---

#### ملف: `cypress/e2e/overview.cy.js`

**السيناريو الكامل:** صفحة الأوفرفيو للأدمن بعد تسجيل الدخول

> جميع طلبات الـ API يتم **اعتراضها** بـ `cy.intercept()` وتزويدها ببيانات تجريبية ثابتة.

| التيست | ما يفعله |
|---|---|
| `should redirect unauthenticated users to login page` | يمسح localStorage ويزور `/` ويتحقق من التحويل لـ `/login` |
| `should display overview stats after loading` | يتحقق من ظهور الأرقام الصحيحة: مبيعات `8,500`، طلبات `42`، زيارات `1,200`، رسائل `2` |
| `should display order status summary correctly` | يتحقق من ظهور ألوان وأعداد حالات الطلبات (Pending, Processing, Delivered) |
| `should navigate to orders page via sidebar` | ينقر على رابط Orders في الـ Sidebar ويتحقق من الانتقال لـ `/orders` |

---

## 3. Backend (الباك إند)

**الأدوات المستخدمة:** Jest + Supertest

---

### 3.1 كيف تشغّل الاختبارات الآلية (Jest + Supertest)

```bash
cd BackEnd
npm run test
```

> **ملاحظة:** تأكد من أن السيرفر **غير مشغّل** في ترمنال آخر قبل التشغيل، أو قم بتشغيل التيست وهو شغّال — Supertest يُنشئ اتصالاً مباشراً بالـ app بدون الحاجة لمنفذ مفتوح.

---

### 3.2 هيكل ملفات الاختبار

```
BackEnd/
├── jest.config.js              ← إعدادات Jest (بيئة Node، timeout، setup)
├── jsconfig.json               ← إعدادات VS Code لمنع تحذير الـ Casing
└── tests/
    ├── setup.js                ← Mock عالمي للواتساب + تنظيف قاعدة البيانات
    ├── auth.test.js            ← اختبارات تسجيل الدخول والملف الشخصي
    ├── messages.test.js        ← اختبارات الرسائل (CRUD + WhatsApp mock)
    └── orders.test.js          ← اختبارات الطلبات (CRUD + Stock + WhatsApp mock)
```

---

### 3.3 ملف الإعداد العالمي — `tests/setup.js`

يُحمَّل تلقائياً قبل كل ملف اختبار عبر `setupFilesAfterEnv` في `jest.config.js`.

**ما يفعله:**
- **Mock كامل لخدمة الواتساب** (`utils/whatsapp.js`): يمنع فتح متصفح Puppeteer الحقيقي أو إرسال رسائل فعلية أثناء التيست.
- **تنظيف اتصال قاعدة البيانات** بعد انتهاء كل Suite عبر `afterAll`.

```javascript
jest.mock('../utils/whatsapp', () => ({
  initWhatsApp: jest.fn().mockResolvedValue(true),
  sendWhatsAppMessage: jest.fn().mockResolvedValue(true),
  getQRCodeDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqr'),
  getStatus: jest.fn().mockReturnValue({ isReady: true, hasQR: false }),
}));
```

---

### 3.4 ملفات الاختبار التفصيلية

---

#### ملف: `tests/auth.test.js`

**ما الذي يختبره:** نقاط نهاية المصادقة (`/api/auth`)

| التيست | الوصف |
|---|---|
| `should authenticate admin and return a token` | يرسل POST `/api/auth/login` ببيانات صحيحة، يتحقق أن الرد 200 ويحتوي على `token` |
| `should reject login with wrong credentials` | يرسل بيانات خاطئة، يتحقق أن الرد 401 مع رسالة خطأ |
| `should fetch admin profile when provided a valid token` | يستخدم التوكن لجلب `/api/auth/profile`، يتحقق من البريد الإلكتروني الصحيح |

**كيف يشتغل:**
```
supertest(app) → POST /api/auth/login → expect(200 + token)
supertest(app) → GET /api/auth/profile → Authorization: Bearer {token} → expect(200)
```

---

#### ملف: `tests/messages.test.js`

**ما الذي يختبره:** نقاط نهاية الرسائل (`/api/messages`)

| التيست | الوصف |
|---|---|
| `should allow customer to submit a new message (Public)` | يرسل رسالة تواصل عامة بدون توكن، يتحقق أن الرد 201 ويحتوي على بيانات الرسالة |
| `should deny fetching messages list without token` | يطلب قائمة الرسائل بدون توكن، يتحقق من رد 401 |
| `should fetch messages list for authenticated admin` | يطلب القائمة بتوكن الأدمن، يتحقق من رد 200 ومصفوفة |
| `should send a reply and trigger mock WhatsApp response` | يرسل رد على رسالة، يتحقق من رد 200 ومن أن `sendWhatsAppMessage` Mock استُدعيت |
| `should delete the test message successfully` | يحذف الرسالة المنشأة ويتحقق من رد 200 |

**ملاحظة مهمة:** الـ Mock للواتساب يتحقق من أن الكود يستدعي `sendWhatsAppMessage` دون إرسال رسالة فعلية.

---

#### ملف: `tests/orders.test.js`

**ما الذي يختبره:** نقاط نهاية الطلبات (`/api/orders`)

| التيست | الوصف |
|---|---|
| `should create a new order successfully (Public)` | يجلب منتجاً وطريقة دفع من قاعدة البيانات، يرسل طلباً جديداً، يتحقق من رد 201 ووجود `orderId` |
| `should fetch orders list for authenticated admin` | يطلب قائمة الطلبات بتوكن الأدمن، يتحقق من رد 200 ومصفوفة |
| `should update order status to Shipped` | يرسل PUT لتحديث حالة الطلب، يتحقق من رد 200 والحالة الجديدة |
| `should delete the test order successfully` | يحذف الطلب المنشأ ويتحقق من رد 200 |

**ملاحظة:** عند إنشاء الأوردر يتم تلقائياً:
- تخفيض المخزون (`stock`) للمنتج في قاعدة البيانات.
- استدعاء `sendWhatsAppMessage` (عبر الـ Mock — لا رسالة فعلية).

---

### 3.5 السكريبتات اليدوية — `unit_tests/`

هذه سكريبتات Node.js مستقلة (ليست Jest) تتصل بالسيرفر الحقيقي وتختبر الـ API بشكل يدوي.

**الملفات:**

```
BackEnd/unit_tests/
├── testOrder.js       ← اختبار CRUD كامل للطلبات
└── testMessages.js    ← اختبار إرسال رسالة ورد الأدمن عليها
```

**كيف تشغّلها:**

```bash
# من داخل مجلد unit_tests
cd BackEnd/unit_tests

# اختبار الطلبات
node testOrder.js

# اختبار الرسائل
node testMessages.js
```

> **مهم:** يجب أن يكون السيرفر شغّالاً (`npm start`) وقاعدة البيانات متصلة قبل تشغيل هذه السكريبتات.

---

#### سكريبت: `testOrder.js`

**ما الذي يفعله:** اختبار تسلسلي كامل لدورة الطلب

| الخطوة | ما تفعله |
|---|---|
| **Step 1** | تسجيل دخول الأدمن والحصول على توكن |
| **Step 2** | جلب أول منتج وأول طريقة دفع من قاعدة البيانات |
| **Step 3** | إنشاء طلب جديد (POST `/api/orders`) — يُرسل إشعار واتساب للأدمن فعلياً |
| **Step 4** | جلب قائمة الطلبات (GET `/api/orders`) والتحقق من وجود الطلب |
| **Step 5** | تحديث حالة الطلب إلى `Shipped` (PUT `/api/orders/:id`) |
| **Step 6** | حذف الطلب التجريبي (DELETE `/api/orders/:id`) |

> **ملاحظة إرسال الواتساب:** يتم إرسال رسالة واتساب فعلية للأدمن في Step 3، ولكن يجب الانتباه لعدم حذف الأوردر فوراً (Step 6) قبل اكتمال إرسال الرسالة، لأن الإرسال يعمل بشكل Async/Non-blocking.

---

#### سكريبت: `testMessages.js`

**ما الذي يفعله:** اختبار تسلسلي لإرسال رسالة تواصل والرد عليها

| الخطوة | ما تفعله |
|---|---|
| **Step 1** | تسجيل دخول الأدمن |
| **Step 2** | إرسال رسالة تواصل جديدة (POST `/api/messages`) — يُرسل إشعار واتساب للأدمن |
| **Step 3** | جلب قائمة الرسائل (GET `/api/messages`) |
| **Step 4** | الرد على الرسالة (POST `/api/messages/:id/reply`) — يُرسل رسالة واتساب للعميل |
| **Step 5** | حذف الرسالة التجريبية (DELETE `/api/messages/:id`) |

---

## 4. ملخص الأوامر الكامل

| الأمر | الموقع | ما يفعل |
|---|---|---|
| `npm run test` | `BackEnd/` | يشغل Jest Integration Tests (12 اختباراً — Auth + Messages + Orders) |
| `node testOrder.js` | `BackEnd/unit_tests/` | يشغل سكريبت اختبار الطلبات يدوياً |
| `node testMessages.js` | `BackEnd/unit_tests/` | يشغل سكريبت اختبار الرسائل يدوياً |
| `npm run test` | `Frontend/WebPage` | يشغل Unit Tests للمتجر (10 اختبارات) |
| `npm run test:e2e` | `Frontend/WebPage` | يشغل E2E Tests بـ Cypress للمتجر |
| `npm run test` | `Frontend/Dashboard` | يشغل Unit Tests للداشبورد (2 اختبارات) |
| `npm run test:e2e` | `Frontend/Dashboard` | يشغل E2E Tests بـ Cypress للداشبورد |
| `npx cypress open` | أي مشروع Frontend | يفتح واجهة Cypress الرسومية للتشغيل اليدوي |

---

## 5. كيف تعمل في CI/CD Pipeline

```yaml
# عند git push → GitHub Actions:

# --- Backend ---
1. تثبيت Node.js 20
2. cd BackEnd && npm install
3. npm run test      ← Jest Integration Tests (لا يحتاج سيرفر مفتوح)

# --- Frontend WebPage ---
4. cd Frontend/WebPage && npm install
5. npm run test      ← Vitest Unit Tests
6. npm run dev &     ← يشغل Vite في الخلفية
7. npx wait-on http://localhost:5173
8. npm run test:e2e  ← Cypress E2E

# --- Frontend Dashboard ---
9. cd Frontend/Dashboard && npm install
10. npm run test     ← Vitest Unit Tests
11. npm run dev &    ← يشغل Vite في الخلفية
12. npx wait-on http://localhost:5174
13. npm run test:e2e ← Cypress E2E

# إذا نجح كل شيء → Deploy لـ Vercel/Railway
# إذا فشل أي اختبار → يوقف الرفع وينبّه المطور
```

> **الـ `localhost` داخل الـ Runner** = نفس سيرفر CI/CD المؤقت.
> كلٌّ من Vite وCypress يعملان على نفس الجهاز، لذا `localhost:5173/5174` يعمل بشكل طبيعي دون أي تعديل.
