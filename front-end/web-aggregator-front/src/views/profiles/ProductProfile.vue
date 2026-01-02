<template>
  <div class="product-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <h1 class="logo">LowPrice.com</h1>
        </router-link>
        <div class="header-actions">
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
      </div>
    </header>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-container">
        <h2 class="search-title">Price Aggregator</h2>
        <div class="city-selector-dropdown">
          <MapPin :size="20" />
          <select v-model="selectedCity" class="city-select">
            <option value="Kyiv">Kyiv</option>
          </select>
        </div>
      </div>
      <div class="search-inputs">
        <div class="search-input">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Enter the product name" v-model="selectedStore">
        </div>
        <div class="search-input">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Select a category" v-model="selectedCategory">
        </div>
      </div>
    </div>

    <!-- Product Section -->
    <div class="content-container">
      <div class="product-section">
        <h1 class="product-heading">{{ product.name }}</h1>

        <div class="product-layout">
          <!-- Top Row: Product Image and Price List -->
          <div class="top-row">
            <!-- Left: Product Image -->
            <div class="product-image-container">
              <div class="product-image">
                <button class="nav-btn left" @click="prevImage(product.id)">&lt;</button>
                <transition name="fade" mode="out-in">
                  <img
                      v-if="product.images && product.images.length"
                      :key="currentImageIndex[product.id]"
                      :src="product.images[currentImageIndex[product.id]]"
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
            </div>

            <!-- Right: Price List -->
            <div class="price-section">
              <div class="price-range">
                {{ product.minPrice }} - {{ product.maxPrice }} in {{ product.sources.length }} stores
              </div>
              <div class="store-prices">
                <div v-for="prod in product.sources" :key="prod._id" class="store-price-item">
                  <div class="store-name">{{ prod.store }}</div>
                  <div class="store-price">{{ prod.price }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Description and Specifications side by side -->
          <div class="bottom-row">
            <!-- Product Description -->
            <div class="description-column">
              <h2 class="description-heading">Product Description</h2>
              <div class="description-content">
                <p>{{ productDescription }}</p>
              </div>
            </div>

            <!-- Specifications -->
            <div class="specifications-column">
              <h3 class="specifications-heading">Specifications</h3>
              <div class="specifications-table">
                <div class="spec-row">
                  <div class="spec-label">Brand</div>
                  <div class="spec-value">{{ product.brand || 'N/A' }}</div>
                </div>

                <div class="spec-row">
                  <div class="spec-label">Country of Origin</div>
                  <div class="spec-value">
                    {{ product.sources?.[0]?.productInfo?.["Країна"] || 'N/A' }}
                  </div>
                </div>

                <div class="spec-row">
                  <div class="spec-label">Category</div>
                  <div class="spec-value">
                    {{ product.unitedCategory?.name || 'N/A' }}
                  </div>
                </div>

                <div class="spec-row">
                  <div class="spec-label">Energy value</div>
                  <div class="spec-value">
                    {{ product.sources?.[0]?.productInfo?.["Енергетична цінність"] || 'N/A' }}
                  </div>
                </div>

                <div class="spec-row">
                  <div class="spec-label">Number of units</div>
                  <div class="spec-value">
                    {{ product.sources?.[0]?.productInfo?.["Кількість одиниць"] || 'N/A' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <h2 class="map-heading">Store Locations</h2>
        <p class="map-subtext">* Map does not guarantee product availability in stores</p>
        <!-- Карта -->
        <div class="map-container">

          <!-- Если пользователь НЕ авторизован — показываем надпись -->
          <div v-if="!user" class="map-locked">
            Please sign in to see store locations on the map
          </div>

          <!-- Если авторизован — показываем карту -->
          <div
              v-else
              ref="mapContainer"
              class="map-placeholder"
              style="width: 100%; height: 400px;"
          ></div>
        </div>

        <!-- Список магазинов -->
        <div class="store-list">
          <div v-for="(store, index) in stores" :key="store.id" class="store-list-item">
            <div class="store-marker-icon">{{ index + 1 }}</div>
            <div class="store-info">
              <div class="store-list-name">{{ store.name }}</div>
              <div class="store-address">Address: {{ store.address || 'N/A' }}</div>
              <div class="store-distance">Distance: {{ store.distance.toFixed(2) }} km</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback Section -->
      <div class="feedback-section">
        <!-- Stats -->
        <!-- Tabs and Rating -->
        <div class="feedback-header">
          <div class="rating-section">
            <div class="rate-title">Rate the product</div>
            <div class="stars">
              <svg
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= userRating }"
                  @click="userRating = star"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div class="overall-rating"> Overall: {{ product?.ratingAverage || 'No rating' }}</div>
          </div>
        </div>

        <!-- Sort and Comment Form -->
        <div class="comment-section">
          <select v-model="sortBy" class="sort-select">
            <option value="date">by date</option>
            <option value="rating">by rating</option>
            <option value="popular">by popularity</option>
          </select>

          <h3 class="comment-heading">Leave a comment, we value your opinion</h3>
          <AuthRequiresDialog ref="dialogRef" />

          <textarea
              class="comment-textarea"
              placeholder="Please comment, we value your opinion."
              v-model="commentText"
          ></textarea>

          <button class="add-btn" @click="addComment">Add</button>
        </div>

        <!-- User Reviews -->
        <div class="reviews-list">
          <h3 class="reviews-list-title">User Reviews ({{ userReviews.length }})</h3>

          <div v-if="userReviews.length > 0">
            <div v-for="review in userReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-author-info">
                  <div class="review-author">{{ review.author }}</div>
                  <div class="review-date">{{ formatDate(review.date) }}</div>
                </div>
                <div class="review-stars">
                  <svg
                      v-for="star in 5"
                      :key="star"
                      class="review-star"
                      :class="{ empty: star > review.rating }"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                  >
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </div>

              <p class="review-text">{{ review.text }}</p>

              <div class="review-actions">
                <button class="review-action-btn" @click="likeReview(review.id)">
                  <svg class="review-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2">
                    <path
                        d="M14 9V5a3 3 0 0 0-3-3l-4 9V2H5.72a2 2 0 0 0-2.33 2H17"></path>
                  </svg>
                  <span>{{ review.likes }}</span>
                </button>
                <button class="review-action-btn" @click="dislikeReview(review.id)">
                  <svg class="review-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2">
                    <path
                        d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2.33 2H17"></path>
                  </svg>
                  <span>{{ review.dislikes }}</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="no-reviews">
            No reviews yet. Be the first to leave a review!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from 'vue'
import {getProductBySlug} from "@/api/profiles/product-profile.js";
import {useRoute} from "vue-router";
import {getProfileProductReviews} from "@/api/profiles/get-profile-product-reviews.js";
import {reviewCreation} from "@/api/reviews/review-creation.js";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {getUsersStores} from "@/api/geo/get-users-stores.js";
import {useNotificationStore} from "@/components/notification.js";
import AuthRequiresDialog from "@/components/UI/AuthRequiresDialog.vue";
import router from "@/router/index.js";
import {getUserProfile} from "@/api/profiles/user-profile.js";
import {MapPin} from "lucide-vue-next";

const dialogRef = ref(null);

const selectedStore = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')

let product = ref({
  name: "",
  minPrice: 0,
  maxPrice: 0,
  sources: [],
  ratingAverage: 0,
  description: "",
  brand: "",
  country: "",
  category: "",
  weight: "",
  dimensions: "",
  manufacturer: ""
})

let stores = ref([]);


const mapContainer = ref(null);

const productDescription = computed(() => {
  return product.value?.sources?.find(s => s.description && s.description.trim() !== "")
      ?.description || "Description not available";
});

const userRating = ref(0)

const sortBy = ref('date')

const commentText = ref('')

const currentImageIndex = ref([]);

const route = useRoute()
const slug = route.params.slug;

const user = ref(null)

const userReviews = ref([]);

const notification = useNotificationStore();

const selectedCity = ref('Kyiv')

onMounted(async () => {
  await getProduct();
  await getReviews();
  await getUser()
  await getUsersStoresLocation()


  if (!user.value) {
    return;
  }

  nextTick(() => {
    if (mapContainer.value) {
      mapboxgl.accessToken = 'pk.eyJ1IjoibHlhaHBldCIsImEiOiJjbWkwYmFsdDIwZzExMm1yNGk5aHo0N3h1In0.i9NQ4xo1yq9AsIMJpa_Hwg';

      const map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [30.4468, 50.4768],
        zoom: 13,
      });

      map.on('load', () => {
        stores.value.forEach(store => {
          // Маркер магазина
          new mapboxgl.Marker()
              .setLngLat([store.lon, store.lat])
              .setPopup(
                  new mapboxgl.Popup({offset: 25})
                      .setHTML(`
                            <h3>${store.name}</h3>`)
              )
              .addTo(map);

          // Маркер места пользователя (homeLat, homeLon)
          new mapboxgl.Marker({color: 'red'}) // Можно использовать любой цвет
              .setLngLat([store.homeLon, store.homeLat])
              .setPopup(
                  new mapboxgl.Popup({offset: 25})
                      .setHTML(`<h3>User Location</h3>`)
              )
              .addTo(map);
        });
      });
    } else {
      console.error("Map container is not defined");
    }
  });
});

