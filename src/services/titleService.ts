import axios from 'axios';

interface TitleRecord {
  id: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone?: string;
  registrationDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Unknown';
  state: string;
  plateNumber?: string;
  lienHolder?: string;
  notes?: string;
}

const BASE_URL = 'https://api.example.com'; // Replace with your API endpoint

/**
 * Verify title for a vehicle using VIN or plate number
 */
export async function verifyTitle(
  searchType: 'vin' | 'plate',
  searchValue: string,
  state?: string
): Promise<TitleRecord | null> {
  try {
    const response = await axios.post(`${BASE_URL}/title/verify`, {
      type: searchType,
      value: searchValue,
      state: state || 'US',
    });

    return response.data || null;
  } catch (error) {
    console.error('Title verification error:', error);
    return null;
  }
}

/**
 * Search for title records
 */
export async function searchTitleRecords(
  searchType: 'vin' | 'plate',
  searchValue: string
): Promise<TitleRecord[]> {
  try {
    const response = await axios.get(`${BASE_URL}/title/search`, {
      params: {
        type: searchType,
        value: searchValue,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Title search error:', error);
    // Return mock data for demonstration
    return getMockTitleRecords(searchValue);
  }
}

/**
 * Mock title records for demonstration
 */
function getMockTitleRecords(searchValue: string): TitleRecord[] {
  const mockRecords: TitleRecord[] = [
    {
      id: '1',
      ownerName: 'John Smith',
      ownerAddress: '123 Main Street, Springfield, IL 62701',
      ownerPhone: '(217) 555-0147',
      registrationDate: '01/15/2020',
      expirationDate: '01/15/2026',
      status: 'Active',
      state: 'Illinois',
      plateNumber: 'ABC-1234',
      notes: 'Clean title - No liens',
    },
  ];

  return mockRecords;
}

/**
 * Check if a vehicle title has been reported stolen
 */
export async function checkStolenTitle(vin: string): Promise<boolean> {
  try {
    const response = await axios.get(`${BASE_URL}/title/stolen-check`, {
      params: { vin },
    });

    return response.data?.isStolen || false;
  } catch (error) {
    console.error('Stolen title check error:', error);
    return false;
  }
}

/**
 * Get lien information for a vehicle
 */
export async function getLienInformation(
  vin: string,
  state: string
): Promise<{ hasLien: boolean; lienholder?: string }> {
  try {
    const response = await axios.get(`${BASE_URL}/title/lien-check`, {
      params: { vin, state },
    });

    return response.data || { hasLien: false };
  } catch (error) {
    console.error('Lien check error:', error);
    return { hasLien: false };
  }
}

/**
 * Verify vehicle registration
 */
export async function verifyRegistration(vin: string, plateNumber: string) {
  try {
    const response = await axios.post(`${BASE_URL}/registration/verify`, {
      vin,
      plateNumber,
    });

    return response.data || null;
  } catch (error) {
    console.error('Registration verification error:', error);
    return null;
  }
}

/**
 * Check for active recalls
 */
export async function checkRecalls(vin: string) {
  try {
    // NHTSA Recalls API
    const response = await axios.get(
      `https://api.nhtsa.dot.gov/recalls/vehicleRecalls?vin=${vin}&format=json`
    );

    return response.data || [];
  } catch (error) {
    console.error('Recalls check error:', error);
    return [];
  }
}
