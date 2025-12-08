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
          <a href="#" class="nav-item" @click.prevent="router.push('/favorites')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            FAVORITES
          </a>
          <a
              v-if="user?.role === 'ADMIN'"
              href="#"
              class="nav-item active"
              @click.prevent="activeTab='admin-page'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
            ADMIN-PANEL
          </a>
        </nav>
      </aside>
      <!-- Content Area -->
      <div class="content-area">
        <!-- Admin Delete Section -->
        <div class="reviews-section">
          <div class="reviews-header">
            <h2 class="reviews-title">Admin Delete Panel</h2>
          </div>

          <!-- Delete Forms -->
          <div class="delete-forms">
            <!-- Delete User -->
            <div class="delete-form-card">
              <h3 class="delete-form-title">Delete User</h3>
              <div class="delete-form-content">
                <input
                    v-model="userIdToDelete"
                    type="text"
                    class="delete-input"
                    placeholder="Enter User ID"
                />
                <button class="delete-button user-delete" @click="deleteUser">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete User
                </button>
              </div>
            </div>

            <!-- Delete Review -->
            <div class="delete-form-card">
              <h3 class="delete-form-title">Delete Review</h3>
              <div class="delete-form-content">
                <input
                    v-model="reviewIdToDelete"
                    type="text"
                    class="delete-input"
                    placeholder="Enter Review ID"
                />
                <button class="delete-button review-delete" @click="deleteReview">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete Review
                </button>
              </div>
            </div>

            <!-- Delete Product -->
            <div class="delete-form-card">
              <h3 class="delete-form-title">Delete Product</h3>
              <div class="delete-form-content">
                <input
                    v-model="productIdToDelete"
                    type="text"
                    class="delete-input"
                    placeholder="Enter Product ID"
                />
                <button class="delete-button product-delete" @click="deleteProduct">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete Product
                </button>
              </div>
            </div>

            <!-- Added Grant Admin Privilege form -->
            <div class="admin-grant-section">
              <div class="delete-form-card">
                <h3 class="delete-form-title">Grant Admin Privilege</h3>
                <div class="delete-form-content">
                  <input
                      v-model="adminUserIdToGrant"
                      type="text"
                      class="delete-input"
                      placeholder="Enter User ID"
                  />
                  <input
                      v-model="adminUserEmailToGrant"
                      type="text"
                      class="delete-input"
                      placeholder="Enter User Email"
                  />
                  <button class="delete-button admin-grant" @click="grantAdminPrivilege">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    Grant Admin
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Added 4 additional action buttons -->
          <div class="action-buttons">
            <button class="action-btn action-btn-1" @click="clearInitialStorage">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Clear initial storage
            </button>
            <button class="action-btn action-btn-2" @click="clearMainStorage">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Clear main storage
            </button>
            <button class="action-btn action-btn-3" :disabled="isLoading" @click="startScraping">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Start scraping
            </button>
            <button class="action-btn action-btn-4" @click="combineProducts">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              Combine products
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from "@/router/index.js";
import { getUserProfile } from "@/api/profiles/user-profile.js";
import { useNotificationStore } from "@/components/notification.js";
import {deleteUsersReview} from "@/api/reviews/delete-review.js";
import {deleteUserByAdmin} from "@/api/auth/delete-user.js";
import {deleteProductByAdmin} from "@/api/products/delete-product.js";
import {grandUser} from "@/api/auth/grant-user.js";
import {logout} from "@/api/auth/logout.js";
import {clearScrapedProducts} from "@/api/storage-data/clear-scraped-products.js";
import {clearMatchedProducts} from "@/api/storage-data/clear-matched-products.js";
import {startScraperAtb} from "@/api/storage-data/start-scraper-atb.js";
import {startScraperFora} from "@/api/storage-data/start-scraper-fora.js";
import {combineProductsApi} from "@/api/storage-data/get-matches.js";


const user = ref({})
const userIdToDelete = ref('')
const reviewIdToDelete = ref('')
const productIdToDelete = ref('')
const adminUserIdToGrant = ref('')
const adminUserEmailToGrant = ref('')
const isLoading = ref(false);

const activeTab = ref('')

const notification = useNotificationStore();

