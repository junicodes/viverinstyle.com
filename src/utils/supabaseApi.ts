/**
 * Supabase Cloud Backend API
 * Connects to Supabase Edge Functions
 */

import { projectId, publicAnonKey } from './supabase/info';

// Supabase configuration
const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = publicAnonKey;
const BASE_URL = `${SUPABASE_URL}/functions/v1/make-server-35e920f3`;

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API call failed');
  }

  return data;
}

export const supabaseApi = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // Products
  getProducts: async () => {
    const data = await apiCall('/products');
    return data.products || [];
  },

  getProduct: async (id: string) => {
    const data = await apiCall(`/products/${id}`);
    return data.product;
  },

  getFeaturedProducts: async () => {
    const data = await apiCall('/products/featured/list');
    return data.products || [];
  },

  // Categories
  getCategories: async () => {
    const data = await apiCall('/categories');
    return data.categories || [];
  },

  getProductsByCategory: async (slug: string) => {
    const data = await apiCall(`/categories/${slug}/products`);
    return data.products || [];
  },

  // Orders
  createOrder: async (orderData: any) => {
    const data = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return data.order;
  },

  getOrder: async (id: string) => {
    const data = await apiCall(`/orders/${id}`);
    return data.order;
  },

  getShippingQuote: async (payload: { destinationPostcode: string; items: Array<{ productId: string; quantity: number }> }) => {
    const data = await apiCall('/shipping/quote', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.shipping;
  },

  // Seed data
  seedDatabase: async (seedData: any) => {
    const data = await apiCall('/seed', {
      method: 'POST',
      body: JSON.stringify(seedData),
    });
    return data;
  },

  // ============= ADMIN ENDPOINTS =============
  
  admin: {
    // Products
    createProduct: async (productData: any) => {
      const data = await apiCall('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return data.product;
    },

    updateProduct: async (id: string, productData: any) => {
      const data = await apiCall(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      return data.product;
    },

    deleteProduct: async (id: string) => {
      const data = await apiCall(`/admin/products/${id}`, {
        method: 'DELETE',
      });
      return data;
    },

    // Categories
    createCategory: async (categoryData: any) => {
      const data = await apiCall('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      return data.category;
    },

    updateCategory: async (slug: string, categoryData: any) => {
      const data = await apiCall(`/admin/categories/${slug}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      return data.category;
    },

    deleteCategory: async (slug: string) => {
      const data = await apiCall(`/admin/categories/${slug}`, {
        method: 'DELETE',
      });
      return data;
    },

    // Orders
    getAllOrders: async () => {
      const data = await apiCall('/admin/orders');
      return data.orders || [];
    },

    // Users
    getAllUsers: async () => {
      const accessToken = localStorage.getItem('accessToken');
      const data = await apiCall('/admin/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.users || [];
    },
  },
};