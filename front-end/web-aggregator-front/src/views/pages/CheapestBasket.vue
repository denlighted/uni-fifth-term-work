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
          <a href="/profile" class="user-name">Hello, {{ user.firstName }}</a>
        </div>
      </div>
    </header>

    <!-- Added main content wrapper with sidebar -->
    <div class="main-content">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item" @click.prevent="router.push('/profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24L3.52 22.48M23 12h-6m-6 0H1m19.66 8.66l-4.24-4.24m-4.24-4.24L3.52 1.52"/>
            </svg>
            SETTINGS
          </a>
          <a href="#" class="nav-item active" @click.prevent="activeTab = 'product-cart'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
            MY PRODUCT CART
          </a>
          <a href="#" class="nav-item" @click.prevent="router.push('/users/reviews')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            MY REVIEWS
          </a>
          <a href="#" class="nav-item " @click.prevent="router.push('/favorites')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
            FAVORITES
          </a>
        </nav>
      </aside>

      <!-- Content Area -->
      <div class="content-wrapper">
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
              <Search class="input-icon" :size="18" />
              <input
                  type="text"
                  placeholder="Enter the product name"
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

                <div class="product-details">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-prices">
                    <div
                        v-for="prod in product.sources"
                        :key="prod.store"
                        class="price-row"
                    >
                      <span class="price-store">{{ prod.store }}</span>
                      <span class="price-value">{{ prod.price }}</span>
                    </div>
                  </div>

                  <div class="product-actions">
                    <button @click="removeFromBasket(product.productId)" class="action-btn basket-icon" title="Remove from basket">
                      <ShoppingCart :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="basket-footer">
              <button class="add-product-btn" @click="goHome">
                <Plus :size="20" />
                Add another product
              </button>

              <div class="total-price">
                <span class="total-label main-text">{{ cheapest.message }}</span>
                <span class="total-label sub-text">{{ cheapest.worstMessage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { Search, MapPin, ShoppingCart, Star, Plus } from 'lucide-vue-next'
import {bestCartProducts} from "@/api/pages/best-cart.js";
import {getCheapestShop} from "@/api/pages/cheapest-shop.js";
import router from "@/router/index.js";
import {getUserProfile} from "@/api/profiles/user-profile.js";
import {logout} from "@/api/auth/logout.js";
import {deleteOrAddToFavorite} from "@/api/pages/delete-favorite.js";
import {deleteOrAddToCart} from "@/api/pages/delete-from-cart.js";

const activeTab = ref('settings')
const basketProducts = ref([]);
const currentImageIndex = ref({});
const cheapest = ref({
  message:'',
  worstMessage:''
});
const user= ref({})
const selectedCity = ref('Kyiv')

onMounted(async ()=>{
  await loadBasket();
  await cheapestShop()
  await  getUser()

})

async function loadBasket() {
  try {
    const response = await bestCartProducts();

    basketProducts.value = response.data.map(cart => {
      currentImageIndex.value[cart._id] = 0;
      console.log(cart.unitedProduct._id);
      return {
        id: cart._id,
        productId: cart.unitedProduct._id,
        name: cart.unitedProduct.name,
        brand: cart.unitedProduct.brand,
        sources: cart.unitedProduct.sources,
        images: cart.unitedProduct.sources.map(s => s.imageLink),
        quantity: cart.quantity
      };
    });

  } catch (error) {
    console.log("Something goes wrong", error);
  }
}

async function removeFromBasket(productId){
  try{
    console.log("Removing product with ID:", productId);
    await deleteOrAddToCart({productId});
    const index = basketProducts.value.findIndex(p => p.productId === productId)
    if (index !== -1) basketProducts.value.splice(index, 1);
    await loadBasket();
    await cheapestShop()
  }
  catch (error){
    console.log("Something goes wrong", error);
  }
}

function nextImage(productId) {
  const p = basketProducts.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] + 1) % p.images.length;
}

function prevImage(productId) {
  const p = basketProducts.value.find(p => p.id === productId);
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + p.images.length) % p.images.length;
}

function goToImage(productId, index) {
  currentImageIndex.value[productId] = index;
}

function goHome() {
  router.push('/')
}

async function cheapestShop(){
  try{
    const response = await getCheapestShop();
    cheapest.value.message = response.data.message
    cheapest.value.worstMessage = response.data.secondVar

  }
  catch(error){
    console.log(error)
  }
}


async function getUser(){
  const response = await getUserProfile()
  user.value = response.data
}

const toggleFavorite = (productId) => {
  const product = basketProducts.value.find(p => p.id === productId)
  if (product) {
    product.isFavorite = !product.isFavorite
  }
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

/* Main Content with Sidebar Layout */
.main-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 20px;
  gap: 20px;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: #2d2d2d;
  margin-left: 20px;
  border-radius: 8px;
  align-self: stretch;
  position: sticky;
  top: 20px;
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

.nav-item:first-child {
  border-radius: 8px 8px 0 0;
}

.nav-item:last-child {
  border-bottom: none;
  border-radius: 0 0 8px 8px;
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

/* Content Wrapper for main content area */
.content-wrapper {
  flex: 1;
  padding: 0 24px 24px 0;
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
  background: white;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 260px;
}

.basket-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 180px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image .image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: #d1d5db;
}

.product-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 5px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.product-actions {
  display: flex;
  gap: 8px;
  align-items: center;
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

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.action-btn:hover {
  transform: scale(1.1);
}

.basket-icon {
  color: #1f2937;
}

.star-btn {
  color: #fbbf24;
}

.star-btn.active {
  color: #fbbf24;
}

.user-name {
  color: white;
  text-decoration: none;
  margin-top: 5px;
}

.user-name:hover {
  color: orange;      /* при наведении */
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-text {
  font-size: 18px;
  font-weight: 600;
}

.sub-text {
  font-size: 14px;
  margin-top: 4px;
  color: #666;
}

.total-label {
  margin-right: 8px;
}

.total-value {
  font-weight: 700;
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

/* Responsive adjustments for sidebar */
@media (max-width: 968px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-left: 0;
    margin: 0 20px;
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

  .nav-item:first-child {
    border-radius: 8px 0 0 8px;
  }

  .nav-item:last-child {
    border-radius: 0 8px 8px 0;
    border-right: none;
  }

  .content-wrapper {
    padding: 0 20px 24px 20px;
  }
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