async function getProduct() {
  try {
    const response = await getProductBySlug(slug);

    product.value = response.data;

    product.value.images = response.data.sources.map(s => s.imageLink);

    currentImageIndex.value[product.value.id] = 0;
  } catch (error) {
    console.log(error);
  }
}

async function getReviews() {
  try {
    const response = await getProfileProductReviews(slug);
    userReviews.value = response.data.map(rev => ({
      id: rev._id,
      text: rev.review,
      rating: rev.rating,
      author: `${rev.user.firstName} ${rev.user.lastName}`,
      date: rev.createdAt,
      likes: rev.likes || 0,
      dislikes: rev.dislikes || 0
    }));
  } catch (error) {
    console.error(error);
  }
}

async function getUsersStoresLocation() {
  try {
    const response = await getUsersStores();
    console.log(response.data);
    stores.value = response.data.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      lat: store.lat,
      lon: store.lon,
      homeLat: store.homeLat,
      homeLon: store.homeLon,
      distance: store.distance
    }))
  } catch (error) {
    console.error(error.message);
    console.log(error.response);
  }
}

async function getUser(){
  const response = await getUserProfile()
  user.value = response.data
}

async function addComment() {
  const data = {
    review: commentText.value,
    rating: userRating.value,
  };

  try {
    const response = await reviewCreation(data, slug);
    await getReviews()
    commentText.value = '';
    userRating.value = 0;
    notification.show("Success, review has been added", 'success');
    await getProduct();
  } catch (error) {
    console.error('Error, trying create review', error);
    if (error.response && error.response.status === 401) {
      dialogRef.value.showDialog();
    } else {
      notification.show(`Error, review has not been added`, 'error');
    }
  }
}

