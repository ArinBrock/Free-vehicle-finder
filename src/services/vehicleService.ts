import axios from 'axios';

const BASE_URL = 'https://api.example.com'; // Replace with your API endpoint

/**
 * Search for free vehicles near a specific location
 */
export async function getVehiclesNearby(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
) {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/nearby`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching nearby vehicles:', error);
    // Return mock data for demonstration
    return getMockVehicles(latitude, longitude);
  }
}

/**
 * Search for vehicles by query string
 */
export async function searchVehicles(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/search`, {
      params: { q: query },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error searching vehicles:', error);
    return [];
  }
}

/**
 * Mock data for demonstration purposes
 */
function getMockVehicles(baseLat: number, baseLng: number) {
  return [
    {
      id: '1',
      year: 2010,
      make: 'Honda',
      model: 'Civic',
      condition: 'Good Condition',
      description: 'Runs great, clean interior, needs some exterior work. Free to good home!',
      latitude: baseLat + 0.01,
      longitude: baseLng + 0.01,
      source: 'Facebook Marketplace',
      link: 'https://facebook.com',
      postedBy: 'John Smith',
      postedDate: '2 days ago',
      mileage: '145,000 mi',
      color: 'Silver',
      body: 'Sedan',
    },
    {
      id: '2',
      year: 2008,
      make: 'Toyota',
      model: 'Corolla',
      condition: 'Fair Condition',
      description: 'Old but reliable. Engine runs well. Needs some minor repairs.',
      latitude: baseLat - 0.02,
      longitude: baseLng + 0.015,
      source: 'Craigslist',
      link: 'https://craigslist.org',
      postedBy: 'Jane Doe',
      postedDate: '1 week ago',
      mileage: '178,000 mi',
      color: 'White',
      body: 'Sedan',
    },
    {
      id: '3',
      year: 2006,
      make: 'Ford',
      model: 'F-150',
      condition: 'Needs Work',
      description: 'Project truck. Runs but needs engine work. Perfect for mechanic.',
      latitude: baseLat + 0.015,
      longitude: baseLng - 0.01,
      source: 'Nextdoor',
      link: 'https://nextdoor.com',
      postedBy: 'Mike Johnson',
      postedDate: '5 days ago',
      mileage: '210,000 mi',
      color: 'Red',
      body: 'Pickup Truck',
    },
    {
      id: '4',
      year: 2009,
      make: 'Chevrolet',
      model: 'Malibu',
      condition: 'Good Condition',
      description: 'Clean title, no accidents. Great family car. Must go this week!',
      latitude: baseLat - 0.012,
      longitude: baseLng - 0.018,
      source: 'Facebook Marketplace',
      link: 'https://facebook.com',
      postedBy: 'Sarah Williams',
      postedDate: '3 days ago',
      mileage: '132,000 mi',
      color: 'Blue',
      body: 'Sedan',
    },
  ];
}
