/**
 * Main API - Now using Supabase Cloud Backend
 * Data stored in Supabase database instead of localStorage
 */

import { supabaseApi } from './supabaseApi';
import { storageApi } from './storage';

// Use Supabase API
export const api = {
  // Products
  getProducts: async () => {
    return await supabaseApi.getProducts();
  },

  getProduct: async (id: string) => {
    return await supabaseApi.getProduct(id);
  },

  getFeaturedProducts: async () => {
    return await supabaseApi.getFeaturedProducts();
  },

  // Categories
  getCategories: async () => {
    return await supabaseApi.getCategories();
  },

  getProductsByCategory: async (slug: string) => {
    return await supabaseApi.getProductsByCategory(slug);
  },

  // Orders
  createOrder: async (orderData: any) => {
    return await supabaseApi.createOrder(orderData);
  },

  getOrder: async (id: string) => {
    return await supabaseApi.getOrder(id);
  },

  // Seed data
  seedDatabase: async (seedData: any) => {
    return await supabaseApi.seedDatabase(seedData);
  },

  // Health check
  checkHealth: async () => {
    return await supabaseApi.checkHealth();
  },

  // Get current mode
  getMode: () => {
    return 'cloud';
  },

  // ============= ADMIN ENDPOINTS =============
  
  admin: {
    // Products
    createProduct: async (productData: any) => {
      return await supabaseApi.admin.createProduct(productData);
    },

    updateProduct: async (id: string, productData: any) => {
      return await supabaseApi.admin.updateProduct(id, productData);
    },

    deleteProduct: async (id: string) => {
      return await supabaseApi.admin.deleteProduct(id);
    },

    // Categories
    createCategory: async (categoryData: any) => {
      return await supabaseApi.admin.createCategory(categoryData);
    },

    updateCategory: async (slug: string, categoryData: any) => {
      return await supabaseApi.admin.updateCategory(slug, categoryData);
    },

    deleteCategory: async (slug: string) => {
      return await supabaseApi.admin.deleteCategory(slug);
    },

    // Orders
    getAllOrders: async () => {
      return await supabaseApi.admin.getAllOrders();
    },

    // Users
    getAllUsers: async () => {
      return await supabaseApi.admin.getAllUsers();
    },
  },
};

// Migration utilities - move localStorage data to Supabase
export const migration = {
  // Check if localStorage has data
  hasLocalData: () => {
    try {
      const products = localStorage.getItem('vivere_products');
      const categories = localStorage.getItem('vivere_categories');
      return !!(products || categories);
    } catch {
      return false;
    }
  },

  // Get localStorage data
  getLocalData: async () => {
    const products = await storageApi.getProducts();
    const categories = await storageApi.getCategories();
    return { products, categories };
  },

  // Migrate localStorage to Supabase
  migrateToSupabase: async () => {
    try {
      const localData = await migration.getLocalData();
      
      if (localData.products.length === 0 && localData.categories.length === 0) {
        return {
          success: false,
          message: 'No local data to migrate',
        };
      }

      // Upload to Supabase
      const result = await api.seedDatabase(localData);
      
      return {
        success: true,
        message: `Migrated ${localData.categories.length} categories and ${localData.products.length} products`,
        ...result,
      };
    } catch (error) {
      console.error('Migration error:', error);
      return {
        success: false,
        message: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      };
    }
  },

  // Clear localStorage after successful migration
  clearLocalData: () => {
    try {
      localStorage.removeItem('vivere_products');
      localStorage.removeItem('vivere_categories');
      localStorage.removeItem('vivere_orders');
      return true;
    } catch {
      return false;
    }
  },
};