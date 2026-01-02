<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <h1 class="logo">LowPrice.com</h1>
        </router-link>
        <div class="auth-buttons">
          <button class="btn-logout" @click="handleLogout">LOG OUT</button>
          <a v-if="user" href="/profile" class="user-name">
            Hello, {{ user.firstName }}
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item" @click.prevent="router.push('/profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24L3.52 22.48M23 12h-6m-6 0H1m19.66 8.66l-4.24-4.24m-4.24-4.24L3.52 1.52"/>
            </svg>
            SETTINGS
          </a>
          <a href="#" class="nav-item" @click.prevent="router.push('/cheapest-basket')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            MY PRODUCT CART
          </a>
          <a href="#" class="nav-item" @click.prevent="router.push('/users/reviews')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            MY REVIEWS
          </a>
          <a href="#" class="nav-item active" @click.prevent="activeTab='favorites'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            FAVORITES
          </a>
        </nav>
      </aside>

      <!-- Wrapped content in content-area -->
      <div class="content-area">
        <!-- Search Section -->


        <!-- Favorites Section -->
        <div class="favorites-section">
          <div class="favorites-header">
            <h2 class="favorites-title">Favorite products</h2>
          </div>

          <div class="favorites-grid">
            <div
                v-for="product in favoriteProducts"
                :key="product.id"
                class="favorite-card"
            >
              <div class="product-image" @click="goToProduct(product.slug)">
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
              </div>
              <div class="product-actions">
                <button
                    @click.stop="removeFromOrAddFavorites(product.unitedProduct._id)"
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
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { Search, MapPin, X, Star } from 'lucide-vue-next'
import {favoriteProducts as getFavoriteProducts} from "@/api/pages/favorite-products.js";
import {getUserProfile} from "@/api/profiles/user-profile.js";
import {logout} from "@/api/auth/logout.js";
import {deleteOrAddToFavorite} from "@/api/pages/delete-favorite.js";
import router from "@/router/index.js";

const sortOrder = ref('date')
const activeTab = ref('settings')
const selectedCity = ref('Kyiv')

let favorites = ref([])
const currentImageIndex = ref({});
const user = ref(null)


onMounted(async () => {
  await  loadFavorites();
  await  getUser()
});

async function loadFavorites(){
  try{
    const response = await getFavoriteProducts();

    favorites.value = response.data.map(fav=>{
      currentImageIndex.value[fav._id] = 0;
      return{
        id: fav._id,
        name: fav.unitedProduct.name,
        brand: fav.unitedProduct.brand,
        sources: fav.unitedProduct.sources,
        images: fav.unitedProduct.sources.map(s => s.imageLink),
        minPrice: fav.unitedProduct.minPrice,
        maxPrice: fav.unitedProduct.maxPrice,
        unitedProduct: fav.unitedProduct,
        slug: fav.unitedProduct.slug
      }
    });

  }
  catch(error){
    console.error(error);
  }
}

async function removeFromOrAddFavorites(productId){
  try{
    await deleteOrAddToFavorite({productId});
    const index = favorites.value.findIndex(p =>p.id ===productId)
    if (index !== -1) favorites.value.splice(index, 1);
    await loadFavorites();
  }
  catch (error){
    console.log("Something goes wrong", error);
  }
}

function nextImage(productId) {
  const p = favorites.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] + 1) % p.images.length;
}

function prevImage(productId) {
  const p = favorites.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + p.images.length) % p.images.length;
}

function goToImage(productId, index) {
  currentImageIndex.value[productId] = index;
}

function goToProduct(slug) {
  router.push(`/products/profile/${slug}`);
}

const favoriteProducts = computed(() => favorites.value)


async function getUser(){
  const response = await getUserProfile()
  user.value = response.data
}

const handleLogout = async () => {
  try {
    await logout()
    window.location.href = "/auth/login"
  } catch (e) {
    console.error("Logout failed:", e)
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
  margin-right: 50px;
}

.logo-link:hover .logo {
  opacity: 0.8;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
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

/* Main Content */
.main-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 56px);
  padding-top: 20px;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #2d2d2d;
  padding: 0;
  margin-left: 20px;
  border-radius: 4px;
  align-self: stretch;
  margin-bottom: 40px;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  color: white;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item svg {
  width: 18px;
  height: 18px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 0 40px 40px 20px;
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

/* Main Container - removed old padding */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
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
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
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
  display: flex;
  flex-direction: column;
  height: 380px; /* фиксированная высота */
  width: 280px; /* фиксированная ширина */
  margin: 0 auto; /* центрирование карточки */

}

.favorite-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.product-image {
  flex: 0 0 auto;
  height: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer
}

.product-image .image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: #d1d5db;
}

.product-info {
  flex: 1 1 auto; /* занимает оставшееся место */
  padding: 12px; /* чуть меньше, чем было 16px */
  text-align: center;
  overflow: hidden;
  cursor: pointer
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

.user-name {
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-top: 4px;
}

.user-name:hover {
  color: orange;
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

.btn-logout {
  background: none;
  border: none;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
  padding: 8px 12px;
  letter-spacing: 0.5px;
}

.btn-logout:hover {
  opacity: 0.8;
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

/* Responsive */
@media (max-width: 968px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    white-space: nowrap;
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }

  .content-area {
    padding: 20px;
  }
}
</style>
