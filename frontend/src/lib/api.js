// API utility functions for making HTTP requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10);


  timeout?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

/**
 * Make an API request
 */
async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
): Promise {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        response.statusText,
        errorData.message || "An error occurred"
      );
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}

/**
 * API methods
 */
export const api = {
  // GET request
  get: (endpoint: string, options?: RequestOptions) =>
    apiRequest(endpoint, { ...options, method: "GET" }),

  // POST request
  post: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request
  put: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: (endpoint: string, options?: RequestOptions) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),
};

/**
 * Auth-specific API calls
 */
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/auth/signup", data),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get("/auth/me"),

  refreshToken: () => api.post("/auth/refresh"),
};

/**
 * Orders API calls
 */
export const ordersApi = {
  getAll: (params?: Record {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return api.get(`/orders${queryString}`);
  },

  getById: (id: string) => api.get(`/orders/${id}`),

  create: (data) => api.post("/orders", data),

  update: (id: string, data) => api.put(`/orders/${id}`, data),

  delete: (id: string) => api.delete(`/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

/**
 * Users API calls
 */
export const usersApi = {
  getAll: (params?: Record {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return api.get(`/users${queryString}`);
  },

  getById: (id: string) => api.get(`/users/${id}`),

  create: (data) => api.post("/users", data),

  update: (id: string, data) => api.put(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
};

/**
 * File upload utility
 */
export async function uploadFile(
  file: File,
  endpoint: string = "/upload"
): Promise {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
}

export { ApiError };
