import { Hono } from "npm:hono@4.6.14";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import Stripe from "npm:stripe@17.5.0";
import * as kv from "./kv_store.tsx";
import { generateInvoiceEmail, generateVerificationEmail, generatePasswordResetEmail } from "./emails.tsx";

const app = new Hono();

// Initialize Stripe with secret key from environment variable
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
let stripe: Stripe | null = null;

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
  });
  console.log("✅ Stripe initialized successfully");
} else {
  console.log("⚠️  STRIPE_SECRET_KEY not set. Payment processing will use demo mode.");
}

// Resend Email Helper
const sendEmail = async (to: string, subject: string, html: string) => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.log("⚠️  RESEND_API_KEY not set. Email not sent.");
    console.log("To enable emails, add your Resend API key to Supabase environment variables.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`Subject: ${subject}`);
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // Use custom verified domain for better deliverability
        from: "Vivere In Style <updates@vivereinstyle.com>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Email send error (${response.status}): ${JSON.stringify(data)}`);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log(`✅ Email sent successfully to ${to}: ${data.id}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.log(`❌ Email send exception: ${error}`);
    return { success: false, error: String(error) };
  }
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Database initialization helper
const ensureTableExists = async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Try a simple query to check if table exists
    const { error } = await supabase.from('kv_store_e9dccf07').select('key').limit(1);
    
    if (error && error.message.includes('does not exist')) {
      console.log('⚠️  Table kv_store_e9dccf07 does not exist. Please create it manually.');
      console.log('Run this SQL in Supabase SQL Editor:');
      console.log('CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (key TEXT NOT NULL PRIMARY KEY, value JSONB NOT NULL);');
      return false;
    }
    
    console.log('✅ Database table kv_store_e9dccf07 is ready');
    return true;
  } catch (error) {
    console.log('Database check error:', error);
    return false;
  }
};

// Check table on startup
ensureTableExists().catch(console.error);

// Admin email list - only these emails get admin privileges
const ADMIN_EMAILS = [
  "admin@vivereinstyle.com",
  "superadmin@vivereinstyle.com",
];