const getUser = async () => {
  try {
    const response = await getUserProfile()
    user.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const handleLogout = async () => {

  try {
    await logout()
    window.location.href = "/auth/login"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const deleteUser = async () => {
  if (!userIdToDelete.value.trim()) {
    notification.show("Please enter a User ID", 'error');
    return;
  }

  if (!confirm(`Are you sure you want to delete user with ID: ${userIdToDelete.value}? This action cannot be undone.`)) {
    return;
  }
  try {
    await deleteUserByAdmin(userIdToDelete.value)

    notification.show(`User ${userIdToDelete.value} has been deleted successfully`, 'success');
    userIdToDelete.value = '';
  } catch (error) {
    console.error("Failed to delete user:", error);
    notification.show("Error deleting user", 'error');
  }
}

const deleteReview = async () => {
  if (!reviewIdToDelete.value.trim()) {
    notification.show("Please enter a Review ID", 'error');
    return;
  }

  if (!confirm(`Are you sure you want to delete review with ID: ${reviewIdToDelete.value}? This action cannot be undone.`)) {
    return;
  }

  try {
    await deleteUsersReview(reviewIdToDelete.value)
    notification.show(`Review ${reviewIdToDelete.value} has been deleted successfully`, 'success');
    reviewIdToDelete.value = '';
  } catch (error) {
    console.error("Failed to delete review:", error);
    notification.show("Error deleting review", 'error');
  }
}

const deleteProduct = async () => {
  if (!productIdToDelete.value.trim()) {
    notification.show("Please enter a Product ID", 'error');
    return;
  }

  if (!confirm(`Are you sure you want to delete product with ID: ${productIdToDelete.value}? This action cannot be undone.`)) {
    return;
  }

  try {
    await deleteProductByAdmin(productIdToDelete.value);

    notification.show(`Product ${productIdToDelete.value} has been deleted successfully`, 'success');
    productIdToDelete.value = '';
  } catch (error) {
    console.error("Failed to delete product:", error);
    notification.show("Error deleting product", 'error');
  }
}

const grantAdminPrivilege = async () => {
  if (!adminUserIdToGrant.value.trim() && !adminUserEmailToGrant.value.trim()) {
    notification.show("Please enter a User ID and Email" , 'error');
    return;
  }

  if (!confirm(`Are you sure you want to grant admin privileges to user with Email: ${adminUserEmailToGrant.value}?`)) {
    return;
  }

  try {
    const data = {
      id:adminUserIdToGrant.value,
      email:adminUserEmailToGrant.value
    }
     await grandUser(data);
    notification.show(`Admin privileges granted to user ${adminUserIdToGrant.value} successfully`, 'success');
    adminUserIdToGrant.value = '';
  } catch (error) {
    console.error("Failed to grant admin privilege:", error);
    notification.show("Error granting admin privilege", 'error');
  }
}

const clearInitialStorage = async () => {
  if (!confirm("Clear initial storage?")) return;

  try {
    await clearScrapedProducts();
    notification.show("Initial storage cleared", "success");
  } catch (e) {
    console.error(e);
    notification.show("Error clearing initial storage", "error");
  }
};

const clearMainStorage = async () => {
  if (!confirm("Clear main storage?")) return;

  try {
    await clearMatchedProducts();
    notification.show("Main storage cleared", "success");
  } catch (e) {
    console.error(e);
    notification.show("Error clearing main storage", "error");
  }
};

const startScraping = async () => {
  if (!confirm("Start scraping?")) return;

  isLoading.value = true;
  try {
    await startScraperAtb();
    await startScraperFora()
    notification.show("Scraping finished successfully", "success");
  } catch (e) {
    console.error(e);
    notification.show("Error starting scraper", "error");
  }
};

const combineProducts = async () => {
  try {
    await combineProductsApi();
    notification.show("Products combined", "success");
  } catch (e) {
    console.error(e);
    notification.show("Error combining products", "error");
  }
};


onMounted(async () => {
  await getUser();
});
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
  margin-right: 20px;
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
  flex-wrap: wrap;
  gap: 16px;
}

.reviews-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Delete Forms */
.delete-forms {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-form-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background-color: #fafafa;
}

.delete-form-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.delete-form-content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.delete-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.delete-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.delete-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.delete-button svg {
  width: 18px;
  height: 18px;
}

.user-delete {
  background-color: #dc2626;
}

.user-delete:hover {
  background-color: #b91c1c;
}

.review-delete {
  background-color: #ea580c;
}

.review-delete:hover {
  background-color: #c2410c;
}

.product-delete {
  background-color: #7c3aed;
}

.product-delete:hover {
  background-color: #6d28d9;
}

/* Added styles for admin grant section */
.admin-grant-section {
  margin-top: 24px;
  margin-bottom: 0;
}

.admin-grant {
  background-color: #10b981;
}

.admin-grant:hover {
  background-color: #059669;
}

/* Added styles for 4 action buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  flex: 1;
  justify-content: center;
  min-width: 150px;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn-1 {
  background-color: #0891b2;
}

.action-btn-1:hover {
  background-color: #0e7490;
}

.action-btn-2 {
  background-color: #059669;
}

.action-btn-2:hover {
  background-color: #047857;
}

.action-btn-3 {
  background-color: #d97706;
}

.action-btn-3:hover {
  background-color: #b45309;
}

.action-btn-4 {
  background-color: #4f46e5;
}

.action-btn-4:hover {
  background-color: #4338ca;
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
    order: -1;
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

  .delete-form-content {
    flex-direction: column;
  }

  .delete-button {
    width: 100%;
    justify-content: center;
  }

  /* Added responsive styles for action buttons */
  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