function nextImage(productId) {
  const p = product.value;
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] + 1) % p.images.length;
}

function prevImage(productId) {
  const p = product.value;
  currentImageIndex.value[productId] =
      (currentImageIndex.value[productId] - 1 + p.images.length) % p.images.length;
}

function goToImage(productId, index) {
  currentImageIndex.value[productId] = index;
}

const goToLogin = () => router.push('/auth/login')
const goToRegister = () => router.push('/auth/register')

const likeReview = (reviewId) => {
  const review = userReviews.value.find(r => r.id === reviewId)
  if (review) {
    review.likes++
  }
}

const dislikeReview = (reviewId) => {
  const review = userReviews.value.find(r => r.id === reviewId)
  if (review) {
    review.dislikes++
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return date.toLocaleDateString('en-US', options)
}
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  background-color: #374151;
  color: white;
  padding: 12px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.header-actions {
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
  margin: 5px;
}

.btn-auth:hover {
  background-color: #4b5563;
}

/* Search Section */
.search-section {
  background-color: white;
  margin: 20px auto;
  max-width: 1200px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-name {
  color: white;
  text-decoration: none;
}

.user-name:hover {
  color: orange;      /* при наведении */
}

.search-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
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

.search-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #666;
  pointer-events: none;
}

.search-input input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input input:focus {
  border-color: #2d2d2d;
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  z-index: 10;
}

.nav-btn.left {
  left: 10px;
}

.nav-btn.right {
  right: 10px;
}

/* Product Section */
.product-section {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.product-heading {
  font-size: 24px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 24px 0;
}

.product-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.top-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.product-image-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.product-image .image {
  max-height: 100%;
  width: auto;
  object-fit: contain;
  margin-left: -35px; /* ← регулируешь насколько надо */
}

.price-section {
  display: flex;
  flex-direction: column;
}

.price-range {
  background-color: #f5f5f5;
  padding: 12px 20px;
  border-radius: 20px;
  text-align: center;
  font-size: 14px;
  color: #2d2d2d;
  margin-bottom: 20px;
}

.store-prices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.store-price-item:last-child {
  border-bottom: none;
}

.store-name {
  font-weight: 600;
  color: #2d2d2d;
  font-size: 16px;
}

.store-price {
  font-size: 16px;
  color: #2d2d2d;
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.description-column {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.description-heading {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 16px 0;
}

.description-content {
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}

.description-content p {
  margin: 0;
}

.no-description {
  color: #999;
  font-style: italic;
}

.specifications-column {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.specifications-heading {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 16px 0;
}

.specifications-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-label {
  font-weight: 600;
  color: #2d2d2d;
  font-size: 14px;
}

.spec-value {
  color: #4b5563;
  font-size: 14px;
}

/* Map Section */
.map-section {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.map-heading {
  font-size: 22px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 20px 0;
}

.map-subtext {
  margin-top: -6px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #9c9c9c;
}

.map-container {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin-bottom: 24px;
}

.map-placeholder {
  width: 100%;
  height: 100%;
}

.map-locked {
  width: 100%;
  height: 400px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 20px;
}

.map-control-btn svg {
  width: 20px;
  height: 20px;
  color: #2d2d2d;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.store-list-item:hover {
  background-color: #f0f0f0;
  border-color: #2d2d2d;
}

.store-marker-icon {
  width: 32px;
  height: 32px;
  background-color: #2d2d2d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.store-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.store-list-name {
  font-weight: 600;
  color: #2d2d2d;
  font-size: 16px;
}

.store-address {
  font-size: 13px;
  color: #666;
}

.store-distance {
  font-size: 13px;
  color: #666;
}

/* Feedback Section */
.feedback-section {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feedback-header {
  display: flex;
  justify-content: flex-end; /* двигает дочерний блок вправо */
  align-items: center; /* по вертикали выравнивание */
  padding: 0 20px; /* отступы по краям при желании */
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.rate-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.star {
  width: 24px;
  height: 24px;
  cursor: pointer;
  stroke: #2d2d2d;
  fill: none;
  transition: fill 0.2s;
}

.star:hover {
  fill: #2d2d2d;
}

.star.filled {
  fill: #2d2d2d;
}

.overall-rating {
  font-size: 14px;
  color: #2d2d2d;
  font-weight: 600;
}

.comment-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sort-select {
  width: 200px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  background-color: white;
}

.sort-select:focus {
  border-color: #2d2d2d;
}

.comment-heading {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
}

.comment-textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: #2d2d2d;
}

.add-btn {
  width: 200px;
  padding: 12px 24px;
  background-color: #2d2d2d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: center;
}

.add-btn:hover {
  background-color: #1a1a1a;
  color: #2d2d2d;
}

/* Reviews List */
.reviews-list {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.reviews-list-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 24px 0;
}

.review-item {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-author {
  font-weight: 600;
  color: #2d2d2d;
  font-size: 15px;
}

.review-date {
  font-size: 13px;
  color: #666;
}

.review-stars {
  display: flex;
  gap: 3px;
}

.review-star {
  width: 16px;
  height: 16px;
  fill: #2d2d2d;
  stroke: #2d2d2d;
}

.review-star.empty {
  fill: none;
}

.review-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 14px;
}

.review-actions {
  display: flex;
  gap: 20px;
}

.review-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.review-action-btn:hover {
  background-color: #e0e0e0;
  color: #2d2d2d;
}

.review-action-icon {
  width: 18px;
  height: 18px;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .search-inputs {
    grid-template-columns: 1fr;
  }

  .top-row {
    grid-template-columns: 1fr;
  }

  .bottom-row {
    grid-template-columns: 1fr;
  }

  .product-layout {
    grid-template-columns: 1fr;
  }

  .description-specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
