/**
 * Security Utilities
 * Helper functions for security operations
 */

export class SecurityUtils {
  /**
   * Validate Ethereum address
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate signature format
   */
  static isValidSignature(signature: string): boolean {
    return /^0x[a-fA-F0-9]{130}$/.test(signature);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate numeric range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Rate limiting helper (simple implementation)
   */
  private static requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  static checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(identifier);

    if (!record || now - record.timestamp > windowMs) {
      this.requestCounts.set(identifier, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Hash data (simple implementation)
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify data integrity
   */
  static async verifyHash(data: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.hashData(data);
    return actualHash === expectedHash;
  }
}

export default SecurityUtils;
