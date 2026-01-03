// Enhanced product data structure with subcategories
export const categories = [
  { 
    id: 'coffee', 
    name: 'Coffee & Beverages', 
    icon: '☕', 
    description: 'Premium Ethiopian coffee and traditional drinks',
    subcategories: [
      { id: 'single-origin', name: 'Single Origin Coffee', description: 'Premium single-origin beans from specific regions' },
      { id: 'blends', name: 'Coffee Blends', description: 'Expertly crafted coffee blends' },
      { id: 'accessories', name: 'Coffee Accessories', description: 'Traditional brewing equipment and accessories' },
      { id: 'traditional-drinks', name: 'Traditional Beverages', description: 'Honey wine, tej, and other traditional drinks' }
    ]
  },
  { 
    id: 'food', 
    name: 'Food & Spices', 
    icon: '🌶️', 
    description: 'Traditional foods, spices, and ingredients',
    subcategories: [
      { id: 'spices-seasonings', name: 'Spices & Seasonings', description: 'Berbere, mitmita, and traditional spice blends' },
      { id: 'grains-flours', name: 'Grains & Flours', description: 'Teff, barley, and other Ethiopian grains' },
      { id: 'ready-meals', name: 'Ready-to-Eat', description: 'Fresh injera, prepared foods, and snacks' },
      { id: 'honey-sweeteners', name: 'Honey & Sweeteners', description: 'Pure Ethiopian honey and natural sweeteners' },
      { id: 'oils-condiments', name: 'Oils & Condiments', description: 'Traditional cooking oils and condiments' }
    ]
  },
  { 
    id: 'home', 
    name: 'Home & Living', 
    icon: '🏠', 
    description: 'Handcrafted home decor and furniture',
    subcategories: [
      { id: 'baskets-storage', name: 'Baskets & Storage', description: 'Handwoven baskets, mesob, and storage solutions' },
      { id: 'textiles-fabrics', name: 'Textiles & Fabrics', description: 'Traditional fabrics, throws, and cushions' },
      { id: 'furniture', name: 'Furniture', description: 'Handcrafted wooden furniture and seating' },
      { id: 'decorative-items', name: 'Decorative Items', description: 'Wall art, sculptures, and ornamental pieces' },
      { id: 'lighting', name: 'Lighting', description: 'Traditional lamps and modern lighting solutions' }
    ]
  },
  { 
    id: 'fashion', 
    name: 'Fashion & Accessories', 
    icon: '👗', 
    description: 'Traditional and modern Ethiopian fashion',
    subcategories: [
      { id: 'traditional-clothing', name: 'Traditional Clothing', description: 'Habesha kemis, netela, and cultural attire' },
      { id: 'modern-fashion', name: 'Modern Fashion', description: 'Contemporary clothing with Ethiopian influences' },
      { id: 'footwear', name: 'Footwear', description: 'Handmade leather shoes and traditional sandals' },
      { id: 'jewelry-accessories', name: 'Jewelry & Accessories', description: 'Traditional jewelry, bags, and accessories' },
      { id: 'mens-wear', name: "Men's Wear", description: 'Traditional and modern clothing for men' }
    ]
  },
  { 
    id: 'crafts', 
    name: 'Arts & Crafts', 
    icon: '🎨', 
    description: 'Handmade crafts and artistic pieces',
    subcategories: [
      { id: 'pottery-ceramics', name: 'Pottery & Ceramics', description: 'Handmade pottery, jebena, and ceramic art' },
      { id: 'wood-crafts', name: 'Wood Crafts', description: 'Carved wooden items and sculptures' },
      { id: 'metalwork', name: 'Metalwork', description: 'Traditional metalwork and jewelry' },
      { id: 'paintings-art', name: 'Paintings & Art', description: 'Traditional paintings and contemporary art' },
      { id: 'musical-instruments', name: 'Musical Instruments', description: 'Traditional Ethiopian musical instruments' }
    ]
  },
  { 
    id: 'beauty', 
    name: 'Beauty & Wellness', 
    icon: '💄', 
    description: 'Natural beauty and wellness products',
    subcategories: [
      { id: 'skincare', name: 'Skincare', description: 'Natural skincare products and treatments' },
      { id: 'haircare', name: 'Hair Care', description: 'Traditional hair oils and treatments' },
      { id: 'aromatherapy', name: 'Aromatherapy', description: 'Essential oils and incense' },
      { id: 'wellness', name: 'Wellness Products', description: 'Natural health and wellness items' },
      { id: 'traditional-medicine', name: 'Traditional Medicine', description: 'Herbal remedies and traditional treatments' }
    ]
  }
]

