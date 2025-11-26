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

      <!-- Basket Section -->
      <div class="basket-wrapper">
        <h2 class="basket-title">Cheapest Basket</h2>

        <div class="basket-content">
          <div class="basket-products">
            <div
                v-for="product in basketProducts"
                :key="product.id"
                class="basket-card"
            >
              <div class="product-image">
                <div class="image-placeholder">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="45" cy="35" r="12" fill="currentColor"/>
                    <path d="M20 100 L40 70 L60 85 L100 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>

              <div class="product-details">
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

                <!-- Moved actions to bottom left with horizontal layout -->
                <div class="product-actions">
                  <button @click="removeFromBasket(product.id)" class="action-btn basket-icon" title="Remove from basket">
                    <ShoppingCart :size="20" />
                  </button>
                  <button @click="toggleFavorite(product.id)" class="action-btn star-btn" :class="{ active: product.isFavorite }" title="Toggle favorite">
                    <Star :size="20" :fill="product.isFavorite ? '#fbbf24' : 'none'" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="basket-footer">
            <button class="add-product-btn">
              <Plus :size="20" />
              Add another product
            </button>

            <div class="total-price">
              <span class="total-label">Lowest total price:</span>
              <span class="total-value">{{ lowestStore }} - {{ totalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, MapPin, ShoppingCart, Star, Plus } from 'lucide-vue-next'

const basketProducts = ref([
  {
    id: 1,
    name: 'Product 1',
    isFavorite: false,
    prices: [
      { store: 'Store 1', value: '49.99' },
      { store: 'Store 2', value: '50.89' },
      { store: 'Store 3', value: '51.49' }
    ]
  },
  {
    id: 2,
    name: 'Product 2',
    isFavorite: false,
    prices: [
      { store: 'Store 1', value: '49.99' },
      { store: 'Store 2', value: '50.89' },
      { store: 'Store 3', value: '51.49' }
    ]
  },
  {
    id: 3,
    name: 'Product 3',
    isFavorite: false,
    prices: [
      { store: 'Store 1', value: '49.99' },
      { store: 'Store 2', value: '50.89' },
      { store: 'Store 3', value: '51.49' }
    ]
  }
])

const lowestStore = computed(() => {
  const storeTotals = {}

  basketProducts.value.forEach(product => {
    product.prices.forEach(price => {
      if (!storeTotals[price.store]) {
        storeTotals[price.store] = 0
      }
      storeTotals[price.store] += parseFloat(price.value)
    })
  })

  let lowestStoreName = ''
  let lowestTotal = Infinity

  Object.entries(storeTotals).forEach(([store, total]) => {
    if (total < lowestTotal) {
      lowestTotal = total
      lowestStoreName = store
    }
  })

  return lowestStoreName
})

const totalPrice = computed(() => {
  const storeTotals = {}

  basketProducts.value.forEach(product => {
    product.prices.forEach(price => {
      if (!storeTotals[price.store]) {
        storeTotals[price.store] = 0
      }
      storeTotals[price.store] += parseFloat(price.value)
    })
  })

  const lowest = Math.min(...Object.values(storeTotals))
  return lowest.toFixed(2)
})

const removeFromBasket = (productId) => {
  basketProducts.value = basketProducts.value.filter(p => p.id !== productId)
}

const toggleFavorite = (productId) => {
  const product = basketProducts.value.find(p => p.id === productId)
  if (product) {
    product.isFavorite = !product.isFavorite
  }
}
</script>

<style scoped>
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

/* Basket Section */
.basket-wrapper {
  margin-top: 32px;
}

.basket-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.basket-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basket-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (min-width: 768px) {
  .basket-products {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .basket-products {
    grid-template-columns: repeat(3, 1fr);
  }
}

.basket-card {
  background-color: white;
  border-radius: 8px;
  border: 2px solid #1f2937;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.basket-card:hover {
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

.product-details {
  padding: 16px;
  /* Added flex to push actions to bottom */
  display: flex;
  flex-direction: column;
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
  margin-bottom: 12px;
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

/* Updated actions layout to horizontal at bottom left */
.product-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Made basket icon dark instead of red */
.basket-icon {
  color: #1f2937;
}

.star-btn {
  color: #fbbf24;
}

.star-btn.active {
  color: #fbbf24;
}

/* Basket Footer */
.basket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
}

.add-product-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border: 2px solid #1f2937;
  border-radius: 4px;
  background-color: white;
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-product-btn:hover {
  background-color: #1f2937;
  color: white;
}

.total-price {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.total-label {
  margin-right: 8px;
}

.total-value {
  font-weight: 700;
}

@media (max-width: 640px) {
  .basket-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .total-price {
    text-align: center;
  }
}
</style>
