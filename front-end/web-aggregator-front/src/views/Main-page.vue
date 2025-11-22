<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">LowPrice.com</h1>
        <div class="auth-buttons">
          <button class="btn-auth">sign up</button>
          <button class="btn-auth">sign in</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Search Section -->
      <div class="search-section">
        <div class="search-header">
          <h2 class="section-title">Price Aggregator</h2>
          <div class="city-selector">
            <MapPin :size="20" />
            <span class="city-label">City</span>
          </div>
        </div>

        <div class="search-inputs">
          <div class="input-wrapper">
            <Search class="input-icon" :size="18" />
            <input
                type="text"
                placeholder="Choose a store"
                class="search-input"
            />
          </div>
          <div class="input-wrapper">
            <Search class="input-icon" :size="18" />
            <input
                type="text"
                placeholder="Select a category"
                class="search-input"
            />
          </div>
          <div class="input-wrapper">
            <Search class="input-icon" :size="18" />
            <input
                type="text"
                placeholder="Search for a product or barcode"
                class="search-input"
            />
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="content-wrapper">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
          <div class="filters-card">
            <div class="store-filters">
              <label v-for="store in stores" :key="store.id" class="checkbox-label">
                <input
                    type="checkbox"
                    v-model="store.selected"
                    class="checkbox-input"
                />
                <span class="checkbox-text">{{ store.name }}</span>
              </label>
            </div>
          </div>

          <div class="additional-filters">
            <select class="filter-select">
              <option>Country of production</option>
            </select>
            <select class="filter-select">
              <option>Trademark</option>
            </select>
            <select class="filter-select">
              <option>Weight</option>
            </select>
            <button class="filter-button">
              Manufacturing technology
            </button>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          <div class="products-header">
            <h2 class="products-title">Selected product</h2>
            <select
                v-model="sortOrder"
                class="sort-select"
            >
              <option value="cheap">From cheap to expensive</option>
              <option value="expensive">From expensive to cheap</option>
            </select>
          </div>

          <div class="products-grid">
            <div
                v-for="product in sortedProducts"
                :key="product.id"
                class="product-card"
            >
              <div class="product-image">
                <div class="image-placeholder">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="45" cy="35" r="12" fill="currentColor"/>
                    <path d="M20 100 L40 70 L60 85 L100 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-prices">
                  <div
                      v-for="price in product.prices"
                      :key="price.store"
                      class="price-row"
                  >
                    <span class="price-store">{{ price.store }}</span>
                    <span class="price-value">{{ price.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, MapPin } from 'lucide-vue-next'

const stores = ref([
  { id: 1, name: 'Store 1', selected: true },
  { id: 2, name: 'Store 2', selected: false },
  { id: 3, name: 'Store 3', selected: true },
  { id: 4, name: 'Store 4', selected: false }
])

const sortOrder = ref('cheap')

const products = ref([
  {
    id: 1,
    name: 'Product 1',
    prices: [
      { store: 'Store 1', value: '30.49' },
      { store: 'Store 3', value: '52.39' }
    ]
  },
  {
    id: 2,
    name: 'Product 2',
    prices: [
      { store: 'Store 1', value: '29.99' },
      { store: 'Store 3', value: '51.99' }
    ]
  },
  {
    id: 3,
    name: 'Product 3',
    prices: [
      { store: 'Store 1', value: '34.49' },
      { store: 'Store 3', value: '57.59' }
    ]
  },
  {
    id: 4,
    name: 'Product 4',
    prices: [
      { store: 'Store 1', value: '25.89' },
      { store: 'Store 3', value: '50.39' }
    ]
  },
  {
    id: 5,
    name: 'Product 5',
    prices: [
      { store: 'Store 1', value: '28.33' },
      { store: 'Store 3', value: '51.39' }
    ]
  },
  {
    id: 6,
    name: 'Product 6',
    prices: [
      { store: 'Store 1', value: '30.59' },
      { store: 'Store 3', value: '53.39' }
    ]
  }
])

const sortedProducts = computed(() => {
  const sorted = [...products.value]
  sorted.sort((a, b) => {
    const priceA = parseFloat(a.prices[0].value)
    const priceB = parseFloat(b.prices[0].value)
    return sortOrder.value === 'cheap' ? priceA - priceB : priceB - priceA
  })
  return sorted
})
</script>

<style scoped>
/* Reset and base styles */
* {
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  background-color: #374151;
  color: white;
  padding: 12px 24px;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-auth {
  padding: 6px 16px;
  border: 1px solid white;
  border-radius: 9999px;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-auth:hover {
  background-color: #4b5563;
}

/* Main Container */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

/* Search Section */
.search-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #d1d5db;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-weight: 600;
}

.city-label {
  font-weight: 600;
}

.search-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .search-inputs {
    grid-template-columns: 1fr;
  }
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Content Wrapper */
.content-wrapper {
  display: flex;
  gap: 24px;
}

/* Sidebar */
.sidebar {
  width: 256px;
  flex-shrink: 0;
}

.filters-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #d1d5db;
}

.store-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.checkbox-text {
  color: #374151;
}

.additional-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-select,
.filter-button {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #1f2937;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.filter-select:focus,
.filter-button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-button {
  text-align: left;
  transition: background-color 0.2s;
}

.filter-button:hover {
  background-color: #f9fafb;
}

/* Products Main */
.products-main {
  flex: 1;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.products-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.sort-select {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.sort-select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.product-card {
  background-color: white;
  border-radius: 8px;
  border: 2px solid #1f2937;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.product-image {
  aspect-ratio: 1 / 1;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  color: #d1d5db;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.product-prices {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.price-store {
  color: #6b7280;
}

.price-value {
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>
