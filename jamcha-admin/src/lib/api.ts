import { API_BASE_URL, LOCAL_STORAGE_KEYS } from "./constants";
import { toast } from "@/hooks/use-toast";
import i18n from "./i18n";

// Custom error types for better error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(
    public message: string,
    public endpoint: string
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

// Main request function with comprehensive error handling
async function request(endpoint: string, options: RequestOptions = {}): Promise<any> {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    const { body, headers: customHeaders = {}, ...restOptions } = options;

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(customHeaders as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const requestBody = body ? JSON.stringify(body) : undefined;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,
      body: requestBody,
    });

    // Handle different response scenarios
    if (!response.ok) {
      return handleErrorResponse(response, endpoint);
    }

    // Handle successful responses
    return handleSuccessResponse(response);

  } catch (error) {
    return handleRequestError(error, endpoint);
  }
}

// Handle error responses
async function handleErrorResponse(response: Response, endpoint: string): Promise<never> {
  if (response.status === 401) {
    handleUnauthorized();
    throw new ApiError(401, 'Unauthorized', endpoint);
  }

  if (response.status === 403) {
    toast({
      title: i18n.t("forbiddenTitle"),
      description: i18n.t("forbiddenDescription1"),
      variant: "destructive",
    });
    throw new ApiError(403, 'Forbidden', endpoint);
  }

  // Extract error message from response
  let errorMessage = response.statusText;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // Keep default statusText if JSON parsing fails
  }

  throw new ApiError(response.status, errorMessage, endpoint);
}

// Handle successful responses
async function handleSuccessResponse(response: Response): Promise<any> {
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Handle responses that might not be JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

// Handle request errors (network issues, etc.)
function handleRequestError(error: unknown, endpoint: string): never {
  if (error instanceof ApiError) {
    throw error;
  }

  // Handle network errors or other fetch failures
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new NetworkError('Network error - please check your connection', endpoint);
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  throw new NetworkError(errorMessage, endpoint);
}

// Handle unauthorized access
function handleUnauthorized(): void {
  // Clear invalid token
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  // Redirect to login page (only in browser environment)
  if (typeof window !== 'undefined') {
    window.location.replace("/login");
  }
}

// Main API object with HTTP methods
export const api = {
  get: (endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    request(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request(endpoint, { ...options, method: "POST", body }),

  put: (endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request(endpoint, { ...options, method: "PUT", body }),

  patch: (endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request(endpoint, { ...options, method: "PATCH", body }),

  delete: (endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    request(endpoint, { ...options, method: "DELETE" }),

  editArticleStatus: (id: number, status: string) =>
    request(`/articles/${id}/edit-status`, {
      method: "PATCH",
      body: { status },
    }),
};

// Utility function for handling API responses with optional error handling
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  onError?: (error: ApiError | NetworkError) => void
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    if (onError && (error instanceof ApiError || error instanceof NetworkError)) {
      onError(error);
    }
    return null;
  }
}

// Type guards for error checking
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

// Utility function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
}

// Utility function to get current token
export function getAuthToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
}

// Utility function to set auth token
export function setAuthToken(token: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
}

// Utility function to clear auth token
export function clearAuthToken(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
}