# ✨ SkinCare - Premium Skincare E-commerce Store (MVP Version) ✨

[English Version](#english-version) | [النسخة العربية](#arabic-version)

---

<div id="english-version">

## 📖 About the Project & MVP Version
**SkinCare** is a fully responsive, modern e-commerce web application designed for a premium skincare brand, custom-built for a client. 

This project represents the **MVP Version (Minimum Viable Product)** of a full **MERN Stack** (MongoDB, Express.js, React, Node.js) application. This current release focuses on delivering a visually stunning, high-performance frontend interface, interactive stateful shopping cart experience, and dynamic routing to showcase client products before full backend API integration.

🔗 **Live Demo Link:** [Explore the Skincare Store](https://a422789.github.io/SkinCareReactProject)

---

## 🚀 Key Features
* **🛍️ Rich Product Catalog:** Categorized skincare goods, bestselling features, and new arrivals.
* **🛒 Advanced Cart System:** Fully functional cart drawer and dedicated cart page allowing immediate quantity updates, removals, and price calculations using React Context.
* **💳 Multi-step Checkout Flow:** A beautifully styled checkout form with real-time feedback and order review.
* **✨ Dynamic Animations & Interaction:** Hover interactions, entrance animations, and a floating interactive cream bottle component.
* **📱 Fully Responsive Design:** Tailored layouts that adapt perfectly to mobile, tablet, and desktop screens.
* **🔍 Dynamic Product Details:** Custom pages displaying product specs, usage guides, ingredients, and recommended products.

---

## 🛠️ Built With (MERN Stack Frontend)
* **Framework:** [React 19](https://react.dev/)
* **Bundler:** [Vite](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Routing:** [React Router Dom v7](https://reactrouter.com/)
* **State Management:** React Context API (Cart Context)

---

## 📂 Project Structure
```text
src/
├── components/          # Reusable UI Components (Header, Footer, Product Cards)
│   ├── home/            # Home page specific sections (Hero, Categories, Testimonials)
│   ├── CartDrawer.jsx   # Interactive shopping cart drawer
│   └── ...
├── pages/               # Top-level Page components (Home, Shop, Cart, Checkout)
├── lib/                 # Utility files & Contexts
│   ├── cart-context.jsx # Global shopping cart state provider
│   └── products.js      # Mock product database
├── App.jsx              # Routing configurations
└── main.jsx             # Entry point
```

---

## 💻 Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/a422789/SkinCareReactProject.git
cd SkinCareReactProject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment
This project is configured to deploy directly to **GitHub Pages** using:
```bash
npm run deploy
```

</div>

---

<div id="arabic-version" dir="rtl">

## 📖 حول المشروع ونسخة الـ MVP
**SkinCare** هو تطبيق ويب لمتجر إلكتروني حديث ومبتكر مخصص لمنتجات العناية بالبشرة، تم بناؤه خصيصاً لعميلة براند سكين كير.

يمثل هذا المشروع **نسخة الـ MVP (المنتج الأدنى القابل للنمو)** لتطبيق متكامل يعتمد على **MERN Stack** (MongoDB, Express, React, Node.js). تركز هذه النسخة الحالية على تقديم واجهة مستخدم أمامية ممتازة وتجربة تفاعلية متكاملة لسلة المشتريات وتصفح المنتجات والطلب تمهيداً لربطها بالخادم وقاعدة البيانات بالكامل في المراحل القادمة.

🔗 **رابط الديمو (معاينة حية):** [اضغط هنا لزيارة المتجر](https://a422789.github.io/SkinCareReactProject)

---

## 🚀 الميزات الرئيسية
* **🛍️ تصفح مرن للمنتجات:** تصنيفات مخصصة، منتجات مميزة، والمنتجات الأكثر مبيعاً.
* **🛒 نظام سلة مشتريات متكامل:** إضافة وتعديل كميات وحذف المنتجات فورياً مع شريط جانبي متحرك (Cart Drawer) وصفحة مخصصة للسلة.
* **💳 صفحة إتمام الدفع (Checkout):** عملية دفع سهلة وواجهة تفاعلية لتعبئة البيانات وإصدار الطلبات.
* **✨ تأثيرات حركية فائقة الجمال:** استخدام أنيميشن مخصص لظهور وتفاعل العناصر ومجسم ثلاثي الأبعاد تفاعلي عائم لزجاجة كريم لزيادة جاذبية الموقع.
* **📱 تصميم متجاوب بالكامل:** متوافق تماماً مع جميع الأجهزة والشاشات (الهواتف، الأجهزة اللوحية، والحواسيب).
* **🔍 تفاصيل المنتج الديناميكية:** صفحات مستقلة لكل منتج تعرض تفاصيله، كيفية الاستخدام، المكونات، والمنتجات ذات الصلة.

---

## 🛠️ التقنيات المستخدمة
* **المكتبة الأساسية:** [React 19](https://react.dev/)
* **أداة البناء:** [Vite](https://vite.dev/)
* **التنسيق والتصميم:** [Tailwind CSS v4](https://tailwindcss.com/)
* **التأثيرات الحركية:** [Framer Motion](https://www.framer.com/motion/)
* **الأيقونات:** [Lucide React](https://lucide.dev/)
* **إدارة المسارات:** [React Router Dom v7](https://reactrouter.com/)
* **إدارة الحالة:** React Context API (Cart Context)

---

## 📂 هيكلية المجلدات
```text
src/
├── components/          # المكونات القابلة لإعادة الاستخدام (الأزرار، الهيدر، الفوتر)
│   ├── home/            # المكونات الخاصة بالصفحة الرئيسية (البطل، التصنيفات، إلخ)
│   ├── CartDrawer.jsx   # شريط السلة الجانبي
│   └── ...
├── pages/               # الصفحات الرئيسية للموقع (الرئيسية، المتجر، السلة، الدفع)
├── lib/                 # الملفات المساعدة (إدارة سلة المشتريات، بيانات المنتجات)
│   ├── cart-context.jsx # سياق حالة السلة (Global State)
│   └── products.js      # قاعدة بيانات المنتجات المحلية
├── App.jsx              # الهيكل العام للموقع والمسارات
└── main.jsx             # نقطة انطلاق التطبيق
```

---

## 💻 طريقة التشغيل محلياً

### 1. استنساخ المستودع
```bash
git clone https://github.com/a422789/SkinCareReactProject.git
cd SkinCareReactProject
```

### 2. تثبيت الاعتمادات
```bash
npm install
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```

### 4. بناء المشروع للإنتاج
```bash
npm run build
```

---

## 🌐 النشر والرفع
المشروع مهيأ للنشر التلقائي على **GitHub Pages** عبر الأوامر التالية:
```bash
npm run deploy
```

</div>