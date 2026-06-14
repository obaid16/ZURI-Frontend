export const CATEGORIES = [];

export const PRODUCTS = [];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category) {
  return PRODUCTS.filter(p => p.category === category);
}

