/**
 * Validation Utilities
 * Helper functions for data validation
 */

import { EncryptionType, ComputationOperation } from '../fhe/types';

export class ValidationUtils {
  /**
   * Validate encryption type
   */
  static isValidEncryptionType(type: string): type is EncryptionType {
    const validTypes: EncryptionType[] = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
    return validTypes.includes(type as EncryptionType);
  }

  /**
   * Validate computation operation
   */
  static isValidOperation(operation: string): operation is ComputationOperation {
    const validOps: ComputationOperation[] = [
      'add', 'sub', 'mul', 'div',
      'eq', 'ne', 'lt', 'lte', 'gt', 'gte',
      'min', 'max'
    ];
    return validOps.includes(operation as ComputationOperation);
  }

  /**
   * Validate value for encryption type
   */
  static isValidValueForType(value: any, type: EncryptionType): boolean {
    switch (type) {
      case 'uint8':
        return this.isValidUint(value, 8);
      case 'uint16':
        return this.isValidUint(value, 16);
      case 'uint32':
        return this.isValidUint(value, 32);
      case 'uint64':
        return this.isValidUint(value, 64);
      case 'bool':
        return typeof value === 'boolean';
      case 'address':
        return this.isValidEthereumAddress(value);
      default:
        return false;
    }
  }

  /**
   * Validate unsigned integer
   */
  private static isValidUint(value: any, bits: number): boolean {
    const num = Number(value);
    if (isNaN(num) || num < 0) return false;

    const max = bits === 64 ? Number.MAX_SAFE_INTEGER : Math.pow(2, bits) - 1;
    return num <= max;
  }

  /**
   * Validate Ethereum address
   */
  private static isValidEthereumAddress(address: any): boolean {
    return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate array of operands
   */
  static isValidOperands(operands: any[]): boolean {
    return Array.isArray(operands) && operands.length >= 2;
  }

  /**
   * Validate request body structure
   */
  static hasRequiredFields(obj: any, fields: string[]): boolean {
    return fields.every(field => obj.hasOwnProperty(field) && obj[field] !== undefined);
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(value: any): number | null {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Validate and parse JSON
   */
  static safeJSONParse(str: string): any | null {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }
}

export default ValidationUtils;
