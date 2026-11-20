// Cryptographic and Unique Identifier Utilities

export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateOtp() {
  // Cryptographically secure 6-digit integer
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const sixDigit = 100000 + (array[0] % 900000);
  return sixDigit.toString();
}

export function generateUserId(role = 'customer') {
  const prefix = role === 'delivery_partner' ? 'QB-RIDER' : role === 'admin' ? 'QB-ADMIN' : 'QB-CUST';
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randNum}`;
}

export function generateOrderId() {
  const randNum = Math.floor(10000000 + Math.random() * 90000000);
  return `QB${randNum}`;
}