export const brands = [
  { id: 'zembile-select', name: 'Zembile Select', description: 'Our premium curated collection' },
  { id: 'addis-artisan', name: 'Addis Artisan', description: 'Handcrafted in Addis Ababa' },
  { id: 'highland-harvest', name: 'Highland Harvest', description: 'From Ethiopian highlands' },
  { id: 'traditional-craft', name: 'Traditional Craft Co.', description: 'Preserving Ethiopian traditions' }
]

export const products = [
  {
    id: 1,
    name: 'Ethiopian Coffee - Yirgacheffe Single Origin',
    shortName: 'Yirgacheffe Coffee',
    description: 'Premium single-origin Yirgacheffe coffee with floral and tea-like notes, medium roast. Sourced directly from highland farmers.',
    shortDescription: 'Single-origin Yirgacheffe, floral notes, medium roast',
    price: 450,
    originalPrice: 520,
    discount: 13,
    category: 'coffee',
    subcategory: 'single-origin',
    brand: 'highland-harvest',
    sku: 'YRG-250-MR',
    weight: '250g',
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewCount: 127,
    images: [
      'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Single Origin', 'Medium Roast', 'Floral Notes', 'Fair Trade', 'Organic'],
    specifications: {
      'Origin': 'Yirgacheffe, Ethiopia',
      'Altitude': '1,700-2,200m',
      'Processing': 'Washed',
      'Roast Level': 'Medium',
      'Acidity': 'Bright',
      'Body': 'Light to Medium'
    },
    tags: ['premium', 'bestseller', 'organic'],
    shippingInfo: 'Free shipping on orders over 500 ETB'
  },
  {
    id: 2,
    name: 'Traditional Handwoven Basket (Mesob)',
    shortName: 'Mesob Basket',
    description: 'Authentic handwoven mesob basket perfect for serving injera or as an elegant decorative piece. Made by skilled artisans using traditional techniques.',
    shortDescription: 'Handwoven mesob basket for serving injera',
    price: 1200,
    originalPrice: 1400,
    discount: 14,
    category: 'home',
    subcategory: 'baskets-storage',
    brand: 'traditional-craft',
    sku: 'MSB-LRG-001',
    dimensions: '35cm diameter x 8cm height',
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Handwoven', 'Traditional Design', 'Food Safe', 'Durable', 'Authentic'],
    specifications: {
      'Material': 'Natural Grass & Palm Leaves',
      'Diameter': '35cm',
      'Height': '8cm',
      'Care': 'Wipe clean with damp cloth',
      'Origin': 'Handmade in Ethiopia'
    },
    tags: ['handmade', 'traditional', 'home-decor'],
    shippingInfo: 'Carefully packaged for safe delivery'
  },
  {
    id: 3,
    name: 'Fresh Injera Pack (Family Size)',
    shortName: 'Injera Pack',
    description: 'Fresh, soft injera made from 100% teff flour. Perfect for family meals and authentic Ethiopian dining experience.',
    shortDescription: 'Fresh injera packs — perfect for family meals',
    price: 200,
    originalPrice: 200,
    discount: 0,
    category: 'food',
    subcategory: 'ready-meals',
    brand: 'zembile-select',
    sku: 'INJ-FAM-5PC',
    weight: '5 pieces',
    inStock: true,
    stockCount: 25,
    rating: 4.6,
    reviewCount: 203,
    images: [
      'https://images.unsplash.com/photo-1604908812873-1a6b8b6c0df8?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['100% Teff', 'Fresh Daily', 'Gluten-Free', 'Traditional Recipe', 'Family Size'],
    specifications: {
      'Ingredients': '100% Teff Flour, Water, Starter Culture',
      'Quantity': '5 pieces',
      'Shelf Life': '3 days refrigerated',
      'Allergens': 'None',
      'Storage': 'Keep refrigerated'
    },
    tags: ['fresh', 'daily-made', 'gluten-free'],
    shippingInfo: 'Same-day delivery available in Addis Ababa'
  },
  {
    id: 4,
    name: 'Pure Ethiopian Highland Honey',
    shortName: 'Highland Honey',
    description: 'Raw, unfiltered Ethiopian honey from highland apiaries. Rich in flavor with natural enzymes and minerals intact.',
    shortDescription: 'Raw, unfiltered Ethiopian honey from highland apiaries',
    price: 650,
    originalPrice: 750,
    discount: 13,
    category: 'food',
    subcategory: 'honey-sweeteners',
    brand: 'highland-harvest',
    sku: 'HNY-500-RAW',
    weight: '500g',
    inStock: true,
    stockCount: 38,
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Raw & Unfiltered', 'Highland Source', 'Natural Enzymes', 'No Additives', 'Glass Jar'],
    specifications: {
      'Source': 'Ethiopian Highlands (2000m+)',
      'Processing': 'Raw, Unfiltered',
      'Moisture': '<18%',
      'Packaging': 'Glass Jar',
      'Shelf Life': '2 years'
    },
    tags: ['organic', 'raw', 'natural'],
    shippingInfo: 'Secure packaging to prevent breakage'
  },
  {
    id: 5,
    name: 'Handmade Leather Sandals - Traditional Style',
    shortName: 'Leather Sandals',
    description: 'Durable, hand-stitched leather sandals crafted by local artisans using traditional Ethiopian techniques. Comfortable for daily wear.',
    shortDescription: 'Durable, hand-stitched leather sandals by local artisans',
    price: 1800,
    originalPrice: 2100,
    discount: 14,
    category: 'fashion',
    subcategory: 'footwear',
    brand: 'addis-artisan',
    sku: 'SND-LEA-M42',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    inStock: true,
    stockCount: 18,
    rating: 4.5,
    reviewCount: 74,
    images: [
      'https://images.unsplash.com/photo-1519741491840-0b0f6a3b36b4?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Hand-Stitched', 'Genuine Leather', 'Traditional Design', 'Comfortable Sole', 'Durable'],
    specifications: {
      'Material': '100% Genuine Leather',
      'Sole': 'Rubber with Traditional Pattern',
      'Sizes': '38-44 EU',
      'Care': 'Clean with leather conditioner',
      'Origin': 'Handmade in Addis Ababa'
    },
    tags: ['handmade', 'leather', 'traditional'],
    shippingInfo: 'Size exchange available within 7 days'
  },
  {
    id: 6,
    name: 'Ethiopian Spices Premium Gift Set',
    shortName: 'Spice Gift Set',
    description: 'Curated collection of authentic Ethiopian spices including berbere, mitmita, and other traditional blends in an elegant gift box.',
    shortDescription: 'Berbere, mitmita and other curated spices in gift box',
    price: 950,
    originalPrice: 1100,
    discount: 14,
    category: 'food',
    subcategory: 'spices-seasonings',
    brand: 'zembile-select',
    sku: 'SPC-GFT-SET',
    weight: '6 x 50g containers',
    inStock: true,
    stockCount: 22,
    rating: 4.8,
    reviewCount: 91,
    images: [
      'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['6 Spice Varieties', 'Gift Box', 'Recipe Cards', 'Freshly Ground', 'Authentic Blends'],
    specifications: {
      'Contents': 'Berbere, Mitmita, Korerima, Fenugreek, Turmeric, Black Cumin',
      'Quantity': '6 x 50g containers',
      'Packaging': 'Premium Gift Box',
      'Shelf Life': '18 months',
      'Origin': 'Traditional Ethiopian Recipes'
    },
    tags: ['gift-set', 'premium', 'authentic'],
    shippingInfo: 'Perfect for gifting - elegant packaging included'
  },
  {
    id: 7,
    name: 'Handwoven Cotton Throw Blanket',
    shortName: 'Cotton Throw',
    description: 'Cozy handwoven cotton throw featuring traditional Ethiopian patterns. Perfect for home decoration or keeping warm.',
    shortDescription: 'Cozy cotton throw with traditional patterns',
    price: 2200,
    originalPrice: 2500,
    discount: 12,
    category: 'home',
    subcategory: 'textiles-fabrics',
    brand: 'traditional-craft',
    sku: 'THR-COT-TRD',
    dimensions: '150cm x 200cm',
    inStock: true,
    stockCount: 8,
    rating: 4.6,
    reviewCount: 45,
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Handwoven', '100% Cotton', 'Traditional Patterns', 'Machine Washable', 'Soft Texture'],
    specifications: {
      'Material': '100% Cotton',
      'Dimensions': '150cm x 200cm',
      'Weight': '800g',
      'Care': 'Machine wash cold, air dry',
      'Pattern': 'Traditional Ethiopian Motifs'
    },
    tags: ['handwoven', 'cotton', 'home-decor'],
    shippingInfo: 'Folded and packaged in protective bag'
  },
  {
    id: 8,
    name: 'Ethiopian Ceramic Coffee Pot (Jebena)',
    shortName: 'Jebena Coffee Pot',
    description: 'Authentic handmade ceramic jebena for traditional Ethiopian coffee brewing. Essential for the Ethiopian coffee ceremony.',
    shortDescription: 'Classic jebena for authentic Ethiopian coffee brewing',
    price: 750,
    originalPrice: 850,
    discount: 12,
    category: 'coffee',
    subcategory: 'accessories',
    brand: 'traditional-craft',
    sku: 'JEB-CER-MED',
    capacity: '500ml',
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviewCount: 68,
    images: [
      'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80&auto=format&fit=crop&sig=8',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Handmade Ceramic', 'Traditional Design', 'Heat Resistant', 'Authentic Shape', 'Cultural Heritage'],
    specifications: {
      'Material': 'Traditional Clay Ceramic',
      'Capacity': '500ml (3-4 cups)',
      'Height': '25cm',
      'Care': 'Hand wash only',
      'Origin': 'Handcrafted in Ethiopia'
    },
    tags: ['traditional', 'ceramic', 'coffee-ceremony'],
    shippingInfo: 'Carefully packaged with bubble wrap'
  },
  {
    id: 9,
    name: 'Organic Teff Flour - Premium Grade',
    shortName: 'Teff Flour',
    description: 'Locally milled organic teff flour from highland-grown teff. Perfect for making injera, bread, and gluten-free baking.',
    shortDescription: 'Locally milled teff flour — perfect for injera and baking',
    price: 400,
    originalPrice: 450,
    discount: 11,
    category: 'food',
    subcategory: 'grains-flours',
    brand: 'highland-harvest',
    sku: 'TFF-ORG-1KG',
    weight: '1kg',
    inStock: true,
    stockCount: 67,
    rating: 4.5,
    reviewCount: 134,
    images: [
      'https://images.unsplash.com/photo-1542444459-db6f9b2e4d28?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['100% Organic', 'Gluten-Free', 'High Protein', 'Locally Sourced', 'Finely Milled'],
    specifications: {
      'Ingredients': '100% Organic Teff',
      'Protein': '13-14%',
      'Fiber': '8%',
      'Gluten': 'Naturally Gluten-Free',
      'Storage': 'Cool, dry place'
    },
    tags: ['organic', 'gluten-free', 'protein-rich'],
    shippingInfo: 'Sealed packaging for freshness'
  },
  {
    id: 10,
    name: 'Artisan Coffee Sampler - Three Origins',
    shortName: 'Coffee Sampler',
    description: 'Curated sampler featuring three distinct micro-lots from Ethiopia\'s top coffee regions. Perfect for coffee enthusiasts.',
    shortDescription: 'Sampler of three micro-lots from top Ethiopian regions',
    price: 1200,
    originalPrice: 1350,
    discount: 11,
    category: 'coffee',
    subcategory: 'single-origin',
    brand: 'highland-harvest',
    sku: 'CFS-SMP-3X100',
    weight: '3 x 100g',
    inStock: true,
    stockCount: 28,
    rating: 4.9,
    reviewCount: 87,
    images: [
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Three Origins', 'Micro-Lots', 'Tasting Notes', 'Premium Quality', 'Gift Box'],
    specifications: {
      'Origins': 'Yirgacheffe, Sidamo, Harrar',
      'Roast': 'Medium',
      'Processing': 'Washed & Natural',
      'Packaging': '3 x 100g bags in gift box',
      'Tasting Notes': 'Included with each origin'
    },
    tags: ['sampler', 'premium', 'gift-worthy'],
    shippingInfo: 'Elegant gift box packaging included'
  },
  {
    id: 11,
    name: 'Traditional Ethiopian Shawl (Netela)',
    shortName: 'Netela Shawl',
    description: 'Elegant handwoven netela shawl with traditional border patterns. Perfect for special occasions or daily wear.',
    shortDescription: 'Handwoven netela with traditional patterns',
    price: 1650,
    originalPrice: 1900,
    discount: 13,
    category: 'fashion',
    subcategory: 'traditional-clothing',
    brand: 'traditional-craft',
    sku: 'NET-WHT-TRD',
    dimensions: '200cm x 100cm',
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['Handwoven', 'Traditional Borders', 'Pure Cotton', 'Lightweight', 'Versatile'],
    specifications: {
      'Material': '100% Cotton',
      'Dimensions': '200cm x 100cm',
      'Weight': '200g',
      'Care': 'Hand wash or gentle machine wash',
      'Pattern': 'Traditional Ethiopian Border'
    },
    tags: ['traditional', 'handwoven', 'elegant'],
    shippingInfo: 'Folded in tissue paper for protection'
  },
  {
    id: 12,
    name: 'Natural Shea Butter - Ethiopian Source',
    shortName: 'Shea Butter',
    description: 'Pure, unrefined shea butter sourced from Ethiopian shea trees. Perfect for skincare and natural beauty routines.',
    shortDescription: 'Pure, unrefined shea butter for natural skincare',
    price: 380,
    originalPrice: 420,
    discount: 10,
    category: 'beauty',
    subcategory: 'skincare',
    brand: 'highland-harvest',
    sku: 'SHB-NAT-200G',
    weight: '200g',
    inStock: true,
    stockCount: 42,
    rating: 4.6,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop'
    ],
    features: ['100% Pure', 'Unrefined', 'Natural Moisturizer', 'No Additives', 'Sustainable Source'],
    specifications: {
      'Purity': '100% Pure Shea Butter',
      'Processing': 'Cold-pressed, Unrefined',
      'Source': 'Ethiopian Shea Trees',
      'Shelf Life': '2 years',
      'Uses': 'Face, Body, Hair Care'
    },
    tags: ['natural', 'organic', 'skincare'],
    shippingInfo: 'Temperature-controlled shipping in hot weather'
  }
]

// Helper functions for filtering and searching
export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.category === categoryId)
}

export const getProductsBySubcategory = (categoryId, subcategoryId) => {
  return products.filter(product => 
    product.category === categoryId && product.subcategory === subcategoryId
  )
}

export const getSubcategoriesByCategory = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.subcategories : []
}

export const getCategoryById = (categoryId) => {
  return categories.find(cat => cat.id === categoryId)
}

export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId)
  if (!category) return null
  return category.subcategories.find(sub => sub.id === subcategoryId)
}

export const getFeaturedProducts = () => {
  return products.filter(product => product.tags.includes('bestseller') || product.rating >= 4.7)
}

export const getDiscountedProducts = () => {
  return products.filter(product => product.discount > 0)
}

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id))
}

// Mock reviews data
export const getProductReviews = (productId) => {
  const reviewTemplates = [
    { rating: 5, text: "Excellent quality! Exactly as described and fast delivery.", author: "Meron A." },
    { rating: 4, text: "Very good product, would recommend to others.", author: "Dawit M." },
    { rating: 5, text: "Authentic Ethiopian quality. Love supporting local artisans!", author: "Sara T." },
    { rating: 4, text: "Great value for money. Will order again.", author: "Yonas K." },
    { rating: 5, text: "Perfect for gifts. Beautiful packaging and quality.", author: "Hanan S." }
  ]
  
  return reviewTemplates.slice(0, Math.floor(Math.random() * 3) + 2)
}
