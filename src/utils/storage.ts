/**
 * Simple localStorage-based storage system
 * No backend needed - everything stored in browser
 */

const STORAGE_KEYS = {
  PRODUCTS: 'vivere_products',
  CATEGORIES: 'vivere_categories',
  ORDERS: 'vivere_orders',
};

// Helper to safely parse JSON from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return defaultValue;
  }
}

// Helper to save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

// Products
export const storageApi = {
  // Products
  getProducts: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getFromStorage(STORAGE_KEYS.PRODUCTS, []);
  },

  getProduct: async (id: string): Promise<any | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    return products.find((p: any) => p.id === id) || null;
  },

  getFeaturedProducts: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    return products.filter((p: any) => p.featured);
  },

  saveProducts: async (products: any[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  createProduct: async (product: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    
    // Generate ID if not provided
    if (!product.id) {
      product.id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    products.push(product);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  updateProduct: async (id: string, updates: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    const index = products.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products[index] = { ...products[index], ...updates, id };
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    const filtered = products.filter((p: any) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
  },

  // Categories
  getCategories: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return getFromStorage(STORAGE_KEYS.CATEGORIES, []);
  },

  getProductsByCategory: async (slug: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    return products.filter((p: any) => p.category === slug);
  },

  saveCategories: async (categories: any[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  },

  createCategory: async (category: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const categories = getFromStorage(STORAGE_KEYS.CATEGORIES, []);
    
    const exists = categories.find((c: any) => c.slug === category.slug);
    if (exists) {
      throw new Error('Category with this slug already exists');
    }
    
    categories.push(category);
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  updateCategory: async (slug: string, updates: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const categories = getFromStorage(STORAGE_KEYS.CATEGORIES, []);
    const index = categories.findIndex((c: any) => c.slug === slug);
    
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = { ...categories[index], ...updates, slug };
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },

  deleteCategory: async (slug: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const categories = getFromStorage(STORAGE_KEYS.CATEGORIES, []);
    const filtered = categories.filter((c: any) => c.slug !== slug);
    saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
  },

  // Orders
  getOrders: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return getFromStorage(STORAGE_KEYS.ORDERS, []);
  },

  createOrder: async (orderData: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, []);
    
    const order = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    orders.push(order);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  getOrder: async (id: string): Promise<any | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, []);
    return orders.find((o: any) => o.id === id) || null;
  },

  // Seed data
  seedDatabase: async (seedData: { categories: any[]; products: any[] }): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (seedData.categories) {
      saveToStorage(STORAGE_KEYS.CATEGORIES, seedData.categories);
    }
    
    if (seedData.products) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, seedData.products);
    }
    
    return {
      success: true,
      message: 'Data seeded successfully',
      categoriesSeeded: seedData.categories?.length || 0,
      productsSeeded: seedData.products?.length || 0,
    };
  },
};
