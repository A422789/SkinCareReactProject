// ─── Products ───
export const productsData = [
  {
    id: 1,
    name: 'Hydrating Glow Serum',
    tagline: 'Hydrate · Glow · Revive',
    price: 35.0,
    stock: 120,
    category: 'Serums',
    description: 'A lightweight serum packed with hyaluronic acid and vitamin E to deeply hydrate and restore your skin\'s natural glow. Suitable for all skin types.',
    ingredients: 'Aqua, Sodium Hyaluronate (Hyaluronic Acid), Tocopherol (Vitamin E), Glycerin, Aloe Barbadensis Leaf Juice, Panthenol, Niacinamide.',
    howToUse: 'Apply 3–4 drops to cleansed face and neck morning and evening. Gently press into skin with fingertips. Follow with moisturizer. Use SPF during the day.',
    isNewArrival: true,
    isBestSeller: true,
    hasOffer: false,
    offerPrice: '',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Vitamin C Brightening Moisturizer',
    tagline: 'Brighten · Even · Protect',
    price: 45.0,
    stock: 85,
    category: 'Moisturizers',
    description: 'Infused with stabilized Vitamin C and niacinamide, this moisturizer brightens dull skin and evens out skin tone while providing all-day hydration.',
    ingredients: 'Aqua, Ascorbic Acid (Vitamin C) 15%, Niacinamide 5%, Glycerin, Shea Butter, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Tocopherol.',
    howToUse: 'Apply a generous amount to face and neck after serum. Massage gently in upward motions. Use morning and night. Always follow with sunscreen in the morning.',
    isNewArrival: false,
    isBestSeller: true,
    hasOffer: true,
    offerPrice: 38.0,
    image: 'https://images.unsplash.com/photo-1608248593842-8d76db8682a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Gentle Foaming Cleanser',
    tagline: 'Cleanse · Soothe · Refresh',
    price: 22.0,
    stock: 200,
    category: 'Cleansers',
    description: 'A soft, pH-balanced foaming cleanser that removes impurities without stripping the skin. Enriched with aloe vera and chamomile extract.',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Juice, Chamomilla Recutita (Chamomile) Extract, Panthenol, Allantoin.',
    howToUse: 'Wet face with lukewarm water. Pump a small amount into hands, lather, and massage onto face in circular motions. Rinse thoroughly. Use morning and evening.',
    isNewArrival: false,
    isBestSeller: false,
    hasOffer: false,
    offerPrice: '',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Overnight Repair Mask',
    tagline: 'Repair · Restore · Renew',
    price: 55.0,
    stock: 45,
    category: 'Masks',
    description: 'Wake up to visibly repaired and plumper skin with this overnight sleeping mask. Contains retinol, peptides, and shea butter for deep restoration.',
    ingredients: 'Aqua, Retinol 0.3%, Palmitoyl Tripeptide-1, Butyrospermum Parkii (Shea) Butter, Squalane, Glycerin, Cetearyl Alcohol, Tocopherol.',
    howToUse: 'Apply a thin, even layer as the last step in your evening skincare routine. Leave on overnight. Rinse off in the morning. Use 2–3 times per week.',
    isNewArrival: true,
    isBestSeller: false,
    hasOffer: false,
    offerPrice: '',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Rosewater Facial Toner',
    tagline: 'Tone · Balance · Refresh',
    price: 18.0,
    stock: 150,
    category: 'Toners',
    description: 'A refreshing toner made with pure rosewater and witch hazel. Tightens pores, balances skin pH, and prepares the skin for serums and moisturizers.',
    ingredients: 'Aqua, Rosa Damascena Flower Water, Hamamelis Virginiana (Witch Hazel) Water, Glycerin, Allantoin, Panthenol, Citric Acid.',
    howToUse: 'After cleansing, apply toner to a cotton pad and sweep across face and neck. Alternatively, mist directly onto skin. Follow with serum and moisturizer.',
    isNewArrival: false,
    isBestSeller: true,
    hasOffer: true,
    offerPrice: 15.0,
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
];

// ─── Orders (extended with items + address + phone + note + payment) ───
export const ordersData = [
  {
    id: 'ORD-001',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 111-2222',
    date: '2026-07-10',
    total: 80.0,
    status: 'Delivered',
    address: '123 Fifth Avenue, New York, NY 10010',
    deliveryNote: 'Please leave the package at the front door.',
    paymentType: 'Cash on Delivery (COD)',
    items: [
      { name: 'Hydrating Glow Serum', qty: 1, price: 35.0 },
      { name: 'Vitamin C Brightening Moisturizer', qty: 1, price: 45.0 },
    ],
  },
  {
    id: 'ORD-002',
    customer: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '+1 (555) 333-4444',
    date: '2026-07-11',
    total: 45.0,
    status: 'Processing',
    address: '456 Oak Street, San Francisco, CA 94102',
    deliveryNote: 'Ring bell upon arrival.',
    paymentType: 'Credit Card',
    items: [
      { name: 'Vitamin C Brightening Moisturizer', qty: 1, price: 45.0 },
    ],
  },
  {
    id: 'ORD-003',
    customer: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+1 (555) 555-6666',
    date: '2026-07-11',
    total: 110.0,
    status: 'Shipped',
    address: '789 Elm Road, Chicago, IL 60614',
    deliveryNote: 'Call me before delivery.',
    paymentType: 'PayPal',
    items: [
      { name: 'Overnight Repair Mask', qty: 1, price: 55.0 },
      { name: 'Hydrating Glow Serum', qty: 1, price: 35.0 },
      { name: 'Rosewater Facial Toner', qty: 1, price: 18.0 },
    ],
  },
  {
    id: 'ORD-004',
    customer: 'Jessica Smith',
    email: 'jessica.s@example.com',
    phone: '+1 (555) 777-8888',
    date: '2026-07-12',
    total: 22.0,
    status: 'Pending',
    address: '321 Pine Blvd, Austin, TX 78701',
    deliveryNote: '',
    paymentType: 'Cash on Delivery (COD)',
    items: [
      { name: 'Gentle Foaming Cleanser', qty: 1, price: 22.0 },
    ],
  },
  {
    id: 'ORD-005',
    customer: 'Amanda Lee',
    email: 'amanda.l@example.com',
    phone: '+1 (555) 999-0000',
    date: '2026-07-13',
    total: 135.0,
    status: 'Processing',
    address: '654 Maple Drive, Seattle, WA 98101',
    deliveryNote: 'Deliver in the afternoon.',
    paymentType: 'Apple Pay',
    items: [
      { name: 'Overnight Repair Mask', qty: 1, price: 55.0 },
      { name: 'Hydrating Glow Serum', qty: 1, price: 35.0 },
      { name: 'Vitamin C Brightening Moisturizer', qty: 1, price: 45.0 },
    ],
  },
];

// ─── Messages ───
export const messagesData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', subject: 'Shipping Inquiry', message: 'How long does shipping take to New York? I placed an order two days ago and would love to know the estimated delivery time. Also, do you offer express shipping options?', date: '2026-07-12', read: false },
  { id: 2, name: 'Maria Garcia', email: 'maria.g@example.com', subject: 'Product Question', message: 'Is the Glow Serum safe for sensitive skin? I have rosacea and I want to make sure the ingredients won\'t cause any irritation. Could you share the full ingredient list?', date: '2026-07-11', read: true },
  { id: 3, name: 'David Smith', email: 'david.smith@example.com', subject: 'Return Policy', message: 'I want to return an unopened moisturizer. What is the process? I purchased it last week but realized I already have a similar product. Is there a restocking fee?', date: '2026-07-10', read: true },
  { id: 4, name: 'Aisha Rahman', email: 'aisha.r@example.com', subject: 'Wholesale Inquiry', message: 'Hi, I run a small beauty boutique and I\'m interested in carrying your products. Do you offer wholesale pricing for retailers? I\'d love to discuss a potential partnership.', date: '2026-07-13', read: false },
];

