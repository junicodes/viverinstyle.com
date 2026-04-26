import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { projectId } from '../utils/supabase/info';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '../utils/supabase/client';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Settings,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Truck,
  FileText,
  Star,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import AddProductForm from '../components/admin/AddProductForm';
import AddBlogPostForm from '../components/admin/AddBlogPostForm';
import { DEFAULT_BLOG_POSTS } from '../data/defaultBlogPosts';
import OrderDetailsModal from '../components/admin/OrderDetailsModal';
import ProductDetailsModal from '../components/admin/ProductDetailsModal';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminDashboardProps {
  onNavigate?: (path: string, orderId?: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps = {}) {
  const { user, accessToken } = useStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductView, setShowAddProductView] = useState(false);
  const [showEditProductView, setShowEditProductView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Loading states for actions
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState<string | null>(null);
  
  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: [],
    popularProducts: [],
    categoryDistribution: [],
  });

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Blog states
  const [blogPosts, setBlogPosts] = useState([]);
  const [showAddBlogView, setShowAddBlogView] = useState(false);
  const [showEditBlogView, setShowEditBlogView] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<any>(null);
  const [isDeletingBlog, setIsDeletingBlog] = useState<string | null>(null);

  // Customer photos & testimonials states
  const [customerPhotos, setCustomerPhotos] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [newPhoto, setNewPhoto] = useState({ name: '', location: '', image: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', location: '', rating: '5', text: '', product: '', date: '' });
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Store settings
  const [defaultShipping, setDefaultShipping] = useState('149');
  const [savingSettings, setSavingSettings] = useState(false);

  // Discount codes
  const [discountCodes, setDiscountCodes] = useState<any[]>([]);
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrder: '',
    maxUses: '',
    productIds: '' as string,
    expiresAt: '',
  });

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const itemsPerPage = 100;

  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  // Product form data
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    image: '',
    images: '',
    stock: '',
    featured: false,
    dimensions: '',
    material: '',
    colors: '',
  });

  // Customer form data
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    role: 'customer',
  });

  useEffect(() => {
    console.log('AdminDashboard useEffect - user:', user?.email, 'role:', user?.role, 'accessToken:', accessToken ? 'present' : 'missing');
    
    if (!user || user.role !== 'admin') {
      console.log('User is not admin or not logged in');
      toast.error('Admin access required');
      return;
    }
    
    // Validate and refresh session if needed
    const validateSession = async () => {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('Session validation error:', error);
        toast.error('Session expired. Please log in again.');
        useStore.getState().logout();
        return;
      }
      
      // Update access token if it's different
      if (session.access_token !== accessToken) {
        console.log('Refreshing access token...');
        useStore.getState().setAccessToken(session.access_token);
      }
      
      console.log('Session validated, loading dashboard data...');
      loadDashboardData();
    };
    
    validateSession();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get fresh session token
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Session expired. Please log in again.');
        useStore.getState().logout();
        return;
      }
      
      const currentAccessToken = session.access_token;
      
      // Load analytics
      await loadAnalytics();
      
      // Load products
      await loadProducts();
      
      // Load orders
      await loadOrders();
      
      // Load customers
      await loadCustomers();
      
      // Load categories
      await loadCategories();
      
      // Load blog posts
      await loadBlogPosts();

      // Load customer photos, testimonials, store settings, and discounts
      await loadCustomerPhotos();
      await loadTestimonials();
      await loadStoreSettings();
      await loadDiscountCodes();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async () => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const loadAnalytics = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      console.log('Loading analytics with fresh token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Analytics response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics loaded:', data);
        setAnalytics(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to load analytics:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      console.log('Loading products with fresh token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Products response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products loaded:', data.products?.length || 0, 'products');
        console.log('Products data:', data.products);
        setProducts(data.products || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to load products:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      console.log('Loading orders with fresh token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Orders response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders loaded:', data.orders?.length || 0);
        setOrders(data.orders || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to load orders:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      console.log('Loading customers with fresh token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Customers response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Customers loaded:', data.users?.length || 0);
        setCustomers(data.users || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to load customers:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setBlogPosts(DEFAULT_BLOG_POSTS as any);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/blogs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setBlogPosts(data.posts);
        } else {
          setBlogPosts(DEFAULT_BLOG_POSTS as any);
        }
      } else {
        setBlogPosts(DEFAULT_BLOG_POSTS as any);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setBlogPosts(DEFAULT_BLOG_POSTS as any);
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      setIsDeletingBlog(postId);

      // If it's a default post (not in DB), just remove it from local state
      if (postId.startsWith('default-')) {
        setBlogPosts(prev => prev.filter((p: any) => p.id !== postId));
        toast.success('Blog post removed');
        return;
      }

      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      // Try server endpoint first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/blogs/${postId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        toast.success('Blog post deleted');
        loadBlogPosts();
      } else {
        // Fallback: try direct DB delete
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('kv_store_e9dccf07')
          .delete()
          .eq('key', `blog:${postId}`);
        if (!error) {
          toast.success('Blog post deleted');
          loadBlogPosts();
        } else {
          toast.error('Failed to delete blog post');
        }
      }
    } catch (error) {
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeletingBlog(null);
    }
  };

  const handleSaveBlogsToDatabase = async () => {
    const defaultPosts = blogPosts.filter((p: any) => p.id?.startsWith('default-'));
    if (defaultPosts.length === 0) {
      toast.info('All posts are already saved to the database');
      return;
    }

    try {
      const token = await getAccessToken();
      const supabase = getSupabaseClient();
      let saved = 0;

      for (const post of defaultPosts) {
        const newId = `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const postData = { ...post, id: newId };

        // Try server endpoint first
        if (token) {
          try {
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/blogs`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(postData),
              }
            );
            if (response.ok) { saved++; continue; }
          } catch {}
        }

        // Fallback: direct DB insert
        const { error } = await supabase
          .from('kv_store_e9dccf07')
          .upsert({ key: `blog:${newId}`, value: postData });
        if (!error) saved++;
      }

      if (saved > 0) {
        toast.success(`${saved} blog posts saved to database!`);
        loadBlogPosts();
      } else {
        toast.error('Could not save posts to database');
      }
    } catch (error) {
      toast.error('Failed to save posts');
    }
  };

  const loadStoreSettings = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.from('kv_store_e9dccf07').select('value').eq('key', 'settings:store').maybeSingle();
      if (data?.value?.defaultShipping !== undefined) {
        setDefaultShipping(data.value.defaultShipping.toString());
      }
    } catch {}
  };

  const saveStoreSettings = async () => {
    try {
      setSavingSettings(true);
      const supabase = getSupabaseClient();
      await supabase.from('kv_store_e9dccf07').upsert({
        key: 'settings:store',
        value: { defaultShipping: parseFloat(defaultShipping) || 0 },
      });
      toast.success('Shipping settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const loadDiscountCodes = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.from('kv_store_e9dccf07').select('value').like('key', 'discount:%');
      setDiscountCodes((data || []).map((d: any) => d.value));
    } catch {}
  };

  const handleAddDiscount = async () => {
    if (!newDiscount.code || !newDiscount.value) { toast.error('Code and value are required'); return; }
    try {
      setIsAddingDiscount(true);
      const supabase = getSupabaseClient();
      const discountData = {
        id: newDiscount.code.toUpperCase().replace(/\s/g, ''),
        code: newDiscount.code.toUpperCase().replace(/\s/g, ''),
        type: newDiscount.type,
        value: parseFloat(newDiscount.value),
        minOrder: newDiscount.minOrder ? parseFloat(newDiscount.minOrder) : 0,
        maxUses: newDiscount.maxUses ? parseInt(newDiscount.maxUses) : null,
        usedCount: 0,
        productIds: newDiscount.productIds ? newDiscount.productIds.split(',').map(s => s.trim()).filter(Boolean) : [],
        expiresAt: newDiscount.expiresAt || null,
        active: true,
        createdAt: new Date().toISOString(),
      };
      await supabase.from('kv_store_e9dccf07').upsert({ key: `discount:${discountData.code}`, value: discountData });
      toast.success(`Discount code ${discountData.code} created!`);
      setNewDiscount({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', productIds: '', expiresAt: '' });
      loadDiscountCodes();
    } catch { toast.error('Failed to create discount'); } finally { setIsAddingDiscount(false); }
  };

  const handleDeleteDiscount = async (code: string) => {
    if (!confirm(`Delete discount code ${code}?`)) return;
    try {
      const supabase = getSupabaseClient();
      await supabase.from('kv_store_e9dccf07').delete().eq('key', `discount:${code}`);
      toast.success('Discount deleted');
      loadDiscountCodes();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleDiscount = async (discount: any) => {
    try {
      const supabase = getSupabaseClient();
      const updated = { ...discount, active: !discount.active };
      await supabase.from('kv_store_e9dccf07').upsert({ key: `discount:${discount.code}`, value: updated });
      toast.success(updated.active ? 'Discount activated' : 'Discount deactivated');
      loadDiscountCodes();
    } catch { toast.error('Failed to update'); }
  };

  const loadCustomerPhotos = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/customer-photos`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) { const data = await response.json(); setCustomerPhotos(data.photos || []); }
    } catch (error) { console.error('Error loading customer photos:', error); }
  };

  const loadTestimonials = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/testimonials`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) { const data = await response.json(); setTestimonialsList(data.testimonials || []); }
    } catch (error) { console.error('Error loading testimonials:', error); }
  };

  const handleAddPhoto = async () => {
    if (!newPhoto.name || !newPhoto.image) { toast.error('Name and image URL required'); return; }
    try {
      setIsAddingPhoto(true);
      const token = await getAccessToken();
      if (!token) return;
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/customer-photos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPhoto),
      });
      if (response.ok) { toast.success('Customer photo added!'); setNewPhoto({ name: '', location: '', image: '' }); loadCustomerPhotos(); }
    } catch { toast.error('Failed to add photo'); } finally { setIsAddingPhoto(false); }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Delete this customer photo?')) return;
    const token = await getAccessToken();
    if (!token) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/customer-photos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    toast.success('Photo removed'); loadCustomerPhotos();
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) { toast.error('Name and review text required'); return; }
    try {
      setIsAddingTestimonial(true);
      const token = await getAccessToken();
      if (!token) return;
      const payload = { ...newTestimonial, rating: parseInt(newTestimonial.rating) || 5 };
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/testimonials`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (response.ok) { toast.success('Testimonial added!'); setNewTestimonial({ name: '', location: '', rating: '5', text: '', product: '', date: '' }); loadTestimonials(); }
    } catch { toast.error('Failed to add testimonial'); } finally { setIsAddingTestimonial(false); }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const token = await getAccessToken();
    if (!token) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    toast.success('Testimonial removed'); loadTestimonials();
  };

  const handleAddProduct = async () => {
    try {
      setIsAddingProduct(true);
      
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      // Generate slug from name if not provided
      const slug = productForm.slug || productForm.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...productForm,
            slug,
            price: parseFloat(productForm.price),
            stock: parseInt(productForm.stock),
            images: productForm.images.split(',').map(img => img.trim()).filter(Boolean),
            colors: productForm.colors.split(',').map(c => c.trim()).filter(Boolean),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Invalidate React Query cache to update customer-facing pages immediately
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
        toast.success('✅ Product added successfully! Now visible to customers.', {
          duration: 4000,
        });
        
        setShowAddProduct(false);
        resetProductForm();
        loadProducts();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('❌ Failed to add product. Please try again.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleEditProduct = async () => {
    try {
      setIsEditingProduct(true);
      
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/products/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...productForm,
            price: parseFloat(productForm.price),
            stock: parseInt(productForm.stock),
            images: typeof productForm.images === 'string' 
              ? productForm.images.split(',').map(img => img.trim()).filter(Boolean)
              : productForm.images,
            colors: typeof productForm.colors === 'string'
              ? productForm.colors.split(',').map(c => c.trim()).filter(Boolean)
              : productForm.colors,
          }),
        }
      );

      if (response.ok) {
        // Invalidate React Query cache to update customer-facing pages immediately
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
        toast.success('✅ Product updated successfully! Changes are now live.', {
          duration: 4000,
        });
        
        setShowEditProduct(false);
        resetProductForm();
        loadProducts();
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('❌ Failed to update product. Please try again.');
    } finally {
      setIsEditingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      setIsDeletingProduct(productId);
      
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Invalidate React Query cache to update customer-facing pages immediately
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
        toast.success('✅ Product deleted successfully! Removed from store.', {
          duration: 4000,
        });
        loadProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('❌ Failed to delete product. Please try again.');
    } finally {
      setIsDeletingProduct(null);
    }
  };

  const handleEditCustomer = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/users/${selectedCustomer.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerForm),
        }
      );

      if (response.ok) {
        toast.success('Customer updated successfully');
        setShowEditCustomer(false);
        setSelectedCustomer(null);
        loadCustomers();
      } else {
        throw new Error('Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/users/${customerId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Customer deleted successfully');
        loadCustomers();
      } else {
        throw new Error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      slug: '',
      description: '',
      price: '',
      category: '',
      image: '',
      images: '',
      stock: '',
      featured: false,
      dimensions: '',
      material: '',
      colors: '',
    });
    setSelectedProduct(null);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditProductView(true);
    
    // Old modal code - keeping for reference but not using
    /*setSelectedProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug || '',
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      stock: product.stock?.toString() || '0',
      featured: product.featured || false,
      dimensions: product.dimensions || '',
      material: product.material || '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
    });
    setShowEditProduct(true);*/
  };

  const openEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      role: customer.role,
    });
    setShowEditCustomer(true);
  };

  // Pagination helpers
  const paginate = (items: any[], page: number) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const getTotalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage);

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show Add Product view
  if (showAddProductView) {
    return (
      <AddProductForm
        categories={categories}
        onSuccess={() => {
          setShowAddProductView(false);
          loadDashboardData();
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
        onCancel={() => setShowAddProductView(false)}
      />
    );
  }

  // Show Edit Product view
  if (showEditProductView && editingProduct) {
    return (
      <AddProductForm
        accessToken={accessToken}
        categories={categories}
        product={editingProduct}
        onSuccess={() => {
          setShowEditProductView(false);
          setEditingProduct(null);
          loadDashboardData();
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
        onCancel={() => {
          setShowEditProductView(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  // Show Add Blog Post view
  if (showAddBlogView) {
    return (
      <AddBlogPostForm
        onSuccess={() => {
          setShowAddBlogView(false);
          loadBlogPosts();
        }}
        onCancel={() => setShowAddBlogView(false)}
      />
    );
  }

  // Show Edit Blog Post view
  if (showEditBlogView && editingBlogPost) {
    return (
      <AddBlogPostForm
        post={editingBlogPost}
        onSuccess={() => {
          setShowEditBlogView(false);
          setEditingBlogPost(null);
          loadBlogPosts();
        }}
        onCancel={() => {
          setShowEditBlogView(false);
          setEditingBlogPost(null);
        }}
      />
    );
  }

  // Filter products, orders, customers based on search
  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter((o: any) =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCustomers = customers.filter((c: any) =>
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBlogPosts = blogPosts.filter((p: any) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading && <LoadingOverlay message="Loading dashboard..." />}
      
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}. Here's what's happening with your store today.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Settings className="h-4 w-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${analytics.totalSales.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">From {analytics.totalOrders} orders</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalOrders}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalCustomers}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Registered users</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalProducts}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Active listings</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts - only show with real data */}
            {(analytics.salesData.length > 0 || analytics.popularProducts.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.salesData.length > 0 && (
              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Sales Overview</CardTitle>
                  <CardDescription>Monthly sales data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              )}

              {analytics.popularProducts.length > 0 && (
              <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Popular Products</CardTitle>
                  <CardDescription>Top selling products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.popularProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              )}
            </div>
            )}

            {/* Recent Orders */}
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Recent Orders</CardTitle>
                    <CardDescription>Latest orders from customers</CardDescription>
                  </div>
                  {orders.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to clear ALL orders? This cannot be undone.')) return;
                        try {
                          // Try direct database delete first
                          const supabase = getSupabaseClient();
                          const { error: directError } = await supabase
                            .from('kv_store_e9dccf07')
                            .delete()
                            .like('key', 'order:%');
                          
                          if (!directError) {
                            toast.success('All orders cleared!');
                            setOrders([]);
                            setAnalytics(prev => ({ ...prev, totalOrders: 0, totalSales: 0, salesData: [], recentOrders: [] }));
                            loadDashboardData();
                            return;
                          }

                          // Fallback: try the server endpoint
                          console.log('Direct delete blocked by RLS, trying server endpoint...');
                          const token = await getAccessToken();
                          if (!token) { toast.error('Session expired'); return; }
                          const response = await fetch(
                            `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/orders/clear-all`,
                            { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
                          );
                          if (response.ok) {
                            toast.success('All orders cleared!');
                            setOrders([]);
                            setAnalytics(prev => ({ ...prev, totalOrders: 0, totalSales: 0, salesData: [], recentOrders: [] }));
                            loadDashboardData();
                          } else {
                            // Last resort: delete each order individually via the KV key
                            console.log('Server endpoint failed, deleting individually...');
                            const orderKeys = orders.map((o: any) => o.id);
                            let deleted = 0;
                            for (const key of orderKeys) {
                              const { error: delErr } = await supabase
                                .from('kv_store_e9dccf07')
                                .delete()
                                .eq('key', key);
                              if (!delErr) deleted++;
                            }
                            if (deleted > 0) {
                              toast.success(`Cleared ${deleted} orders!`);
                              setOrders([]);
                              setAnalytics(prev => ({ ...prev, totalOrders: 0, totalSales: 0, salesData: [], recentOrders: [] }));
                              loadDashboardData();
                            } else {
                              toast.error('Could not clear orders. RLS may be blocking access. Please clear via Supabase dashboard SQL: DELETE FROM kv_store_e9dccf07 WHERE key LIKE \'order:%\'');
                            }
                          }
                        } catch (err: any) {
                          console.error('Clear orders error:', err);
                          toast.error('Failed: ' + (err?.message || 'Unknown error'));
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All Orders
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customerEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Products Management</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddProductView(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Stock</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(filteredProducts, productsPage).map((product: any) => (
                        <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                                }}
                              />
                              <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {product.category}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white">
                              {product.stock || 'N/A'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowProductDetails(true);
                                }}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditProduct(product)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isDeletingProduct === product.id}
                                title="Delete"
                              >
                                {isDeletingProduct === product.id ? (
                                  <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">
                        {products.length === 0 ? 'No products yet' : 'No products match your search'}
                      </p>
                      {products.length === 0 && (
                        <p className="text-sm text-gray-400">
                          Click "Add Product" above to create your first product
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((productsPage - 1) * itemsPerPage) + 1} to {Math.min(productsPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProductsPage(p => Math.max(1, p - 1))}
                        disabled={productsPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Page {productsPage} of {getTotalPages(filteredProducts)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProductsPage(p => Math.min(getTotalPages(filteredProducts), p + 1))}
                        disabled={productsPage >= getTotalPages(filteredProducts)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Orders Management</CardTitle>
                <CardDescription>View and manage all customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {paginate(filteredOrders, ordersPage).map((order: any) => (
                    <div key={order.id} className="p-4 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Order #{order.id.replace('order:', '').slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customerEmail} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${order.total.toFixed(2)}
                            </p>
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' : 
                                order.status === 'out_for_delivery' ? 'default' :
                                'secondary'
                              }
                              className={
                                order.status === 'delivered' ? 'bg-green-600 hover:bg-green-700' : 
                                order.status === 'out_for_delivery' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                ''
                              }
                            >
                              {order.status === 'out_for_delivery' ? 'Out for Delivery' : 
                               order.status === 'delivered' ? 'Delivered' : 
                               order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders found</p>
                  )}
                </div>

                {/* Pagination */}
                {filteredOrders.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((ordersPage - 1) * itemsPerPage) + 1} to {Math.min(ordersPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Page {ordersPage} of {getTotalPages(filteredOrders)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage(p => Math.min(getTotalPages(filteredOrders), p + 1))}
                        disabled={ordersPage >= getTotalPages(filteredOrders)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Blog Management</CardTitle>
                    <CardDescription>Create and manage blog posts</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {blogPosts.some((p: any) => p.id?.startsWith('default-')) && (
                      <Button variant="outline" onClick={handleSaveBlogsToDatabase}>
                        <Download className="h-4 w-4 mr-2" />
                        Save All to Database
                      </Button>
                    )}
                    <Button onClick={() => setShowAddBlogView(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Blog Post
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Post</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogPosts.map((post: any) => (
                        <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-16 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <span className="text-gray-900 dark:text-white font-medium block">{post.title}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.excerpt}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white">
                                {post.category}
                              </Badge>
                              {post.id?.startsWith('default-') && (
                                <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 dark:text-amber-400">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                            {post.date ? new Date(post.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingBlogPost(post);
                                  setShowEditBlogView(true);
                                }}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBlogPost(post.id)}
                                disabled={isDeletingBlog === post.id}
                                title="Delete"
                              >
                                {isDeletingBlog === post.id ? (
                                  <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredBlogPosts.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">
                        {blogPosts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
                      </p>
                      {blogPosts.length === 0 && (
                        <p className="text-sm text-gray-400">
                          Click "New Blog Post" above to write your first article
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab - Settings, Customer Photos & Testimonials */}
          <TabsContent value="content" className="space-y-6">
            {/* Store Settings */}
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Store Settings</CardTitle>
                <CardDescription>Global shipping and store configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultShipping" className="text-gray-700 dark:text-gray-300 mb-2 block">
                      Default Shipping Cost (AUD)
                    </Label>
                    <Input
                      id="defaultShipping"
                      type="number"
                      step="0.01"
                      min="0"
                      value={defaultShipping}
                      onChange={(e) => setDefaultShipping(e.target.value)}
                      placeholder="149"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Set to 0 for free shipping globally. Products can override this with their own shipping cost.
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={saveStoreSettings} disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discount Codes */}
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Discount Codes</CardTitle>
                <CardDescription>Create and manage promotional discount codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-zinc-700 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Code *</Label>
                      <Input value={newDiscount.code} onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })} placeholder="e.g., WELCOME20" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-mono" />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Type</Label>
                      <select value={newDiscount.type} onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Value * {newDiscount.type === 'percentage' ? '(%)' : '($)'}</Label>
                      <Input type="number" min="0" step={newDiscount.type === 'percentage' ? '1' : '0.01'} value={newDiscount.value} onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })} placeholder={newDiscount.type === 'percentage' ? '20' : '50.00'} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Min Order ($)</Label>
                      <Input type="number" min="0" step="0.01" value={newDiscount.minOrder} onChange={(e) => setNewDiscount({ ...newDiscount, minOrder: e.target.value })} placeholder="0 (no minimum)" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Max Uses</Label>
                      <Input type="number" min="1" value={newDiscount.maxUses} onChange={(e) => setNewDiscount({ ...newDiscount, maxUses: e.target.value })} placeholder="Unlimited" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">Expires</Label>
                      <Input type="date" value={newDiscount.expiresAt} onChange={(e) => setNewDiscount({ ...newDiscount, expiresAt: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">
                      Limit to specific products
                      <span className="text-gray-500 font-normal ml-1">(paste product IDs, comma-separated. Leave blank for all products)</span>
                    </Label>
                    <select multiple value={[]} onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                      const current = newDiscount.productIds ? newDiscount.productIds.split(',').map(s => s.trim()).filter(Boolean) : [];
                      const merged = [...new Set([...current, ...selected])];
                      setNewDiscount({ ...newDiscount, productIds: merged.join(', ') });
                    }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm h-24">
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id} className={newDiscount.productIds.includes(p.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}>
                          {p.name} (${p.price})
                        </option>
                      ))}
                    </select>
                    {newDiscount.productIds && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{newDiscount.productIds.split(',').filter(Boolean).length} product(s) selected</span>
                        <button type="button" onClick={() => setNewDiscount({ ...newDiscount, productIds: '' })} className="text-xs text-red-500 hover:underline">Clear</button>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleAddDiscount} disabled={isAddingDiscount}>
                    <Tag className="h-4 w-4 mr-2" />
                    {isAddingDiscount ? 'Creating...' : 'Create Discount Code'}
                  </Button>
                </div>

                {discountCodes.length > 0 ? (
                  <div className="space-y-3">
                    {discountCodes.map((d: any) => (
                      <div key={d.code} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-gray-900 dark:text-white">{d.code}</span>
                            <Badge variant={d.active ? 'default' : 'secondary'} className={d.active ? 'bg-green-600' : ''}>
                              {d.active ? 'Active' : 'Inactive'}
                            </Badge>
                            {d.expiresAt && new Date(d.expiresAt) < new Date() && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Expired</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {d.type === 'percentage' ? `${d.value}% off` : `$${d.value} off`}
                            {d.minOrder > 0 && ` on orders over $${d.minOrder}`}
                            {d.maxUses && ` | ${d.usedCount || 0}/${d.maxUses} uses`}
                            {d.productIds?.length > 0 && ` | ${d.productIds.length} specific product(s)`}
                            {d.expiresAt && ` | Expires ${new Date(d.expiresAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleToggleDiscount(d)} title={d.active ? 'Deactivate' : 'Activate'}>
                            {d.active ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDiscount(d.code)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">No discount codes created yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Customer Photos */}
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Customer Photos</CardTitle>
                <CardDescription>Manage the "Happy Customers" gallery on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Input placeholder="Customer name" value={newPhoto.name} onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                  <Input placeholder="Location (e.g., Sydney, NSW)" value={newPhoto.location} onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                  <Input placeholder="Image URL" value={newPhoto.image} onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                </div>
                <Button onClick={handleAddPhoto} disabled={isAddingPhoto} className="mb-6">
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingPhoto ? 'Adding...' : 'Add Customer Photo'}
                </Button>

                {customerPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {customerPhotos.map((photo: any) => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                        <img src={photo.image} alt={photo.name} className="w-full aspect-square object-cover" />
                        <div className="p-3 bg-white dark:bg-zinc-800">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{photo.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{photo.location}</p>
                        </div>
                        <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">No customer photos added yet. Default photos will be shown on the homepage.</p>
                )}
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Testimonials</CardTitle>
                <CardDescription>Manage the "What Our Customers Say" section on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-zinc-700 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input placeholder="Customer name *" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    <Input placeholder="Location (e.g., Melbourne, VIC)" value={newTestimonial.location} onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input placeholder="Product purchased" value={newTestimonial.product} onChange={(e) => setNewTestimonial({ ...newTestimonial, product: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    <Input placeholder="Date (e.g., March 2026)" value={newTestimonial.date} onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                    <select value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: e.target.value })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>
                  <textarea placeholder="Review text *" value={newTestimonial.text} onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" />
                  <Button onClick={handleAddTestimonial} disabled={isAddingTestimonial}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isAddingTestimonial ? 'Adding...' : 'Add Testimonial'}
                  </Button>
                </div>

                {testimonialsList.length > 0 ? (
                  <div className="space-y-3">
                    {testimonialsList.map((t: any) => (
                      <div key={t.id} className="flex items-start gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">— {t.location}</span>
                            <div className="flex ml-2">
                              {[...Array(t.rating || 5)].map((_: any, i: number) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">"{t.text}"</p>
                          {t.product && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.product} • {t.date}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(t.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">No testimonials added yet. Default testimonials will be shown on the homepage.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Customer Management</CardTitle>
                <CardDescription>View and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Last Sign In</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(filteredCustomers, customersPage).map((customer: any) => (
                        <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {customer.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {customer.email}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                              {customer.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {customer.lastSignIn ? new Date(customer.lastSignIn).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditCustomer(customer)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomer(customer.id)}
                                title="Delete"
                                disabled={customer.role === 'admin'}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCustomers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No customers found</p>
                  )}
                </div>

                {/* Pagination */}
                {filteredCustomers.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((customersPage - 1) * itemsPerPage) + 1} to {Math.min(customersPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomersPage(p => Math.max(1, p - 1))}
                        disabled={customersPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Page {customersPage} of {getTotalPages(filteredCustomers)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomersPage(p => Math.min(getTotalPages(filteredCustomers), p + 1))}
                        disabled={customersPage >= getTotalPages(filteredCustomers)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Add New Product</DialogTitle>
            <DialogDescription>Create a new product in your catalog</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  setProductForm({ ...productForm, name, slug });
                }}
                placeholder="e.g., Cloud Modern Sofa"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">
                Slug (URL-friendly ID) 
                <span className="text-xs text-gray-500 ml-2">(auto-generated, but you can edit)</span>
              </Label>
              <Input
                id="slug"
                value={productForm.slug}
                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                placeholder="e.g., cloud-modern-sofa"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
              <Input
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">Price</Label>
              <Input
                id="price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-gray-700 dark:text-gray-300">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
              <select
                id="category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">Main Image URL</Label>
              <Input
                id="image"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="images" className="text-gray-700 dark:text-gray-300">Additional Images (comma-separated URLs)</Label>
              <Input
                id="images"
                value={productForm.images}
                onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="colors" className="text-gray-700 dark:text-gray-300">Colors (comma-separated)</Label>
              <Input
                id="colors"
                value={productForm.colors}
                onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                placeholder="Charcoal, Navy, Beige"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="material" className="text-gray-700 dark:text-gray-300">Material</Label>
              <Input
                id="material"
                value={productForm.material}
                onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="dimensions" className="text-gray-700 dark:text-gray-300">Dimensions</Label>
              <Input
                id="dimensions"
                value={productForm.dimensions}
                onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                placeholder="L x W x H"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={productForm.featured}
                onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured" className="text-gray-700 dark:text-gray-300">Featured Product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setShowAddProduct(false); resetProductForm(); }}
              disabled={isAddingProduct}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProduct}
              disabled={isAddingProduct}
            >
              {isAddingProduct ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="col-span-2">
              <Label htmlFor="edit-name" className="text-gray-700 dark:text-gray-300">Product Name</Label>
              <Input
                id="edit-name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-slug" className="text-gray-700 dark:text-gray-300">Slug (URL-friendly ID)</Label>
              <Input
                id="edit-slug"
                value={productForm.slug}
                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-description" className="text-gray-700 dark:text-gray-300">Description</Label>
              <Input
                id="edit-description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-price" className="text-gray-700 dark:text-gray-300">Price</Label>
              <Input
                id="edit-price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-stock" className="text-gray-700 dark:text-gray-300">Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-category" className="text-gray-700 dark:text-gray-300">Category</Label>
              <select
                id="edit-category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-image" className="text-gray-700 dark:text-gray-300">Main Image URL</Label>
              <Input
                id="edit-image"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-images" className="text-gray-700 dark:text-gray-300">Additional Images (comma-separated URLs)</Label>
              <Input
                id="edit-images"
                value={productForm.images}
                onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-colors" className="text-gray-700 dark:text-gray-300">Colors (comma-separated)</Label>
              <Input
                id="edit-colors"
                value={productForm.colors}
                onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                placeholder="Charcoal, Navy, Beige"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-material" className="text-gray-700 dark:text-gray-300">Material</Label>
              <Input
                id="edit-material"
                value={productForm.material}
                onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-dimensions" className="text-gray-700 dark:text-gray-300">Dimensions</Label>
              <Input
                id="edit-dimensions"
                value={productForm.dimensions}
                onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                placeholder="L x W x H"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={productForm.featured}
                onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="edit-featured" className="text-gray-700 dark:text-gray-300">Featured Product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setShowEditProduct(false); resetProductForm(); }}
              disabled={isEditingProduct}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditProduct}
              disabled={isEditingProduct}
            >
              {isEditingProduct ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={showEditCustomer} onOpenChange={setShowEditCustomer}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name" className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input
                id="customer-name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="customer-email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="customer-role" className="text-gray-700 dark:text-gray-300">Role</Label>
              <select
                id="customer-role"
                value={customerForm.role}
                onChange={(e) => setCustomerForm({ ...customerForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditCustomer(false); setSelectedCustomer(null); }}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          accessToken={accessToken!}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onUpdate={() => {
            loadOrders();
            loadAnalytics();
          }}
        />
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setShowProductDetails(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}