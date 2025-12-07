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
          <a href="#" class="nav-item active" @click.prevent="router.push('/profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24L3.52 22.48M23 12h-6m-6 0H1m19.66 8.66l-4.24-4.24m-4.24-4.24L3.52 1.52"/>
            </svg>
            SETTINGS
          </a>
          <a href="#" class="nav-item" @click.prevent="router.push('/cheapest-basket')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
            MY PRODUCT CART
          </a>
          <a href="/reviews" class="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            MY REVIEWS
          </a>
          <a href="#" class="nav-item" @click.prevent="router.push('/favorites')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
            FAVORITES
          </a>
        </nav>
      </aside>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Reviews Section -->
        <div class="reviews-section">
          <div class="reviews-header">
            <h2 class="reviews-title">My Reviews</h2>
          </div>

          <!-- Reviews List -->
          <div v-if="filteredReviews.length > 0" class="reviews-list">
            <div v-for="review in filteredReviews" :key="review.id" class="review-card">
              <!-- Product Info -->
              <div class="review-product-info">
                <div class="product-image-small">
                  <img
                      v-if="review.image"
                      :src="review.image"
                      :alt="review.productName"
                      class="real-product-image"
                  />

                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="placeholder-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <div class="product-details">
                  <h3 class="product-name"
                      @click="router.push(`/products/profile/${review.slug}`)"
                      style="cursor: pointer;">
                    {{ review.productName }}
                  </h3>
                </div>
              </div>

              <!-- Review Content -->
              <div class="review-content">
                <div class="review-header-info">
                  <div class="review-date">{{ formatDate(review.date) }}</div>
                  <div class="review-rating">
                    <svg
                        v-for="star in 5"
                        :key="star"
                        class="star-icon"
                        :class="{ filled: star <= review.rating }"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span class="rating-number">{{ review.rating }}/5</span>
                  </div>
                </div>

                <p class="review-text">{{ review.review }}</p>

                <!-- Review Stats -->
                <div class="review-stats">
                  <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span>{{ review.likes }}</span>
                  </div>
                  <div class="stat-item">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    <span>{{ review.dislikes }}</span>
                  </div>
                </div>

                <!-- Review Actions -->
                <div class="review-actions">
                  <button class="action-btn edit-btn" @click="editReview(review.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button class="action-btn delete-btn" @click="deleteReview(review.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p class="empty-text">No reviews yet</p>
            <p class="empty-subtext">Start leaving reviews on products and stores</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Review Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Review</h3>
          <button class="modal-close" @click="closeEditModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Rating Selection -->
          <div class="form-group">
            <label class="form-label">Rating</label>
            <div class="rating-select">
              <svg
                  v-for="star in 5"
                  :key="star"
                  class="star-icon-large"
                  :class="{ filled: star <= editForm.rating }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  @click="setEditRating(star)"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>

          <!-- Review Text -->
          <div class="form-group">
            <label class="form-label">Review</label>
            <textarea
                v-model="editForm.review"
                class="form-textarea"
                rows="6"
                placeholder="Write your review here..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeEditModal">Cancel</button>
          <button class="modal-btn save-btn" @click="saveEditedReview">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import router from "@/router/index.js";
import { getUserProfile } from "@/api/profiles/user-profile.js";
import { getUsersReviews } from "@/api/reviews/get-users-reviews.js";
import {deleteUsersReview} from "@/api/reviews/delete-review.js";
import {changeReview} from "@/api/reviews/change-review.js";

const user = ref(null)
const filterOption = ref('all')
const reviews = ref([])

const showEditModal = ref(false)
const editingReview = ref(null)
const editForm = ref({
  rating: 0,
  review: ''
})

// Фильтрация (работает без изменений)
const filteredReviews = computed(() => {
  if (filterOption.value === 'all') {
    return reviews.value
  }
  return reviews.value.filter(review =>
      filterOption.value === 'products' ? review.type === 'product' : review.type === 'store'
  )
})

onMounted(async () => {
  await getUser();
  await loadReviews();
});

const loadReviews = async () => {
  try {
    const response = await getUsersReviews();

    reviews.value = response.data.map(rev => {
      return {
        id: rev._id, //
        productName: rev.unitedProduct?.name || 'Unknown Product',
        review: rev.review,
        rating: rev.rating,
        date: rev.createdAt, // Backend: createdAt -> Frontend: date
        image: rev.unitedProduct?.sources[0].imageLink,

        type: 'product',
        storeName: null,


        slug: rev.unitedProduct?.slug
      }
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr)
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return date.toLocaleDateString('en-US', options)
}

const editReview = async (reviewId) => {
  const foundReview = reviews.value.find(r => r.id === reviewId);
  if (foundReview) {
    editingReview.value = foundReview; // Сохраняем ссылку на редактируемый объект

    // Заполняем форму текущими данными
    editForm.value = {
      rating: foundReview.rating,
      review: foundReview.review
    };
    showEditModal.value = true;
  }
}

const setEditRating = (rating) => {
  editForm.value.rating = rating
}

const saveEditedReview = async () => {
  if (!editingReview.value) return;
  try {
    await changeReview(editingReview.value.id, editForm.value);

    const index = reviews.value.findIndex(r => r.id === editingReview.value.id);
    if (index !== -1) {
      reviews.value[index].rating = editForm.value.rating;
      reviews.value[index].review = editForm.value.review;
    }

    closeEditModal();

  } catch (error) {
    console.error("Failed to update review:", error);
    alert("Error updating review");
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingReview.value = null
  editForm.value = {rating: 0, review: ''}
}

const deleteReview = async (reviewId) => {
  // Хорошая практика: спросить подтверждение перед удалением
  if (!confirm('Are you sure you want to delete this review?')) return;

  try {

    await deleteUsersReview(reviewId);

    const index = reviews.value.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      reviews.value.splice(index, 1);
    }

  } catch (error) {
    console.error("Failed to delete review:", error);
    alert("Error deleting review"); // Сообщаем пользователю об ошибке
  }
}

async function getUser() {
  try {
    const response = await getUserProfile()
    user.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const handleLogout = () => {
  console.log('Logout')
  router.push('/login'); // Пример логаута
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
  max-width: 1400px;
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
  margin-left: 60px;
}

.logo-link:hover .logo {
  opacity: 0.8;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.auth-buttons {
  display: flex;
  gap: 12px;
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

.user-name {
  color: white;
  text-decoration: none;
  display: inline-block;
}

.user-name:hover {
  color: #fbbf24;
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

/* Reviews Section */
.reviews-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 24px;
  border: 1px solid #d1d5db;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reviews-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  color: #374151;
}

.filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  transition: box-shadow 0.2s;
}

.review-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Product Info */
.review-product-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.product-image-small {
  width: 80px;
  height: 80px;
  background-color: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.real-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.placeholder-icon {
  width: 40px;
  height: 40px;
  color: #9ca3af;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.review-type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

.review-type-badge.product {
  background-color: #dbeafe;
  color: #1e40af;
}

.review-type-badge.store {
  background-color: #fef3c7;
  color: #92400e;
}

.store-name {
  font-size: 14px;
  color: #6b7280;
}

/* Review Content */
.review-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-date {
  font-size: 14px;
  color: #6b7280;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  width: 18px;
  height: 18px;
  fill: #e5e7eb;
  stroke: #d1d5db;
}

.star-icon.filled {
  fill: #fbbf24;
  stroke: #fbbf24;
}

.rating-number {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-left: 4px;
}

.review-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Review Stats */
.review-stats {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.stat-icon {
  width: 18px;
  height: 18px;
}

/* Review Actions */
.review-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.edit-btn {
  color: #2563eb;
  border-color: #2563eb;
}

.edit-btn:hover {
  background-color: #2563eb;
  color: white;
}

.delete-btn {
  color: #dc2626;
  border-color: #dc2626;
}

.delete-btn:hover {
  background-color: #dc2626;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-icon {
  width: 64px;
  height: 64px;
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

  .review-product-info {
    flex-direction: column;
  }

  .product-image-small {
    width: 100%;
    height: 120px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1f2937;
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.rating-select {
  display: flex;
  gap: 8px;
}

.star-icon-large {
  width: 32px;
  height: 32px;
  fill: #e5e7eb;
  stroke: #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.star-icon-large:hover {
  transform: scale(1.1);
}

.star-icon-large.filled {
  fill: #fbbf24;
  stroke: #fbbf24;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  color: #374151;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background-color: #f9fafb;
}

.save-btn {
  background-color: #2d2d2d;
  color: white;
}

.save-btn:hover {
  background-color: #1f1f1f;
}

/* Responsive Modal */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .star-icon-large {
    width: 28px;
    height: 28px;
  }
}
</style>
