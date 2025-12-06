// API configuration
// Update this URL to your backend server address
const API_BASE_URL = 'http://localhost:3000/api';

export const fetchDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

export const fetchDestinationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching destination:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default {
  fetchDestinations,
  fetchDestinationById,
  checkHealth,
};
