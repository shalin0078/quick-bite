// Secure Email-Based Delivery OTP Service
import { sha256, generateOtp } from './cryptoUtils';
import { emailService } from './emailService';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

export const otpService = {
  // Read local OTP records table
  getOtpRecords() {
    try {
      const records = localStorage.getItem('quickbite_delivery_otps');
      return records ? JSON.parse(records) : {};
    } catch {
      return {};
    }
  },

  saveOtpRecords(records) {
    try {
      localStorage.setItem('quickbite_delivery_otps', JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save OTP records', e);
    }
  },

  // 1. GENERATE & DISPATCH OTP (Sent ONLY to customer's registered email)
  async generateAndSendOtp({ orderId, customerName, customerEmail }) {
    if (!orderId || !customerEmail) {
      return { success: false, message: 'Missing orderId or customerEmail' };
    }

    const records = this.getOtpRecords();
    const existing = records[orderId];

    // Check 60-second resend cooldown
    if (existing && existing.lastSentAt) {
      const elapsed = Date.now() - existing.lastSentAt;
      if (elapsed < RESEND_COOLDOWN_MS && !existing.verifiedAt) {
        const remainingSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return {
          success: false,
          cooldown: true,
          message: `Please wait ${remainingSec} seconds before requesting a new delivery OTP.`
        };
      }
    }

    // Generate fresh random 6-digit code
    const rawOtp = generateOtp();
    const otpHash = await sha256(rawOtp);
    const now = Date.now();
    const expiresAt = now + OTP_EXPIRY_MS;

    // Store strictly the HASH, never the raw OTP in database/storage
    records[orderId] = {
      orderId,
      customerEmail,
      customerName,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      lastSentAt: now,
      verifiedAt: null,
      isExpired: false
    };

    this.saveOtpRecords(records);

    // Send the raw OTP ONLY to the customer's registered email
    await emailService.sendDeliveryOtpEmail({
      customerName,
      customerEmail,
      orderId,
      otpCode: rawOtp
    });

    return {
      success: true,
      message: `Delivery OTP has been sent to ${customerEmail}.`,
      expiresAt,
      // For development/demo convenience ONLY when inspecting in developer tools:
      _devNotice: 'OTP sent strictly via email. Raw OTP is not exposed in production API responses.'
    };
  },

  // Check if an OTP is active for the given order
  getOtpStatus(orderId) {
    const records = this.getOtpRecords();
    const record = records[orderId];
    if (!record) return { active: false, exists: false };

    const isExpired = Date.now() > record.expiresAt;
    const isVerified = Boolean(record.verifiedAt);
    const isLocked = record.attempts >= record.maxAttempts;

    return {
      active: !isExpired && !isVerified && !isLocked,
      exists: true,
      expiresAt: record.expiresAt,
      attempts: record.attempts,
      maxAttempts: record.maxAttempts,
      isExpired,
      isVerified,
      isLocked,
      lastSentAt: record.lastSentAt
    };
  },

  // 2. VERIFY OTP (Executed by Delivery Partner at the doorstep)
  async verifyOtp({ orderId, enteredOtp, partnerId = 'rider-1' }) {
    if (!orderId || !enteredOtp) {
      return { success: false, message: 'Please enter the 6-digit delivery OTP.' };
    }

    const cleanOtp = enteredOtp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return { success: false, message: 'OTP must be exactly 6 digits.' };
    }

    // 1. If Supabase is configured, execute secure server-side RPC verification
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('verify_delivery_otp', {
          p_order_id: orderId,
          p_otp_code: cleanOtp
        });
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase RPC verify_delivery_otp fallback to local engine:', err);
      }
    }

    const records = this.getOtpRecords();
    const record = records[orderId];

    if (!record) {
      return { success: false, message: 'No delivery OTP found for this order. Please generate one first.' };
    }

    if (record.verifiedAt) {
      return { success: false, message: 'This delivery OTP has already been verified and used.' };
    }

    if (Date.now() > record.expiresAt) {
      return {
        success: false,
        expired: true,
        message: 'This delivery OTP has expired. Please ask the customer to request a new OTP.'
      };
    }

    if (record.attempts >= record.maxAttempts) {
      return {
        success: false,
        locked: true,
        message: 'Maximum verification attempts exceeded (5/5). Contact QuickBite support.'
      };
    }

    // Hash user input and compare with stored hash
    const candidateHash = await sha256(cleanOtp);

    if (candidateHash !== record.otpHash) {
      record.attempts += 1;
      this.saveOtpRecords(records);
      const remaining = record.maxAttempts - record.attempts;
      return {
        success: false,
        message: `Incorrect OTP. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
      };
    }

    // Verification SUCCESS!
    record.verifiedAt = new Date().toISOString();
    this.saveOtpRecords(records);

    // Send Delivery Success Email to customer
    await emailService.sendDeliverySuccessEmail({
      customerName: record.customerName || 'Customer',
      customerEmail: record.customerEmail,
      orderId
    });

    return {
      success: true,
      message: 'OTP verified successfully! Order marked as Delivered.',
      verifiedAt: record.verifiedAt
    };
  }
};
