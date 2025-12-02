<template>
  <div class="product-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">LowPrice.com</div>
        <div class="header-actions">
          <button class="header-btn" @click="goToSignUp">sign up</button>
          <button class="header-btn" @click="goToSignIn">sign in</button>
        </div>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-container">
        <h2 class="search-title">Price Aggregator</h2>
        <div class="city-selector">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>City</span>
        </div>
      </div>
      <div class="search-inputs">
        <div class="search-input">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Choose a store" v-model="selectedStore">
        </div>
        <div class="search-input">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Select a category" v-model="selectedCategory">
        </div>
        <div class="search-input">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Search for a product or barcode" v-model="searchQuery">
        </div>
      </div>
    </div>

    <!-- Product Section -->
    <div class="content-container">
      <div class="product-section">
        <h1 class="product-heading">{{product.name}}</h1>

        <div class="product-layout">
          <!-- Product Image -->
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

          <!-- Price List -->
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
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <h2 class="map-heading">Store Locations</h2>
        <div class="map-container">
          <div class="map-placeholder">
            <svg viewBox="0 0 800 400" class="map-svg">
              <rect width="800" height="400" fill="#e8e8e8"/>

              <!-- Map markers -->
              <g v-for="(store, index) in stores" :key="store.id">
                <circle
                    :cx="150 + (index * 100)"
                    :cy="180 + (Math.random() * 80)"
                    r="8"
                    fill="#2d2d2d"
                    class="map-marker"
                />
                <circle
                    :cx="150 + (index * 100)"
                    :cy="180 + (Math.random() * 80)"
                    r="15"
                    fill="none"
                    stroke="#2d2d2d"
                    stroke-width="2"
                    opacity="0.3"
                />
              </g>

              <!-- Map UI elements -->
              <text x="400" y="30" text-anchor="middle" fill="#666" font-size="14">Interactive Map</text>
            </svg>
          </div>

          <div class="map-controls">
            <button class="map-control-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <button class="map-control-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="store-list">
          <div v-for="(store, index) in stores" :key="store.id" class="store-list-item">
            <div class="store-marker-icon">{{ index + 1 }}</div>
            <div class="store-info">
              <div class="store-list-name">{{ store.name }}</div>
              <div class="store-address">Address: 123 Main St, City</div>
              <div class="store-distance">Distance: {{ (Math.random() * 5 + 0.5).toFixed(1) }} km</div>
            </div>
            <div class="store-list-price">{{ store.price }}</div>
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div class="overall-rating"> Overall: {{ product?.ratingAverage || 'No rating'}}</div>
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
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </div>

              <p class="review-text">{{ review.text }}</p>

              <div class="review-actions">
                <button class="review-action-btn" @click="likeReview(review.id)">
                  <svg class="review-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span>{{ review.likes }}</span>
                </button>
                <button class="review-action-btn" @click="dislikeReview(review.id)">
                  <svg class="review-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
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
import {onMounted, ref} from 'vue'
import {getProductBySlug} from "@/api/profiles/product-profile.js";
import {useRoute} from "vue-router";
import {getProfileProductReviews} from "@/api/profiles/get-profile-product-reviews.js";
import {reviewCreation} from "@/api/reviews/review-creation.js";

const selectedStore = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')

let product = ref({
  name: "",
  minPrice: 0,
  maxPrice: 0,
  sources: [],
  ratingAverage:0
})

const stores = ref([
  { id: 1, name: 'Store 1', price: '49.99' },
  { id: 2, name: 'Store 3', price: '50.89' },
  { id: 3, name: 'Store 8', price: '51.49' },
  { id: 4, name: 'Store 4', price: '52.39' },
  { id: 5, name: 'Store 9', price: '54.00' },
  { id: 6, name: 'Store 2', price: '54.99' }
])

const stats = ref({
  comments: 0,
  shares: 0,
  likes: 2,
  favorites: 0
})

const userRating = ref(0)

const overallRating = ref() // Я получаю!!!
const sortBy = ref('date')

const commentText = ref('')

const currentImageIndex = ref([]);

const route = useRoute()
const slug = route.params.slug;

const userReviews = ref([]);


onMounted(async () => {
  await getProduct()
  await getReviews()
})

async function getProduct(){
  try{
      const response = await getProductBySlug(slug);

      product.value = response.data;

      product.value.images = response.data.sources.map(s => s.imageLink);

      currentImageIndex.value[product.value.id] = 0;
  }
  catch (error)
  {
    console.log(error);
  }
}

async function getReviews(){
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

async function addComment(){
  const data = {
    review: commentText.value,
    rating: userRating.value,
  };

  try{
    const response = await reviewCreation(data, slug);
    await getReviews()
    commentText.value = '';
    userRating.value = 0;
  }
  catch (error){
    console.error('Ошибка при создании отзыва', error);
    alert('Не удалось добавить отзыв. Попробуйте снова.'); // Заменить!!!
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


const goToSignUp = () => {
  console.log('Navigate to sign up')
}

const goToSignIn = () => {
  console.log('Navigate to sign in')
}



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
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
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
  font-size: 18px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 6px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.header-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
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

.search-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2d2d2d;
  font-weight: 500;
}

.icon {
  width: 20px;
  height: 20px;
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
  background: rgba(0,0,0,0.4);
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image-container {
  display: flex;
  justify-content: center;
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

.placeholder-svg {
  width: 100%;
  height: auto;
  display: block;
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

.map-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.map-marker {
  cursor: pointer;
  transition: r 0.2s;
}

.map-marker:hover {
  r: 10;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.map-control-btn {
  width: 36px;
  height: 36px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.map-control-btn:hover {
  background-color: #f5f5f5;
  border-color: #2d2d2d;
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

.store-list-price {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
}

/* Feedback Section */
.feedback-section {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stats-bar {
  display: flex;
  gap: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.stat-icon {
  width: 20px;
  height: 20px;
}

.feedback-header {
  display: flex;
  justify-content: flex-end; /* двигает дочерний блок вправо */
  align-items: center; /* по вертикали выравнивание */
  padding: 0 20px; /* отступы по краям при желании */
}

.feedback-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #2d2d2d;
}

.tab-btn.active {
  background-color: #2d2d2d;
  color: white;
  border-color: #2d2d2d;
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

.name-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  max-width: 300px;
}

.name-input:focus {
  border-color: #2d2d2d;
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

  .product-layout {
    grid-template-columns: 1fr;
  }

  .feedback-header {
    grid-template-columns: 1fr;
  }

  .rating-section {
    align-items: flex-start;
  }

  .map-container {
    flex-direction: column;
  }

  .map-placeholder {
    margin-bottom: 12px;
  }
}
</style>
