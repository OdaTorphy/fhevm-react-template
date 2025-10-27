/**
 * Server-side FHE Operations
 * Handles server-side FHE functionality (for API routes)
 */

export class FHEServer {
  /**
   * Validate encryption request
   */
  static validateEncryptionRequest(value: any, type: string): boolean {
    const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];

    if (!validTypes.includes(type)) {
      return false;
    }

    // Type-specific validation
    switch (type) {
      case 'uint8':
        return Number(value) >= 0 && Number(value) <= 255;
      case 'uint16':
        return Number(value) >= 0 && Number(value) <= 65535;
      case 'uint32':
        return Number(value) >= 0 && Number(value) <= 4294967295;
      case 'uint64':
        return Number(value) >= 0;
      case 'bool':
        return typeof value === 'boolean';
      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(String(value));
      default:
        return false;
    }
  }

  /**
   * Validate computation operation
   */
  static validateOperation(operation: string): boolean {
    const validOps = ['add', 'sub', 'mul', 'div', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'min', 'max'];
    return validOps.includes(operation);
  }

  /**
   * Validate contract address
   */
  static validateContractAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Sanitize input data
   */
  static sanitize(input: any): any {
    if (typeof input === 'string') {
      return input.trim();
    }
    return input;
  }

  /**
   * Generate mock encrypted data (for development)
   */
  static mockEncrypt(value: any, type: string): string {
    return `0x${Buffer.from(JSON.stringify({ value, type, timestamp: Date.now() })).toString('hex')}`;
  }

  /**
   * Parse mock encrypted data (for development)
   */
  static mockDecrypt(encryptedData: string): any {
    try {
      const hex = encryptedData.replace('0x', '');
      const json = Buffer.from(hex, 'hex').toString('utf8');
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

export default FHEServer;
