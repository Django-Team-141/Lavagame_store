const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export function apiUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    const detail = typeof data === "object" && data
      ? data.detail || data.message || Object.values(data).flat().join(" ")
      : data;
    throw new Error(detail || `API request failed: ${response.status}`);
  }
  return data;
}

export const api = {
  chat: (message, history = []) => request("/chats/", { method:"POST", body:JSON.stringify({message,history}) }),
  products: (params = "") => request(`/products/products/${params ? `?${params}` : ""}`),
  product: (id) => request(`/products/products/${id}/`),
  categories: () => request("/products/categories/"),
  brands: () => request("/products/brands/"),
  register: (payload) => request("/accounts/register/", { method:"POST", body:JSON.stringify(payload) }),
  login: async (payload) => {
    const data = await request("/accounts/token/", { method:"POST", body:JSON.stringify(payload) });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  },
  refresh: (refresh) => request("/accounts/token/refresh/", { method:"POST", body:JSON.stringify({refresh}) }),
  me: () => request("/accounts/me/"),
  cart: () => request("/cart/"),
  addToCart: (productId, quantity=1) => request("/cart/items/", {method:"POST", body:JSON.stringify({product_id:productId,quantity})}),
  updateCartItem: (itemId, quantity) => request(`/cart/items/${itemId}/`, {method:"PATCH",body:JSON.stringify({quantity})}),
  removeCartItem: (itemId) => request(`/cart/items/${itemId}/`, {method:"DELETE"}),
  addresses: () => request("/accounts/addresses/"),
  createAddress: (payload) => request("/accounts/addresses/", {method:"POST",body:JSON.stringify(payload)}),
  checkout: (payload) => request("/orders/checkout/", {method:"POST",body:JSON.stringify(payload)}),
  orders: () => request("/orders/"),
  order: (id) => request(`/orders/${id}/`),
  initiatePayment: (orderId) => request("/payments/initiate/", {method:"POST",body:JSON.stringify({order_id:orderId})}),
  verifyPayment: (paymentId) => request("/payments/verify/", {method:"POST",body:JSON.stringify({payment_id:paymentId})}),
};

export function isAuthenticated() {
  return Boolean(localStorage.getItem("access_token"));
}
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
