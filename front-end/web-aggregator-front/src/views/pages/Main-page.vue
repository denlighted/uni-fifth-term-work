<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <h1 class="logo">LowPrice.com</h1>
        </router-link>
        <div class="auth-buttons">
          <template v-if="!user">
            <button class="btn-auth" @click="goToRegister">sign up</button>
            <button class="btn-auth" @click="goToLogin">sign in</button>
          </template>
          <template v-else>
            <a href="/profile" class="user-name">Hello, {{ user.firstName }}</a>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Search Section -->
      <div class="search-section">
        <div class="search-header">
          <h2 class="section-title">Price Aggregator</h2>
          <div class="city-selector-dropdown">
            <MapPin :size="20" />
            <select v-model="selectedCity" class="city-select">
              <option value="Kyiv">Kyiv</option>
            </select>
          </div>
        </div>

        <div class="search-inputs">
          <div class="input-wrapper">
            <Search class="input-icon" :size="18"/>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Enter the product name"
                class="search-input"
            />
          </div>
          <div class="input-wrapper">
            <Search class="input-icon" :size="18"/>
            <input
                v-model="searchCategory"
                type="text"
                placeholder="Select a category"
                class="search-input"
            />
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="content-wrapper">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
          <div class="additional-filters">
            <select class="filter-select">
              <option>Country of production</option>
            </select>
            <select class="filter-select">
              <option>Trademark</option>
            </select>
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
                v-for="product in products" :key="product._id"
                class="product-card"
            >
              <!-- Image carousel -->
              <div class="product-image" @click="goToProduct(product.slug)">
                <button class="nav-btn left" @click.stop="prevImage(product._id)">&lt;</button>
                <transition name="fade" mode="out-in">
                  <img
                      v-if="product.images && product.images.length"
                      :key="currentImageIndex[product._id]"
                      :src="product.images[currentImageIndex[product._id]]"
                      alt="Product Image"
                      class="image"
                  />
                </transition>
                <button class="nav-btn right" @click.stop="nextImage(product._id)">&gt;</button>
                <!-- Dots -->
                <div class="dots" v-if="product.images && product.images.length > 1">
                  <span
                      v-for="(img, index) in product.images"
                      :key="index"
                      :class="['dot', { active: currentImageIndex[product._id] === index }]"
                      @click.stop="goToImage(product._id, index)"
                  ></span>
                </div>
              </div>

              <div class="product-info" @click="goToProduct(product.slug)">
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

              <!-- Added cart and favorite icons -->
              <div class="product-actions">
                <button
                    class="action-btn cart-btn"
                    @click.stop="addToCart(product._id)"
                    :class="{ active: product.isInCart }"
                    title="Add to cart"
                >
                  <ShoppingCart :size="20" :fill="product.isInCart ? '#2d2d2d' : 'none'" />
                </button>
                <button
                    class="action-btn favorite-btn"
                    @click.stop="toggleFavorite(product._id)"
                    :class="{ active: product.isFavorite }"
                    title="Add to favorites"
                >
                  <Star :size="20" :fill="product.isFavorite ? '#fbbf24' : 'none'" />
                </button>
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
import {ref, computed, onMounted, watch} from 'vue'
import {Search, MapPin, ShoppingCart, Star} from 'lucide-vue-next'
import {getAllUnitedProducts} from "@/api/pages/main-page-all-products.ts";
import router from "@/router/index.ts";
import {getUserProfile} from "@/api/profiles/user-profile.ts";
import {useRoute, useRouter} from "vue-router";
import {isCart} from "@/api/pages/isCart.js";
import {isFav} from "@/api/pages/isFav.js";
import {deleteOrAddToFavorite} from "@/api/pages/delete-favorite.js";
import {deleteOrAddToCart} from "@/api/pages/delete-from-cart.js";

const products = ref([]);
const currentImageIndex = ref({});
const sortOrder = ref('cheap')

const route = useRoute();


const user = ref(null)

const currentPage = ref(Number(route.query.page) || 1);
const totalPages = ref(1);
const searchQuery = ref(route.query.search || '');
const searchCategory = ref(route.query.search || '')

let isCarted = ref(false);
let isFavorite = ref(false);

const selectedCity = ref('Kyiv')


let searchTimeout = null;

const goToLogin = () => router.push('/auth/login')
const goToRegister = () => router.push('/auth/register')


onMounted(async () => {
  await  loadProducts();
  await  getUser()
});


watch(searchQuery, () => {

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    updateUrlPage();
    loadProducts();
  }, 500);
});


function nextImage(productId) {
  const p = products.value.find(p => p._id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] + 1) % p.images.length;
}

function prevImage(productId) {
  const p = products.value.find(p => p._id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + p.images.length) % p.images.length;
}

function goToImage(productId, index) {
  currentImageIndex.value[productId] = index;
}

async function loadProducts() {
  try {


    const response = await getAllUnitedProducts({ page: currentPage.value, search:searchQuery.value });

    const items = response.data.data;

    if (!items.length && currentPage.value > 1) {
      currentPage.value--;
      return await loadProducts();
    }

    products.value = items;
    totalPages.value = response.data.totalPages


    products.value.forEach(p => {
      currentImageIndex.value[p._id] = 0;
      p.images = p.sources.map(s => s.imageLink);
    });

  } catch (error) {
    console.error("Error loading pages", error);
  }
}

function updateUrlPage() {
  router.push({
    query: { page: currentPage.value }
  });
}

async function getIsCarted(productId){
  try{
    const response = await isCart(productId);
    isCarted.value = response;
  }
  catch (error){
    console.error(error)
  }
}

async function getIsFavorite(productId){
  try{
    const response = await isFav(productId);
    isFavorite.value = response;
  }
  catch (error){
    console.error(error)
  }
}

function goToProduct(slug) {
  router.push(`/products/profile/${slug}`);
}


async function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateUrlPage();
    await loadProducts();
  }
}

async function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateUrlPage();
    await loadProducts();
  }
}

async function getUser(){
  const response = await getUserProfile()
  user.value = response.data
}

async function addToCart(productId) {
  try{
    await deleteOrAddToCart({productId});
  }
  catch (error){
    console.log("Something goes wrong", error);
  }
}

async function toggleFavorite(productId) {
  try{
    await deleteOrAddToFavorite({productId});
  }
  catch (error){
    console.log("Something goes wrong", error);
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

.logo-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: inline-block;

}

.logo-link:hover .logo {
  opacity: 0.8;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.user-name {
  color: white;
  text-decoration: none;
}

.user-name:hover {
  color: orange;
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


.additional-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 70px;
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

.city-selector-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
}

.city-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.city-select:hover {
  border-color: #9ca3af;
}

.city-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.product-card {
  background-color: white;
  border-radius: 8px;
  border: 2px solid #1f2937;
  overflow: hidden;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
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
  cursor: pointer;
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
  cursor: pointer;
  flex: 1;
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

/* Added styles for cart and favorite action buttons */
.product-actions {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  color: #6b7280;
}

.action-btn:hover {
  background-color: #f3f4f6;
}

.cart-btn:hover {
  color: #2d2d2d;
}

.cart-btn.active {
  color: #2d2d2d;
}

.favorite-btn:hover {
  color: #fbbf24;
}

.favorite-btn.active {
  color: #fbbf24;
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