// ─── Store Settings (extended with hero banner, rich about us, contact location) ───
export const storeSettings = {
  name: 'SkinCare Elegance',
  logoUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  about: {
    sec1Title: 'A House Built on the Quiet Luxury of Ritual',
    sec1Subtitle: 'HE was born from a simple belief: that the most beautiful moments of the day are the ones we keep for ourselves.',
    
    sec2Title: 'Crafted Slowly, Worn Lightly',
    sec2Subtitle: 'Each HE formula begins in small ateliers where botanicals are pressed, distilled, and folded into featherweight textures.',
    sec2ImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    
    sec3Title: 'Fewer, Finer, Forever',
    sec3Subtitle: 'We believe in fewer products, finer ingredients, and rituals that last forever. Every bottle is refillable.',
    sec3ImageUrl: 'https://images.unsplash.com/photo-1608248593842-8d76db8682a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  hero: {
    title: 'Discover Your Glow',
    subtitle: 'Premium skincare crafted with nature\'s finest ingredients',
    leftBottleUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rightBottleUrl: 'https://images.unsplash.com/photo-1608248593842-8d76db8682a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  contact: {
    email: 'hello@skincareelegance.com',
    phone: '+1 (555) 123-4567',
    instagram: '@skincare_elegance',
    whatsapp: '+1 (555) 987-6543',
    location: '123 Fifth Avenue, New York, NY 10010',
  },
  testimonials: [
    {
      id: 1,
      type: 'text',
      author: 'Amira K.',
      quote: 'The Signature Body Splash is pure luxury. The scent is delicate yet lasts all day, and my skin has never felt softer. It\'s become my daily ritual.',
      rating: 5,
      screenshotUrl: '',
    }
  ],
};

// ─── Overview Analytics ───
export const overviewAnalytics = {
  totalVisits: 12450,
  totalOrders: 342,
  totalRevenue: 15400.5,
  activeUsers: 89,
  salesData: [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ],
};

// ─── Notifications ───
export const notificationsData = [
  { id: 1, type: 'order', message: 'New order #ORD-005 received from Amanda Lee', time: '2 min ago', read: false },
  { id: 2, type: 'stock', message: 'Low stock alert: Overnight Repair Mask (45 left)', time: '1 hour ago', read: false },
  { id: 3, type: 'message', message: 'New message from Aisha Rahman: Wholesale Inquiry', time: '3 hours ago', read: false },
  { id: 4, type: 'order', message: 'Order #ORD-003 has been shipped', time: '5 hours ago', read: true },
  { id: 5, type: 'order', message: 'Order #ORD-001 delivered successfully', time: '1 day ago', read: true },
];

// ─── Categories ───
export const categoriesData = ['Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Toners'];

// ─── Payment Types ───
export const paymentTypesData = ['Cash on Delivery (COD)', 'Credit Card', 'PayPal', 'Apple Pay'];
