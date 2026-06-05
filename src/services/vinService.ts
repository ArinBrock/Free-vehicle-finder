/**
 * VIN Decoding and Verification Service
 * VIN Format: LLLLLLLLLLLLLLLL (17 characters)
 * 
 * Positions:
 * 1-3: World Manufacturer Identifier (WMI)
 * 4-8: Vehicle Descriptor Section (VDS)
 * 9: Check digit
 * 10: Model year
 * 11: Assembly plant
 * 12-17: Sequential number
 */

interface VINDecodedInfo {
  year?: number;
  make?: string;
  model?: string;
  engineType?: string;
  transmission?: string;
}

interface VINVerificationResult {
  isStolen: boolean;
  status: string;
  recordsFound: number;
}

const WMI_DATABASE: { [key: string]: string } = {
  '1G1': 'Chevrolet',
  '1GT': 'GMC',
  '2G1': 'Pontiac',
  '2T1': 'Toyota',
  '3T3': 'Toyota',
  '4T1': 'Toyota',
  '5J6': 'Honda',
  '1HG': 'Honda',
  '1HD': 'Harley-Davidson',
  'JH2': 'Honda',
  'JT2': 'Toyota',
  'JT3': 'Toyota',
  'JY1': 'Mazda',
  'KL1': 'Daewoo',
  'KMH': 'Hyundai',
  'LVV': 'Volvo',
  'MAJ': 'Jaguar',
  'MRT': 'Rolls-Royce',
  'SAJ': 'Jaguar',
  'SCC': 'Scion',
  'TMA': 'Toyota',
  'VIN': 'Volvo',
  'WBA': 'BMW',
  'WBS': 'BMW',
  'WVW': 'Volkswagen',
  'ZAR': 'Rolls-Royce',
  'ZFF': 'Ferrari',
  'ZM8': 'Zastava',
};

const MODEL_YEAR_MAP: { [key: string]: number } = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'T': 1996, 'V': 1997, 'W': 1998, 'X': 1999, 'Y': 2000,
  'Z': 2001, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
  '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
};

/**
 * Validate VIN checksum using the official algorithm
 */
function validateVINChecksum(vin: string): boolean {
  if (vin.length !== 17) return false;

  const transliteration: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  };

  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    const char = vin[i].toUpperCase();
    const value = transliteration[char] ?? 0;
    sum += value * weights[i];
  }

  const checkDigit = sum % 11;
  const expectedCheckDigit = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  return vin[8].toUpperCase() === expectedCheckDigit;
}

/**
 * Decode VIN to extract vehicle information
 */
export function decodeVIN(vin: string): VINDecodedInfo {
  if (!vin || vin.length !== 17) {
    return {};
  }

  const vinUpper = vin.toUpperCase();
  const wmi = vinUpper.substring(0, 3);
  const modelYearChar = vinUpper[9];

  return {
    make: WMI_DATABASE[wmi],
    year: MODEL_YEAR_MAP[modelYearChar],
    model: decodeModel(vinUpper),
    engineType: decodeEngineType(vinUpper),
    transmission: decodeTransmission(vinUpper),
  };
}

/**
 * Decode model information (example based on position 5)
 */
function decodeModel(vin: string): string {
  const modelCode = vin[4];
  
  const models: { [key: string]: string } = {
    'A': 'Standard',
    'B': 'Sport',
    'C': 'Luxury',
    'D': 'Extended',
    'E': 'Premium',
  };

  return models[modelCode] || 'Standard';
}

/**
 * Decode engine type (example based on position 7)
 */
function decodeEngineType(vin: string): string {
  const engineCode = vin[6];

  const engines: { [key: string]: string } = {
    '1': '2.0L 4-Cylinder',
    '2': '2.5L 4-Cylinder',
    '3': '3.0L V6',
    '4': '3.5L V6',
    '5': '4.0L V8',
    '6': '5.0L V8',
    '7': 'Hybrid',
    '8': 'Electric',
  };

  return engines[engineCode] || 'Standard Engine';
}

/**
 * Decode transmission type (example based on position 8)
 */
function decodeTransmission(vin: string): string {
  const transCode = vin[7];

  const transmissions: { [key: string]: string } = {
    'A': 'Automatic 4-Speed',
    'B': 'Automatic 5-Speed',
    'C': 'Automatic 6-Speed',
    'D': 'Automatic 8-Speed',
    'E': 'Automatic 10-Speed',
    'M': 'Manual 5-Speed',
    'N': 'CVT',
  };

  return transmissions[transCode] || 'Automatic';
}

/**
 * Verify VIN against theft databases
 * NOTE: This is a mock implementation. In production, connect to real NHTSA or police databases
 */
export async function verifyVIN(vin: string): Promise<VINVerificationResult> {
  try {
    if (!validateVINChecksum(vin)) {
      return {
        isStolen: false,
        status: 'Invalid checksum',
        recordsFound: 0,
      };
    }

    // TODO: Connect to real verification services:
    // - NHTSA (National Highway Traffic Safety Administration)
    // - NICB (National Insurance Crime Bureau)
    // - Local police databases
    // - FBI stolen vehicle database

    // Mock verification
    const stolenList = [
      '1HGCM82633A123456',
      '2T1BF1KA3CC123456',
      'WBAUL53579CS98765',
    ];

    const isStolen = stolenList.includes(vin.toUpperCase());

    return {
      isStolen,
      status: isStolen ? 'STOLEN ALERT' : 'VALID',
      recordsFound: isStolen ? 1 : 0,
    };
  } catch (error) {
    console.error('VIN verification error:', error);
    return {
      isStolen: false,
      status: 'Verification unavailable',
      recordsFound: 0,
    };
  }
}

/**
 * Get NHTSA vehicle data
 * Real implementation would call: https://vpic.nhtsa.dot.gov/api/
 */
export async function getNHTSAVehicleData(vin: string) {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('NHTSA API error:', error);
    return null;
  }
}
