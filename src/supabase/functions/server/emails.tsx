// Email templates for Vivere In Style

export function generateInvoiceEmail(order: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price || 0).toLocaleString()}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const shippingAddress = order.shippingAddress || {};
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice - Vivere In Style</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Vivere In Style</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation & Invoice</p>
    </div>

    <!-- Success Message -->
    <div style="padding: 30px; text-align: center; background-color: #f0fdf4; border-bottom: 3px solid #22c55e;">
      <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
      <h2 style="margin: 0 0 10px 0; color: #166534; font-size: 24px;">Thank You for Your Order!</h2>
      <p style="margin: 0; color: #15803d; font-size: 16px;">We've received your order and will start processing it right away.</p>
    </div>

    <!-- Order Details -->
    <div style="padding: 30px;">
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #666;">Order Number:</strong>
            </td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="font-family: monospace; font-size: 16px; font-weight: bold;">${order.id || 'N/A'}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #666;">Order Date:</strong>
            </td>
            <td style="padding: 8px 0; text-align: right;">
              ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-AU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #666;">Payment Status:</strong>
            </td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="background-color: #22c55e; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 500;">Paid</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Customer & Shipping Info -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1a1a1a;">Delivery Information</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 5px 0; font-weight: 600; color: #1a1a1a;">${order.customerName || 'Customer'}</p>
          ${shippingAddress.address ? `<p style="margin: 5px 0; color: #666;">${shippingAddress.address}</p>` : ''}
          <p style="margin: 5px 0; color: #666;">${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postcode || ''}</p>
          ${order.customerPhone ? `<p style="margin: 5px 0; color: #666;">Phone: ${order.customerPhone}</p>` : ''}
          <p style="margin: 10px 0 0 0; padding-top: 10px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
            📦 Estimated Delivery: <strong>5-7 business days</strong>
          </p>
        </div>
      </div>

      <!-- Order Items -->
      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1a1a1a;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; font-size: 14px;">Item</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #666; font-size: 14px;">Price</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #666; font-size: 14px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Order Summary -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666;">Subtotal:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">$${(order.total || 0).toLocaleString()} AUD</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Delivery:</td>
            <td style="padding: 8px 0; text-align: right; color: #22c55e; font-weight: 600;">FREE</td>
          </tr>
          <tr style="border-top: 2px solid #1a1a1a;">
            <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold;">Total:</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold;">$${(order.total || 0).toLocaleString()} AUD</td>
          </tr>
        </table>
      </div>

      <!-- What's Next -->
      <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">What happens next?</h4>
        <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
          <li style="margin: 5px 0;">We'll process your order within 24 hours</li>
          <li style="margin: 5px 0;">You'll receive shipping confirmation via email</li>
          <li style="margin: 5px 0;">Track your order using the order number above</li>
          <li style="margin: 5px 0;">Enjoy your new furniture!</li>
        </ol>
      </div>

      <!-- Support -->
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Need help? We're here for you!</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;">
          📧 <a href="mailto:support@vivereinstyle.com" style="color: #3b82f6; text-decoration: none;">support@vivereinstyle.com</a><br>
          📞 1300 123 456<br>
          💬 Live chat available on our website
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Vivere In Style</p>
      <p style="margin: 0 0 10px 0; color: #999; font-size: 14px;">123 Furniture Lane, Adelaide SA 5000, Australia</p>
      <p style="margin: 0 0 15px 0; color: #999; font-size: 14px;">www.vivereinstyle.com</p>
      
      <div style="margin: 20px 0;">
        <p style="margin: 0 0 10px 0; color: #ccc; font-size: 12px;">✓ Free Delivery  |  ✓ 120-Day Returns  |  ✓ 10-Year Warranty</p>
      </div>

      <p style="margin: 15px 0 0 0; color: #666; font-size: 12px;">
        © 2025 Vivere In Style. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateVerificationEmail(code: string, name?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Vivere In Style</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Vivere In Style</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Verify Your Email Address</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">📧</div>
      
      <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #1a1a1a;">
        ${name ? `Welcome, ${name}!` : 'Welcome!'}
      </h2>
      
      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.5;">
        Thank you for joining Vivere In Style. To complete your registration and start shopping, please verify your email address using the code below:
      </p>

      <!-- Verification Code -->
      <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; margin: 30px 0;">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
        <p style="margin: 0; font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a; font-family: monospace;">
          ${code}
        </p>
      </div>

      <p style="margin: 30px 0; color: #666; font-size: 14px;">
        This code will expire in <strong>10 minutes</strong>
      </p>

      <!-- Info Box -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; text-align: left; margin-top: 30px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>Didn't create an account?</strong><br>
          If you didn't request this verification, you can safely ignore this email.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Vivere In Style</p>
      <p style="margin: 0 0 10px 0; color: #999; font-size: 14px;">123 Furniture Lane, Adelaide SA 5000, Australia</p>
      <p style="margin: 0 0 15px 0; color: #999; font-size: 14px;">www.vivereinstyle.com</p>
      <p style="margin: 15px 0 0 0; color: #666; font-size: 12px;">
        © 2025 Vivere In Style. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generatePasswordResetEmail(code: string, name?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Vivere In Style</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Vivere In Style</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Request</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">🔐</div>
      
      <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #1a1a1a;">
        ${name ? `Hi ${name},` : 'Hello,'}
      </h2>
      
      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.5;">
        We received a request to reset your password. Use the code below to create a new password:
      </p>

      <!-- Reset Code -->
      <div style="background-color: #fef3c7; border: 2px solid #fbbf24; border-radius: 12px; padding: 30px; margin: 30px 0;">
        <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Reset Code</p>
        <p style="margin: 0; font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #92400e; font-family: monospace;">
          ${code}
        </p>
      </div>

      <p style="margin: 30px 0; color: #666; font-size: 14px;">
        This code will expire in <strong>10 minutes</strong>
      </p>

      <!-- Security Warning -->
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; text-align: left; margin-top: 30px;">
        <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
          ⚠️ Security Notice
        </p>
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
          If you didn't request a password reset, please ignore this email or contact our support team immediately. Your account security is important to us.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Vivere In Style</p>
      <p style="margin: 0 0 10px 0; color: #999; font-size: 14px;">123 Furniture Lane, Adelaide SA 5000, Australia</p>
      <p style="margin: 0 0 15px 0; color: #999; font-size: 14px;">
        📧 <a href="mailto:support@vivereinstyle.com" style="color: #999; text-decoration: none;">support@vivereinstyle.com</a>
      </p>
      <p style="margin: 15px 0 0 0; color: #666; font-size: 12px;">
        © 2025 Vivere In Style. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}