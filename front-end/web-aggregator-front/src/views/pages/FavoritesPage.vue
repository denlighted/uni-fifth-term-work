<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">LowPrice.com</h1>
        <div class="auth-buttons">
          <button class="btn-auth">sign out</button>
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

      <!-- Favorites Section -->
      <div class="favorites-section">
        <div class="favorites-header">
          <h2 class="favorites-title">Favorite products</h2>
          <select
              v-model="sortOrder"
              class="sort-select"
          >
            <option value="date">Date added</option>
            <option value="name">Product name</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div class="favorites-grid">
          <div
              v-for="product in sortedFavorites"
              :key="product.id"
              class="favorite-card"
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
            </div>
            <div class="product-actions">
              <button
                  @click="removeFromFavorites(product.id)"
                  class="action-button remove-button"
                  title="Remove from favorites"
              >
                <X :size="20" />
              </button>
              <button
                  class="action-button favorite-button active"
                  title="In favorites"
              >
                <Star :size="20" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="favorites.length === 0" class="empty-state">
          <Star :size="64" class="empty-icon" />
          <p class="empty-text">No favorite products yet</p>
          <p class="empty-subtext">Add products to your favorites to see them here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, MapPin, X, Star } from 'lucide-vue-next'

const sortOrder = ref('date')

const favorites = ref([
  {
    id: 1,
    name: 'Product 1',
    dateAdded: new Date('2024-01-15'),
    price: 30.49
  },
  {
    id: 2,
    name: 'Product 2',
    dateAdded: new Date('2024-01-20'),
    price: 29.99
  },
  {
    id: 3,
    name: 'Product 3',
    dateAdded: new Date('2024-01-25'),
    price: 34.49
  }
])

const sortedFavorites = computed(() => {
  const sorted = [...favorites.value]

  if (sortOrder.value === 'date') {
    sorted.sort((a, b) => b.dateAdded - a.dateAdded)
  } else if (sortOrder.value === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOrder.value === 'price') {
    sorted.sort((a, b) => a.price - b.price)
  }

  return sorted
})

const removeFromFavorites = (id) => {
  const index = favorites.value.findIndex(p => p.id === id)
  if (index !== -1) {
    favorites.value.splice(index, 1)
  }
}
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

/* Favorites Section */
.favorites-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 24px;
  border: 1px solid #d1d5db;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.favorites-title {
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

/* Favorites Grid */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (min-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .favorites-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.favorite-card {
  background-color: white;
  border-radius: 8px;
  border: 2px solid #1f2937;
  overflow: hidden;
  transition: box-shadow 0.2s;
  position: relative;
}

.favorite-card:hover {
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
  text-align: center;
}

.product-name {
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-size: 16px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  transform: scale(1.1);
}

.remove-button {
  color: #ef4444;
}

.favorite-button {
  color: #fbbf24;
}

.favorite-button.active {
  color: #fbbf24;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-icon {
  color: #d1d5db;
  margin: 0 auto 16px;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
</style>
