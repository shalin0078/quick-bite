// QuickBite Transactional Email Dispatcher

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const emailService = {
  // Get all sent emails from local audit log
  getSentEmails() {
    try {
      const logs = localStorage.getItem('quickbite_sent_emails');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },

  // Record an outgoing email into audit log & optionally dispatch via Resend
  async logAndDispatch({ to, subject, html, text, type, metadata = {} }) {
    const emailRecord = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      to,
      subject,
      html,
      text,
      type,
      metadata,
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };

    // Save to LocalStorage audit list
    try {
      const existing = this.getSentEmails();
      const updated = [emailRecord, ...existing].slice(0, 50); // keep last 50
      localStorage.setItem('quickbite_sent_emails', JSON.stringify(updated));

      // Broadcast event so UI email notification badge updates live
      window.dispatchEvent(new CustomEvent('quickbite:email_sent', { detail: emailRecord }));
    } catch (e) {
      console.warn('Failed to store email in local audit log', e);
    }

    // If Resend API Key is configured, send real HTTP request to Resend
    if (RESEND_API_KEY && RESEND_API_KEY.startsWith('re_')) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'QuickBite Delivery <onboarding@resend.dev>',
            to: [to],
            subject,
            html,
          }),
        });
      } catch (err) {
        console.error('Resend API request failed:', err);
      }
    }

    return emailRecord;
  },

  // 1. DELIVERY OTP EMAIL (Strictly Email-Only per specification Section 9.B)
  async sendDeliveryOtpEmail({ customerName, customerEmail, orderId, otpCode }) {
    const subject = 'Your QuickBite Delivery Verification Code';
    const text = `Hello ${customerName},\n\nYour QuickBite order #${orderId} is almost at your doorstep!\n\nYour delivery verification code is:\n\n${otpCode}\n\nPlease share this code with your delivery partner to confirm successful delivery.\n\nThis code expires in 10 minutes.\n\nThank you for ordering with QuickBite.\n\nGood Food. Good Mood.`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FC8019 0%, #E96B0C 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Quick<span style="color: #FFE4CC;">Bite</span></h1>
          <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #FFF0E6;">Good Food. Good Mood.</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; color: #1C1C1C; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #1C1C1C;">Hello ${customerName},</h2>
          <p style="margin: 0 0 20px; font-size: 15px; color: #4A4A4A;">
            Your QuickBite order <strong style="color: #FC8019;">#${orderId}</strong> is almost at your doorstep!
          </p>

          <div style="background: #FFF7ED; border: 2px dashed #FC8019; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="display: block; font-size: 12px; font-weight: 700; color: #686B78; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your Delivery Verification Code</span>
            <div style="font-size: 40px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #FC8019;">
              ${otpCode}
            </div>
            <p style="margin: 10px 0 0; font-size: 12px; font-weight: 600; color: #C2410C;">
              ⏳ This code expires in 10 minutes.
            </p>
          </div>

          <div style="background: #F8F8F8; border-radius: 12px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #686B78;">
            🛡️ <strong>Security Tip:</strong> Share this 6-digit code with your QuickBite delivery partner <em>only</em> after inspecting and receiving your package.
          </div>

          <p style="margin: 24px 0 0; font-size: 14px; color: #686B78;">
            Thank you for ordering with QuickBite.<br/>
            <strong>Good Food. Good Mood.</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #1C1C1C; padding: 20px; text-align: center; color: #9E9E9E; font-size: 11px;">
          QuickBite Technologies Inc. • Vadodara, Gujarat • support@quickbite.in
        </div>
      </div>
    `;

    return this.logAndDispatch({
      to: customerEmail,
      subject,
      html,
      text,
      type: 'delivery_otp',
      metadata: { orderId, otpCode, customerName }
    });
  },

  // 2. ACCOUNT REGISTRATION & EMAIL VERIFICATION
  async sendWelcomeVerificationEmail({ customerName, customerEmail, customUserId }) {
    const subject = 'Welcome to QuickBite – Verify Your Account';
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 20px; overflow: hidden;">
        <div style="background: #FC8019; padding: 28px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 900;">QuickBite</h1>
          <p style="margin: 4px 0 0; font-size: 12px; font-weight: 600;">Good Food. Good Mood.</p>
        </div>
        <div style="padding: 28px; color: #1C1C1C;">
          <h2>Welcome, ${customerName}!</h2>
          <p>Your QuickBite customer account is now created.</p>
          <div style="background: #F8F8F8; padding: 14px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px;"><strong>Customer ID:</strong> <code style="color: #FC8019;">${customUserId}</code></p>
            <p style="margin: 4px 0 0; font-size: 13px;"><strong>Registered Email:</strong> ${customerEmail}</p>
          </div>
          <p style="font-size: 13px; color: #267E3E; font-weight: 600;">✓ Your email address is confirmed. You are ready to explore and order your favorite food!</p>
        </div>
      </div>
    `;
    return this.logAndDispatch({
      to: customerEmail,
      subject,
      html,
      text: `Welcome ${customerName}! Your customer ID is ${customUserId}. Enjoy QuickBite!`,
      type: 'welcome'
    });
  },

  // 3. PASSWORD RESET EMAIL
  async sendPasswordResetEmail({ customerEmail, resetToken }) {
    const subject = 'Reset Your QuickBite Account Password';
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 20px; overflow: hidden;">
        <div style="background: #FC8019; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">QuickBite Password Reset</h2>
        </div>
        <div style="padding: 24px; color: #1C1C1C;">
          <p>We received a request to reset the password for ${customerEmail}.</p>
          <p>Your secure reset code is:</p>
          <div style="font-size: 28px; font-family: monospace; font-weight: bold; background: #FFF7ED; padding: 16px; border-radius: 12px; text-align: center; color: #FC8019;">
            ${resetToken}
          </div>
          <p style="font-size: 12px; color: #686B78; margin-top: 14px;">If you did not request this, please ignore this email or contact support@quickbite.in.</p>
        </div>
      </div>
    `;
    return this.logAndDispatch({
      to: customerEmail,
      subject,
      html,
      text: `Your QuickBite password reset token is ${resetToken}.`,
      type: 'password_reset'
    });
  },

  // 4. ORDER CONFIRMATION EMAIL
  async sendOrderConfirmationEmail({ customerName, customerEmail, order }) {
    const subject = `Order Confirmed #${order.id} – QuickBite`;
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 20px; overflow: hidden;">
        <div style="background: #FC8019; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">Order Confirmed!</h2>
          <p style="margin: 4px 0 0; font-size: 13px;">Order ID: #${order.id}</p>
        </div>
        <div style="padding: 24px; color: #1C1C1C;">
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your order with <strong>${order.restaurantName || "QuickBite Partner"}</strong> has been received and confirmed!</p>
          <div style="background: #F8F8F8; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Total Amount: ₹${order.totalAmount}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #686B78;">Payment: ${order.paymentMethod}</p>
          </div>
          <p style="font-size: 13px; color: #686B78;">You can track your delivery live on the QuickBite map.</p>
        </div>
      </div>
    `;
    return this.logAndDispatch({
      to: customerEmail,
      subject,
      html,
      text: `Order #${order.id} confirmed! Total: ₹${order.totalAmount}`,
      type: 'order_confirmed'
    });
  },

  // 5. SUCCESSFUL DELIVERY CONFIRMATION EMAIL
  async sendDeliverySuccessEmail({ customerName, customerEmail, orderId }) {
    const subject = `Order Delivered #${orderId} – Enjoy Your Meal!`;
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 20px; overflow: hidden;">
        <div style="background: #267E3E; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">Delivered Successfully! 🎉</h2>
          <p style="margin: 4px 0 0; font-size: 13px;">Order ID: #${orderId}</p>
        </div>
        <div style="padding: 24px; color: #1C1C1C;">
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your delivery verification OTP was successfully confirmed by your delivery partner.</p>
          <p>We hope you enjoy your delicious food. Have a wonderful meal!</p>
          <p style="margin-top: 20px; font-size: 13px; color: #FC8019; font-weight: bold;">QuickBite – Good Food. Good Mood.</p>
        </div>
      </div>
    `;
    return this.logAndDispatch({
      to: customerEmail,
      subject,
      html,
      text: `Order #${orderId} has been successfully delivered!`,
      type: 'order_delivered'
    });
  }
};
