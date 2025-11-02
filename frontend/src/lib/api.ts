// API utility functions for making HTTP requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10);

interface RequestOptions extends RequestInit {
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
): Promise<Response> {
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
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
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
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  // POST request
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

/**
 * Auth-specific API calls
 */
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: any; token: string }>("/auth/login", { email, password }),

  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<{ user: any; token: string }>("/auth/signup", data),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get<{ user: any }>("/auth/me"),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh"),
};

/**
 * Orders API calls
 */
export const ordersApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return api.get<{ orders: any[] }>(`/orders${queryString}`);
  },

  getById: (id: string) => api.get<{ order: any }>(`/orders/${id}`),

  create: (data: any) => api.post<{ order: any }>("/orders", data),

  update: (id: string, data: any) => api.put<{ order: any }>(`/orders/${id}`, data),

  delete: (id: string) => api.delete(`/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch<{ order: any }>(`/orders/${id}/status`, { status }),
};

/**
 * Users API calls
 */
export const usersApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return api.get<{ users: any[] }>(`/users${queryString}`);
  },

  getById: (id: string) => api.get<{ user: any }>(`/users/${id}`),

  create: (data: any) => api.post<{ user: any }>("/users", data),

  update: (id: string, data: any) => api.put<{ user: any }>(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
};

/**
 * File upload utility
 */
export async function uploadFile(
  file: File,
  endpoint: string = "/upload"
): Promise<{ url: string }> {
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
