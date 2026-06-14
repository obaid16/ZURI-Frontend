const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// Helper to get authorization token header
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("zuri_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch API request utility
export async function apiRequest(endpoint, method = "GET", body = null, isFormData = false) {
  const headers = {
    ...getAuthHeaders(),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!res.ok) {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const errorData = isJson ? await res.json() : {};
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

// Helper to format/prefix backend local media upload paths
export function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return imagePath;
}
