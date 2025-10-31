/**
 * Smart contract configuration and ABI
 */

export const CONTRACT_ADDRESS = '0xc61a1997F87156dfC96CA14E66fA9E3A02D36358';

export const CONTRACT_ABI = [
  // Station Management
  {
    name: 'registerStation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [],
  },
  {
    name: 'deactivateStation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'station', type: 'address' }],
    outputs: [],
  },
  {
    name: 'getStationDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'station', type: 'address' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'operator', type: 'address' },
      { name: 'active', type: 'bool' },
      { name: 'registeredAt', type: 'uint256' },
      { name: 'reportCount', type: 'uint256' },
    ],
  },

  // Pollution Reporting
  {
    name: 'submitReport',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'encryptedMeasurement', type: 'bytes' },
      { name: 'pollutantType', type: 'uint8' },
      { name: 'severityLevel', type: 'uint8' },
    ],
    outputs: [],
  },
  {
    name: 'verifyReport',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'reportId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getReportDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'reportId', type: 'uint256' }],
    outputs: [
      { name: 'station', type: 'address' },
      { name: 'encryptedMeasurement', type: 'bytes' },
      { name: 'pollutantType', type: 'uint8' },
      { name: 'severityLevel', type: 'uint8' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'verified', type: 'bool' },
    ],
  },

  // Threshold Management
  {
    name: 'updateThreshold',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'pollutantType', type: 'uint8' },
      { name: 'newThreshold', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'thresholds',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'pollutantType', type: 'uint8' }],
    outputs: [{ name: '', type: 'uint256' }],
  },

  // Statistics
  {
    name: 'getStatistics',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalStations', type: 'uint256' },
      { name: 'totalReports', type: 'uint256' },
      { name: 'activeStations', type: 'uint256' },
    ],
  },
  {
    name: 'totalStations',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalReports',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'nextReportId',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },

  // Events
  {
    name: 'StationRegistered',
    type: 'event',
    inputs: [
      { name: 'station', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'operator', type: 'address', indexed: false },
    ],
  },
  {
    name: 'ReportSubmitted',
    type: 'event',
    inputs: [
      { name: 'reportId', type: 'uint256', indexed: true },
      { name: 'station', type: 'address', indexed: true },
      { name: 'pollutantType', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'AlertTriggered',
    type: 'event',
    inputs: [
      { name: 'reportId', type: 'uint256', indexed: true },
      { name: 'pollutantType', type: 'uint8', indexed: false },
    ],
  },
  {
    name: 'ReportVerified',
    type: 'event',
    inputs: [
      { name: 'reportId', type: 'uint256', indexed: true },
      { name: 'verifier', type: 'address', indexed: true },
    ],
  },
  {
    name: 'ThresholdUpdated',
    type: 'event',
    inputs: [
      { name: 'pollutantType', type: 'uint8', indexed: true },
      { name: 'newThreshold', type: 'uint256', indexed: false },
    ],
  },
];

// Pollutant type constants
export const POLLUTANT_TYPES = {
  PM25: 1,
  PM10: 2,
  SO2: 3,
  NO2: 4,
  OZONE: 5,
  HEAVY_METALS: 6,
} as const;