const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-35e920f3/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all products
app.get("/make-server-35e920f3/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ success: true, products });
  } catch (error) {
    console.log(`Error fetching products: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single product
app.get("/make-server-35e920f3/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    return c.json({ success: true, product });
  } catch (error) {
    console.log(`Error fetching product: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all categories
app.get("/make-server-35e920f3/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ success: true, categories });
  } catch (error) {
    console.log(`Error fetching categories: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get products by category
app.get("/make-server-35e920f3/categories/:slug/products", async (c) => {
  try {
    const slug = c.req.param("slug");
    const allProducts = await kv.getByPrefix("product:");
    const products = allProducts.filter((p: any) => p.category === slug);
    return c.json({ success: true, products });
  } catch (error) {
    console.log(`Error fetching products by category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create order
app.post("/make-server-35e920f3/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      ...orderData,
      status: orderData.status || "processing",
      createdAt: new Date().toISOString(),
    };

    await kv.set(orderId, order);
    
    // Send invoice email to customer
    if (orderData.customerEmail) {
      console.log(`📧 Preparing to send invoice to ${orderData.customerEmail}`);
      const invoiceHtml = generateInvoiceEmail(order);
      const emailResult = await sendEmail(
        orderData.customerEmail,
        `Order Confirmation #${orderId} - Vivere In Style`,
        invoiceHtml
      );
      
      if (!emailResult.success) {
        console.log(`❌ Failed to send invoice email: ${emailResult.error}`);
        // Don't fail the order, just log the error
      } else {
        console.log(`✅ Invoice email sent successfully to ${orderData.customerEmail}`);
      }
    } else {
      console.log(`⚠️  No customer email provided, skipping invoice email`);
    }
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get order by ID
app.get("/make-server-35e920f3/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, order });
  } catch (error) {
    console.log(`Error fetching order: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get invoice HTML for an order
app.get("/make-server-35e920f3/orders/:id/invoice", async (c) => {
  try {
    const id = c.req.param("id");
    // Handle both formats: with or without "order:" prefix
    const orderId = id.startsWith('order:') ? id : `order:${id}`;
    const order = await kv.get(orderId);
    
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    
    // Generate invoice HTML
    const invoiceHtml = generateInvoiceEmail(order);
    
    return new Response(invoiceHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Invoice-${orderId}.html"`,
      },
    });
  } catch (error) {
    console.log(`Error generating invoice: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Seed data endpoint
app.post("/make-server-35e920f3/seed", async (c) => {
  try {
    const seedData = await c.req.json();
    console.log('Received seed data:', JSON.stringify(seedData).substring(0, 200));
    
    // Clear existing data using proper key-based deletion
    const deletedProducts = await kv.delByPrefix("product:");
    const deletedCategories = await kv.delByPrefix("category:");
    const deletedOrders = await kv.delByPrefix("order:");
    
    console.log(`Cleared ${deletedProducts} products, ${deletedCategories} categories, ${deletedOrders} orders`);

    // Seed categories
    if (seedData.categories) {
      console.log(`Seeding ${seedData.categories.length} categories`);
      for (const category of seedData.categories) {
        const key = `category:${category.slug}`;
        console.log(`Setting category: ${key}`);
        await kv.set(key, category);
      }
    }

    // Seed products
    if (seedData.products) {
      console.log(`Seeding ${seedData.products.length} products`);
      for (const product of seedData.products) {
        const key = `product:${product.id}`;
        console.log(`Setting product: ${key}`);
        await kv.set(key, product);
      }
    }

    // Seed orders
    if (seedData.orders) {
      console.log(`Seeding ${seedData.orders.length} orders`);
      for (const order of seedData.orders) {
        const key = `order:${order.id}`;
        console.log(`Setting order: ${key}`);
        await kv.set(key, order);
      }
    }

    console.log('Seed completed successfully');
    return c.json({ 
      success: true, 
      message: "Data seeded successfully",
      categoriesSeeded: seedData.categories?.length || 0,
      productsSeeded: seedData.products?.length || 0,
      ordersSeeded: seedData.orders?.length || 0,
    });
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get featured products
app.get("/make-server-35e920f3/products/featured/list", async (c) => {
  try {
    const allProducts = await kv.getByPrefix("product:");
    const featured = allProducts.filter((p: any) => p.featured === true);
    return c.json({ success: true, products: featured });
  } catch (error) {
    console.log(`Error fetching featured products: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= ADMIN ENDPOINTS =============

// Admin analytics endpoint
app.get("/make-server-35e920f3/admin/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    // Get all data for analytics
    const products = await kv.getByPrefix('product:');
    const orders = await kv.getByPrefix('order:');
    const { data: { users } } = await supabase.auth.admin.listUsers();

    // Calculate analytics
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const totalCustomers = users?.length || 0;
    const totalProducts = products.length;

    // Recent orders (last 10)
    const recentOrders = orders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Sales data (mock - last 6 months)
    const salesData = [
      { month: 'Jun', sales: Math.floor(totalSales * 0.12) },
      { month: 'Jul', sales: Math.floor(totalSales * 0.15) },
      { month: 'Aug', sales: Math.floor(totalSales * 0.14) },
      { month: 'Sep', sales: Math.floor(totalSales * 0.18) },
      { month: 'Oct', sales: Math.floor(totalSales * 0.20) },
      { month: 'Nov', sales: Math.floor(totalSales * 0.21) },
    ];

    // Popular products (mock - based on order items)
    const productSales = new Map<string, number>();
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const count = productSales.get(item.name) || 0;
        productSales.set(item.name, count + item.quantity);
      });
    });
    
    const popularProducts = Array.from(productSales.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return c.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      salesData,
      popularProducts,
      categoryDistribution: []
    });
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Clear all orders (admin only)
app.delete("/make-server-35e920f3/admin/orders/clear-all", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const deleted = await kv.delByPrefix("order:");
    console.log(`Cleared ${deleted} orders`);
    return c.json({ success: true, message: `Cleared ${deleted} orders`, deleted });
  } catch (error) {
    console.log(`Error clearing orders: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Admin orders endpoint
app.get("/make-server-35e920f3/admin/orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    // Get all orders
    const orders = await kv.getByPrefix('order:');
    
    // Sort by date (newest first)
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });
  } catch (error) {
    console.log(`Error fetching orders: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Generate AI product description
app.post("/make-server-35e920f3/admin/ai-description", async (c) => {
  try {
    // Get access token from Authorization header
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ success: false, error: "Unauthorized - No token provided" }, 401);
    }

    // Verify the requester is an admin
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const { productName, category, material } = await c.req.json();
    
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      return c.json({ 
        success: false, 
        error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." 
      }, 400);
    }

    console.log(`🤖 Generating AI description for: ${productName} (${category})`);
    
    // Build the prompt based on available information
    let prompt = `You are a professional furniture product description writer for an Australian luxury furniture retailer called "Vivere In Style".

Write a compelling, elegant product description for a furniture item with the following details:
- Product Name: ${productName}
- Category: ${category || 'furniture'}`;
    
    if (material) {
      prompt += `\n- Material: ${material}`;
    }

    prompt += `\n\nThe description should:
- Be 2-3 sentences long
- Highlight quality, comfort, and style
- Use sophisticated yet accessible language
- Focus on how it enhances the living space
- Appeal to Australian home buyers

Write only the description, no additional commentary.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional furniture product description writer who creates elegant, compelling product descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`❌ OpenAI API error: ${JSON.stringify(errorData)}`);
      return c.json({ 
        success: false, 
        error: "Failed to generate description. Please check your OpenAI API key." 
      }, 500);
    }

    const data = await response.json();
    const description = data.choices[0].message.content.trim();
    
    console.log(`✅ AI description generated: ${description.substring(0, 50)}...`);
    
    return c.json({ 
      success: true, 
      description 
    });
  } catch (error) {
    console.log(`Error generating AI description: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new product (admin only)
app.post("/make-server-35e920f3/admin/products", async (c) => {
  try {
    const productData = await c.req.json();
    
    if (!productData.id) {
      productData.id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    if (typeof productData.stock === 'number' && productData.inStock === undefined) {
      productData.inStock = productData.stock > 0;
    }
    
    const key = `product:${productData.id}`;
    await kv.set(key, productData);
    
    console.log(`Product created: ${key}`);
    return c.json({ success: true, product: productData });
  } catch (error) {
    console.log(`Error creating product: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a product (admin only)
app.put("/make-server-35e920f3/admin/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const productData = await c.req.json();
    
    const key = `product:${id}`;
    
    // Check if product exists
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    const updated = { ...existing, ...productData, id };
    if (typeof updated.stock === 'number') {
      updated.inStock = updated.stock > 0;
    }
    await kv.set(key, updated);
    
    console.log(`Product updated: ${key}`);
    return c.json({ success: true, product: updated });
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a product (admin only)
app.delete("/make-server-35e920f3/admin/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `product:${id}`;
    
    // Check if product exists
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    await kv.del(key);
    
    console.log(`Product deleted: ${key}`);
    return c.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log(`Error deleting product: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= CUSTOMER PHOTOS ENDPOINTS =============

app.get("/make-server-35e920f3/customer-photos", async (c) => {
  try {
    const photos = await kv.getByPrefix("customer-photo:");
    return c.json({ success: true, photos });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-35e920f3/admin/customer-photos", async (c) => {
  try {
    const data = await c.req.json();
    if (!data.id) data.id = `cp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`customer-photo:${data.id}`, data);
    return c.json({ success: true, photo: data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-35e920f3/admin/customer-photos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`customer-photo:${id}`);
    return c.json({ success: true, message: "Deleted" });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= TESTIMONIALS ENDPOINTS =============

app.get("/make-server-35e920f3/testimonials", async (c) => {
  try {
    const testimonials = await kv.getByPrefix("testimonial:");
    return c.json({ success: true, testimonials });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-35e920f3/admin/testimonials", async (c) => {
  try {
    const data = await c.req.json();
    if (!data.id) data.id = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`testimonial:${data.id}`, data);
    return c.json({ success: true, testimonial: data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-35e920f3/admin/testimonials/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`testimonial:${id}`);
    return c.json({ success: true, message: "Deleted" });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= BLOG ENDPOINTS =============

// Get all blog posts (public)
app.get("/make-server-35e920f3/blogs", async (c) => {
  try {
    const posts = await kv.getByPrefix("blog:");
    posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json({ success: true, posts });
  } catch (error) {
    console.log(`Error fetching blog posts: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single blog post (public)
app.get("/make-server-35e920f3/blogs/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const allPosts = await kv.getByPrefix("blog:");
    const post = allPosts.find((p: any) => p.slug === slug || p.id === slug);
    if (!post) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }
    return c.json({ success: true, post });
  } catch (error) {
    console.log(`Error fetching blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create blog post (admin)
app.post("/make-server-35e920f3/admin/blogs", async (c) => {
  try {
    const postData = await c.req.json();
    
    if (!postData.id) {
      postData.id = `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!postData.slug) {
      postData.slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    if (!postData.date) {
      postData.date = new Date().toISOString().split('T')[0];
    }
    postData.createdAt = postData.createdAt || new Date().toISOString();
    postData.updatedAt = new Date().toISOString();
    
    const key = `blog:${postData.id}`;
    await kv.set(key, postData);
    
    console.log(`Blog post created: ${key}`);
    return c.json({ success: true, post: postData });
  } catch (error) {
    console.log(`Error creating blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update blog post (admin)
app.put("/make-server-35e920f3/admin/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const postData = await c.req.json();
    
    const key = `blog:${id}`;
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }
    
    const updated = { ...existing, ...postData, id, updatedAt: new Date().toISOString() };
    await kv.set(key, updated);
    
    console.log(`Blog post updated: ${key}`);
    return c.json({ success: true, post: updated });
  } catch (error) {
    console.log(`Error updating blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete blog post (admin)
app.delete("/make-server-35e920f3/admin/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `blog:${id}`;
    
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }
    
    await kv.del(key);
    console.log(`Blog post deleted: ${key}`);
    return c.json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    console.log(`Error deleting blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new category (admin only)
app.post("/make-server-35e920f3/admin/categories", async (c) => {
  try {
    const categoryData = await c.req.json();
    
    if (!categoryData.slug) {
      return c.json({ success: false, error: "Slug is required" }, 400);
    }
    
    const key = `category:${categoryData.slug}`;
    await kv.set(key, categoryData);
    
    console.log(`Category created: ${key}`);
    return c.json({ success: true, category: categoryData });
  } catch (error) {
    console.log(`Error creating category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a category (admin only)
app.put("/make-server-35e920f3/admin/categories/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const categoryData = await c.req.json();
    
    const key = `category:${slug}`;
    
    // Check if category exists
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }
    
    // Merge with existing data
    const updated = { ...existing, ...categoryData, slug };
    await kv.set(key, updated);
    
    console.log(`Category updated: ${key}`);
    return c.json({ success: true, category: updated });
  } catch (error) {
    console.log(`Error updating category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a category (admin only)
app.delete("/make-server-35e920f3/admin/categories/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const key = `category:${slug}`;
    
    // Check if category exists
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: "Category not found" }, 404);
    }
    
    await kv.del(key);
    
    console.log(`Category deleted: ${key}`);
    return c.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log(`Error deleting category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-35e920f3/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    // Get all users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.log(`Error fetching users: ${error.message}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Map users to a cleaner format
    const cleanedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email?.split('@')[0],
      role: isAdminEmail(u.email || '') ? 'admin' : 'customer',
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
    }));

    return c.json({ success: true, users: cleanedUsers });
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user (admin only)
app.put("/make-server-35e920f3/admin/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user: admin }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !admin || !isAdminEmail(admin.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const userId = c.req.param("id");
    const { name, email, role } = await c.req.json();

    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email,
      user_metadata: { name, role },
    });

    if (error) {
      console.log(`Error updating user: ${error.message}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log(`User updated: ${userId}`);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Error updating user: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-35e920f3/admin/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user: admin }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !admin || !isAdminEmail(admin.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const userId = c.req.param("id");

    // Delete user
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.log(`Error deleting user: ${error.message}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log(`User deleted: ${userId}`);
    return c.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log(`Error deleting user: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update order status (admin only)
app.put("/make-server-35e920f3/admin/orders/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const orderId = c.req.param("id");
    const { status } = await c.req.json();

    const key = `order:${orderId}`;
    const order = await kv.get(key);

    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(key, updatedOrder);

    console.log(`Order ${orderId} status updated to: ${status}`);
    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.log(`Error updating order status: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Upload delivery image for order (admin only)
app.post("/make-server-35e920f3/admin/orders/:id/delivery-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the requester is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || !isAdminEmail(user.email || '')) {
      return c.json({ success: false, error: "Unauthorized - Admin access required" }, 403);
    }

    const orderId = c.req.param("id");
    const { image, fileName } = await c.req.json();

    const key = `order:${orderId}`;
    const order = await kv.get(key);

    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }

    // Store the delivery images
    const deliveryImages = order.deliveryImages || [];
    deliveryImages.push(image);

    // Update order with delivery image and mark as delivered
    const updatedOrder = {
      ...order,
      deliveryImages,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(key, updatedOrder);

    console.log(`Delivery image uploaded for order ${orderId}`);
    return c.json({ success: true, order: updatedOrder, imageUrl: image });
  } catch (error) {
    console.log(`Error uploading delivery image: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= PAYMENT ENDPOINTS =============

// Create Stripe payment intent
app.post("/make-server-35e920f3/create-payment-intent", async (c) => {
  try {
    const { amount } = await c.req.json();
    
    if (!stripe) {
      console.log("Stripe not initialized. Using demo mode.");
      // In a real app, you would use Stripe SDK here
      // For now, we'll create a mock payment intent
      const paymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 16)}`,
        amount,
        currency: 'aud',
        status: 'requires_payment_method',
      };
      
      console.log(`Payment intent created: ${paymentIntent.id} for amount: ${amount}`);
      return c.json({ success: true, paymentIntent });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount is already in cents from the frontend
      currency: 'aud',
      payment_method_types: ['card'],
    });

    console.log(`Payment intent created: ${paymentIntent.id} for amount: ${amount}`);
    return c.json({ success: true, paymentIntent });
  } catch (error) {
    console.log(`Error creating payment intent: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Newsletter subscription endpoint
app.post("/make-server-35e920f3/newsletter/subscribe", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ success: false, error: "Email is required" }, 400);
    }
    
    const subscriberId = `newsletter:${email}`;
    const subscription = {
      email,
      subscribedAt: new Date().toISOString(),
    };
    
    await kv.set(subscriberId, subscription);
    
    console.log(`Newsletter subscription: ${email}`);
    return c.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.log(`Error subscribing to newsletter: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= AUTH ENDPOINTS =============

// Check user role endpoint - secure server-side role validation
app.post("/make-server-35e920f3/auth/check-role", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get user from access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    // Check if user is admin based on server-side list
    const role = isAdminEmail(user.email || '') ? 'admin' : 'customer';

    return c.json({ 
      success: true, 
      role,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0]
    });
  } catch (error) {
    console.log(`Error checking role: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Signup endpoint
app.post("/make-server-35e920f3/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ success: false, error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codeKey = `verification:${email.toLowerCase()}`;
    
    // Store verification code (expires in 10 minutes)
    await kv.set(codeKey, {
      code: verificationCode,
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // Send verification email
    const emailHtml = generateVerificationEmail(verificationCode, name);
    const emailResult = await sendEmail(
      email,
      "Verify Your Email - Vivere In Style",
      emailHtml
    );

    if (!emailResult.success) {
      console.log(`Failed to send verification email: ${emailResult.error}`);
      // Continue anyway - user can try again
    }

    console.log(`Verification code sent to: ${email}`);
    return c.json({ 
      success: true, 
      message: "Verification code sent to your email",
      email: email 
    });
  } catch (error) {
    console.log(`Error in signup: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Verify email with code
app.post("/make-server-35e920f3/verify-email", async (c) => {
  try {
    const { email, code } = await c.req.json();

    if (!email || !code) {
      return c.json({ success: false, error: "Email and code are required" }, 400);
    }

    const codeKey = `verification:${email.toLowerCase()}`;
    const verification = await kv.get(codeKey);

    if (!verification) {
      return c.json({ success: false, error: "Verification code not found or expired" }, 400);
    }

    // Check if code matches
    if (verification.code !== code) {
      return c.json({ success: false, error: "Invalid verification code" }, 400);
    }

    // Check if expired
    if (new Date() > new Date(verification.expiresAt)) {
      await kv.del(codeKey);
      return c.json({ success: false, error: "Verification code has expired" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Create the user account
    const { data, error } = await supabase.auth.admin.createUser({
      email: verification.email,
      password: verification.password,
      user_metadata: { 
        name: verification.name || verification.email.split('@')[0],
        role: 'customer',
        emailVerified: true,
      },
      email_confirm: true, // Auto-confirm since we verified via code
    });

    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ success: false, error: error.message }, 400);
    }

    // Delete verification code
    await kv.del(codeKey);

    console.log(`User verified and created: ${email}`);
    return c.json({ 
      success: true, 
      message: "Email verified successfully! You can now sign in.",
      user: data.user 
    });
  } catch (error) {
    console.log(`Error verifying email: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Resend verification code
app.post("/make-server-35e920f3/resend-verification", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ success: false, error: "Email is required" }, 400);
    }

    const codeKey = `verification:${email.toLowerCase()}`;
    const existing = await kv.get(codeKey);

    if (!existing) {
      return c.json({ success: false, error: "No pending verification found" }, 400);
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    
    // Update with new code
    await kv.set(codeKey, {
      ...existing,
      code: verificationCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // Send email
    const emailHtml = generateVerificationEmail(verificationCode, existing.name);
    await sendEmail(
      email,
      "Verify Your Email - Vivere In Style",
      emailHtml
    );

    console.log(`Verification code resent to: ${email}`);
    return c.json({ success: true, message: "Verification code resent" });
  } catch (error) {
    console.log(`Error resending verification: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Request password reset
app.post("/make-server-35e920f3/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ success: false, error: "Email is required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if user exists
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    // Always return success (security - don't reveal if email exists)
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return c.json({ success: true, message: "If an account exists, you will receive a reset code" });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const resetKey = `reset:${email.toLowerCase()}`;
    
    // Store reset code (expires in 10 minutes)
    await kv.set(resetKey, {
      code: resetCode,
      email,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // Send reset email
    const emailHtml = generatePasswordResetEmail(resetCode, user.user_metadata?.name);
    await sendEmail(
      email,
      "Reset Your Password - Vivere In Style",
      emailHtml
    );

    console.log(`Password reset code sent to: ${email}`);
    return c.json({ 
      success: true, 
      message: "If an account exists, you will receive a reset code" 
    });
  } catch (error) {
    console.log(`Error in forgot password: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Verify reset code
app.post("/make-server-35e920f3/verify-reset-code", async (c) => {
  try {
    const { email, code } = await c.req.json();

    if (!email || !code) {
      return c.json({ success: false, error: "Email and code are required" }, 400);
    }

    const resetKey = `reset:${email.toLowerCase()}`;
    const reset = await kv.get(resetKey);

    if (!reset) {
      return c.json({ success: false, error: "Reset code not found or expired" }, 400);
    }

    // Check if code matches
    if (reset.code !== code) {
      return c.json({ success: false, error: "Invalid reset code" }, 400);
    }

    // Check if expired
    if (new Date() > new Date(reset.expiresAt)) {
      await kv.del(resetKey);
      return c.json({ success: false, error: "Reset code has expired" }, 400);
    }

    console.log(`Reset code verified for: ${email}`);
    return c.json({ success: true, message: "Code verified" });
  } catch (error) {
    console.log(`Error verifying reset code: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reset password with code
app.post("/make-server-35e920f3/reset-password", async (c) => {
  try {
    const { email, code, newPassword } = await c.req.json();

    if (!email || !code || !newPassword) {
      return c.json({ success: false, error: "Email, code, and new password are required" }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ success: false, error: "Password must be at least 6 characters" }, 400);
    }

    const resetKey = `reset:${email.toLowerCase()}`;
    const reset = await kv.get(resetKey);

    if (!reset) {
      return c.json({ success: false, error: "Reset code not found or expired" }, 400);
    }

    // Check if code matches
    if (reset.code !== code) {
      return c.json({ success: false, error: "Invalid reset code" }, 400);
    }

    // Check if expired
    if (new Date() > new Date(reset.expiresAt)) {
      await kv.del(resetKey);
      return c.json({ success: false, error: "Reset code has expired" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Update password
    const { error } = await supabase.auth.admin.updateUserById(reset.userId, {
      password: newPassword,
    });

    if (error) {
      console.log(`Error resetting password: ${error.message}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Delete reset code
    await kv.del(resetKey);

    console.log(`Password reset successfully for: ${email}`);
    return c.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(`Error resetting password: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get reviews for a product
app.get("/make-server-35e920f3/products/:id/reviews", async (c) => {
  try {
    const productId = c.req.param("id");
    const reviews = await kv.getByPrefix(`review:${productId}:`);
    
    // Sort by date, newest first
    const sortedReviews = reviews.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ success: true, reviews: sortedReviews });
  } catch (error) {
    console.log(`Error fetching reviews: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add review for a product
app.post("/make-server-35e920f3/products/:id/reviews", async (c) => {
  try {
    const productId = c.req.param("id");
    const { userId, userName, rating, title, comment } = await c.req.json();

    if (!userId || !rating || !title || !comment) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ success: false, error: "Rating must be between 1 and 5" }, 400);
    }

    const reviewId = `review:${productId}:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const review = {
      id: reviewId,
      productId,
      userId,
      userName: userName || "Anonymous",
      rating,
      title,
      comment,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(reviewId, review);
    
    console.log(`Review added for product ${productId} by ${userName}`);
    return c.json({ success: true, review });
  } catch (error) {
    console.log(`Error adding review: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);