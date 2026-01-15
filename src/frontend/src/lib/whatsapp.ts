/**
 * Normalizes a phone number for WhatsApp links
 * Handles Indonesian local and international formats
 * @param phoneNumber - The phone number to normalize
 * @returns Normalized phone number for WhatsApp URL
 */
export function normalizeWhatsAppNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle Indonesian local numbers starting with 0
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // Ensure it starts with country code
  if (!cleaned.startsWith('62') && cleaned.length >= 9) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

/**
 * Creates a WhatsApp link from a phone number
 * @param phoneNumber - The phone number to create a link for
 * @returns WhatsApp URL
 */
export function createWhatsAppLink(phoneNumber: string): string {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  return `https://wa.me/${normalized}`;
}

/**
 * Checks if a string looks like a phone number
 * @param text - The text to check
 * @returns True if the text appears to be a phone number
 */
export function isPhoneNumber(text: string): boolean {
  // Check if text contains mostly digits and common phone separators
  const digitsOnly = text.replace(/[\s\-\(\)\+]/g, '');
  const digitCount = digitsOnly.replace(/\D/g, '').length;
  
  // Phone numbers typically have at least 9 digits
  return digitCount >= 9 && digitCount <= 15;
}
