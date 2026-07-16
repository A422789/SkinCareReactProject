// products.js - Product data and helper functions

export const products = [
  {
    id: 'body-splash',
    slug: 'signature-body-splash',
    name: 'Signature Body Splash',
    tagline: 'Light · Fresh · Refreshing',
    category: 'Body Splash',
    price: 38,
    image: import.meta.env.BASE_URL + 'images/body-splash.jpg',
    description:
      'A refreshing brume parfumée that leaves your skin lightly perfumed all day. Delicate notes of white florals and warm amber settle into a soft, radiant veil — for all skin types.',
    ingredients:
      'Aqua, Glycerin, Parfum, White Jasmine Extract, Amber Accord, Aloe Barbadensis Leaf Juice, Panthenol, Tocopherol (Vitamin E).',
    howToUse:
      'Mist generously over the body after showering or whenever you desire a moment of freshness. Hold 15cm from skin and spray in light, sweeping motions. Layer with the HE Body Cream for a longer-lasting scent.',
    isBestSeller: true,
    size: '250 ML ℮ 8.4 FL.OZ',
  },
  {
    id: 'serum',
    slug: 'hydrating-serum',
    name: 'Hydrating Serum',
    tagline: 'Hydrate · Repair · Renew',
    category: 'Serum',
    price: 62,
    image: import.meta.env.BASE_URL + 'images/serum.jpg',
    description:
      'A featherweight elixir with Hyaluronic Acid and Niacinamide that drenches skin in moisture, refines texture, and restores a luminous, glass-like finish overnight.',
    ingredients:
      'Aqua, Sodium Hyaluronate (Hyaluronic Acid), Niacinamide 5%, Glycerin, Panthenol, Centella Asiatica Extract, Allantoin, Sodium PCA.',
    howToUse:
      'Apply 3–4 drops to cleansed skin morning and evening. Press gently into the face and neck with fingertips. Follow with moisturizer. Use SPF during the day.',
    isBestSeller: true,
    size: '30 ML ℮ 1.01 FL.OZ',
  },
  {
    id: 'rose-splash',
    slug: 'rose-body-splash',
    name: 'Rose Body Splash',
    tagline: 'Soft · Romantic · Dewy',
    category: 'Body Splash',
    price: 42,
    image: import.meta.env.BASE_URL + 'images/rose-splash.png',
    description:
      'The newest addition to the HE collection. Velvety Damask rose petals folded into a dewy mist with hints of pink pepper and musk — a modern romance for the skin.',
    ingredients:
      'Aqua, Glycerin, Parfum, Rosa Damascena Flower Water, Pink Pepper Extract, White Musk Accord, Aloe Barbadensis Leaf Juice, Panthenol.',
    howToUse:
      'Spray onto pulse points and décolletage after bathing. Reapply throughout the day for a soft, rosy aura. Pairs beautifully with the Rose Renewal Serum.',
    isNew: true,
    isRoseLine: true,
    size: '250 ML ℮ 8.4 FL.OZ',
  },
  {
    id: 'rose-serum',
    slug: 'rose-renewal-serum',
    name: 'Rose Renewal Serum',
    tagline: 'Calm · Restore · Glow',
    category: 'Serum',
    price: 68,
    image: import.meta.env.BASE_URL + 'images/rose-serum.png',
    description:
      'A calming rose-infused serum from our new Rose line. Rosehip oil and squalane comfort sensitive skin while peptides encourage a plump, petal-soft glow.',
    ingredients:
      'Aqua, Rosa Canina (Rosehip) Seed Oil, Squalane, Rosa Damascena Flower Extract, Palmitoyl Tripeptide-1, Glycerin, Bisabolol, Tocopherol.',
    howToUse:
      'Warm 2–3 drops between palms and press onto the face after cleansing, morning and night. Ideal for sensitive or redness-prone skin.',
    isNew: true,
    isRoseLine: true,
    size: '30 ML ℮ 1.01 FL.OZ',
  },
  {
    id: 'body-cream',
    slug: 'velvet-body-cream',
    name: 'Velvet Body Cream',
    tagline: 'Nourish · Soften · Wrap',
    category: 'Skincare',
    price: 48,
    compareAtPrice: 58,
    image: import.meta.env.BASE_URL + 'images/body-cream.png',
    description:
      'A rich, cocooning cream that melts into skin with shea butter and jasmine wax. Skin is left cashmere-soft, deeply nourished, and delicately scented.',
    ingredients:
      'Aqua, Butyrospermum Parkii (Shea) Butter, Jasminum Officinale Wax, Cetearyl Alcohol, Glycerin, Caprylic/Capric Triglyceride, Tocopherol.',
    howToUse:
      'Massage generously over the body after showering, focusing on elbows, knees, and dry areas. Layer under the Signature Body Splash to extend the fragrance.',
    isBestSeller: true,
    size: '200 ML ℮ 6.7 FL.OZ',
  },
  {
    id: 'face-mist',
    slug: 'radiance-face-mist',
    name: 'Radiance Face Mist',
    tagline: 'Refresh · Tone · Illuminate',
    category: 'Skincare',
    price: 32,
    compareAtPrice: 40,
    image: import.meta.env.BASE_URL + 'images/face-mist.png',
    description:
      'A fine, weightless veil of botanical waters and glow-boosting minerals. Sets makeup, refreshes midday, and leaves a lit-from-within luminosity.',
    ingredients:
      'Aqua, Rosa Damascena Flower Water, Hamamelis Virginiana (Witch Hazel) Water, Glycerin, Sodium Hyaluronate, Mica, Allantoin.',
    howToUse:
      'Close eyes and mist 20cm from the face whenever skin needs a refresh — over or under makeup. Store in the fridge for an extra-cooling ritual.',
    size: '100 ML ℮ 3.4 FL.OZ',
  },
]

export function getProduct(slug) {
  return products.find((p) => p.slug === slug)
}

export function getRelatedProducts(product, count = 4) {
  return products.filter((p) => p.id !== product.id).slice(0, count)
}

export const newArrivals = products.filter((p) => p.isNew)
export const bestSellers = products.filter((p) => p.isBestSeller)
export const offers = products.filter((p) => p.compareAtPrice)

export function formatPrice(price) {
  return `$${price.toFixed(2)}`
}
