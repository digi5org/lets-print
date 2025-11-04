// API utility functions for making requests to the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Make an authenticated API request to the backend
 * @param {string} endpoint - API endpoint (e.g., '/api/products')
 * @param {Object} options - Fetch options
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} API response data
 */
export async function fetchAPI(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

/**
 * Client-side API helper that uses session token
 * Use this in client components
 */
export class ApiClient {
  constructor(token) {
    this.token = token;
  }

  async get(endpoint) {
    return fetchAPI(endpoint, { method: 'GET' }, this.token);
  }

  async post(endpoint, data) {
    return fetchAPI(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      this.token
    );
  }

  async put(endpoint, data) {
    return fetchAPI(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      this.token
    );
  }

  async patch(endpoint, data) {
    return fetchAPI(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      this.token
    );
  }

  async delete(endpoint) {
    return fetchAPI(endpoint, { method: 'DELETE' }, this.token);
  }
}

/**
 * Register a new client user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} API response
 */
export async function registerUser(userData) {
  return fetchAPI('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Get all products
 * @returns {Promise<Object>} API response with products
 */
export async function getProducts() {
  return fetchAPI('/api/products');
}
