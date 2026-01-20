// Sort items
export const sortItems = (items, sortBy) => {
  const sorted = [...items];

  // Helper function to get numeric price
  const getPrice = (item) => item.price === "SIS50" ? item.originalPrice / 2 : item.price;

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));
    case 'price-high':
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // fallback 0 if rating missing
    default:
      return sorted; // no sorting
  }
};
