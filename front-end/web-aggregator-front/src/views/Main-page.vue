<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">LowPrice.com</h1>
        <div class="auth-buttons">
          <button class="btn-auth" @click="goToRegister" >sign up</button>
          <button class="btn-auth" @click="goToLogin">sign in</button>
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
            <MapPin :size="20"/>
            <span class="city-label">City</span>
          </div>
        </div>

        <div class="search-inputs">
          <div class="input-wrapper">
            <Search class="input-icon" :size="18"/>
            <input
                type="text"
                placeholder="Choose a store"
                class="search-input"
            />
          </div>
          <div class="input-wrapper">
            <Search class="input-icon" :size="18"/>
            <input
                type="text"
                placeholder="Select a category"
                class="search-input"
            />
          </div>
          <div class="input-wrapper">
            <Search class="input-icon" :size="18"/>
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
                v-for="product in paginatedProducts" :key="product.id"
                class="product-card"
            >
              <!-- Image carousel -->
              <div class="product-image">
                <button class="nav-btn left" @click="prevImage(product.id)">&lt;</button>
                <transition name="fade" mode="out-in">
                  <img
                      v-if="product.images && product.images.length"
                      :key="currentImageIndex[product.id]"
                      :src="product.images[currentImageIndex[product.id]]"
                      alt="Product Image"
                      class="image"
                  />
                </transition>
                <button class="nav-btn right" @click="nextImage(product.id)">&gt;</button>
                <!-- Dots -->
                <div class="dots" v-if="product.images && product.images.length > 1">
              <span
            v-for="(img, index) in product.images"
            :key="index"
            :class="['dot', { active: currentImageIndex[product.id] === index }]"
            @click="goToImage(product.id, index)"
             ></span>
                </div>
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>

                <!-- Цены по магазинам -->
                <div class="product-prices">
                  <div
                      v-for="source in product.sources"
                      :key="source._id"
                      class="price-row"
                  >
                    <span class="price-store">{{ source.store }}</span>
                    <span class="price-value">{{ source.price }} ₴</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="pagination">
            <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
              Prev
            </button>

            <div class="page-numbers">
              <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
            </div>

            <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
              Next
            </button>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {Search, MapPin} from 'lucide-vue-next'
import {getAllUnitedProducts} from "@/api/pages/main-page-all-products.js";
import router from "@/router/index.js";

const products = ref([]);
const currentImageIndex = ref({});
const sortOrder = ref('cheap')

const paginatedProducts = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);


const goToLogin = () => router.push('/auth/login')
const goToRegister = () => router.push('/auth/register')


onMounted(() => {
  loadProducts();
});

function nextImage(productId) {
  const p = products.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] + 1) % p.images.length;
}

function prevImage(productId) {
  const p = products.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + p.images.length) % p.images.length;
}

function goToImage(productId, index) {
  currentImageIndex.value[productId] = index;
}

async function loadProducts() {
  try {
    const response = await getAllUnitedProducts();
    products.value = response.data.map(p => {
      currentImageIndex.value[p.id] = 0;
      return {
        ...p,
        images: p.sources.map(s => s.imageLink)
      }
    });

    totalPages.value = Math.ceil(products.value.length / pageSize.value);
    updatePaginatedProducts();
  } catch (error) {
    console.error("Error loading pages", error);
  }
}


function updatePaginatedProducts() {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedProducts.value = products.value.slice(start, end);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updatePaginatedProducts();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePaginatedProducts();
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  padding: 8px;
}

.product-image img {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
  border-radius: 4px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  z-index: 10;
}

.nav-btn.left { left: 4px; }
.nav-btn.right { right: 4px; }

.dots {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #cbd5e1;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #1f2937;
}

/* Fade animation for transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #d1d5db;
}

.page-btn {
  padding: 8px 20px;
  border: 2px solid #1f2937;
  background-color: white;
  border-radius: 9999px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.page-indicator {
  padding: 4px 12px;
  border: 1px solid #1f2937;
  border-radius: 6px;
  background: #fff;
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
