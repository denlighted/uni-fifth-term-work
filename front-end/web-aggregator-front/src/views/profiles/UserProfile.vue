<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <a href="/" class="logo-text" >LowPrice</a>
        </div>
        <div class="header-center">
        </div>
        <div class="header-right">
          <button class="btn-logout" @click="handleLogout">LOG OUT</button>
          <div class="user-avatar">
            <svg v-if="!userProfile.avatar" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
            </svg>
            <img v-else :src="`http://localhost:3000${userProfile.avatar}`" alt="Avatar" />
          </div>
          <span class="username">{{ userProfile.firstName }} {{ userProfile.lastName }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active" @click.prevent="activeTab = 'settings'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24L3.52 22.48M23 12h-6m-6 0H1m19.66 8.66l-4.24-4.24m-4.24-4.24L3.52 1.52"/>
            </svg>
            SETTINGS
          </a>
          <a href="#" class="nav-item" @click.prevent="activeTab = 'products'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
            MY PRODUCTS
          </a>
          <a href="#" class="nav-item" @click.prevent="activeTab = 'reviews'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            MY REVIEWS
          </a>
          <a href="#" class="nav-item" @click.prevent="activeTab = 'billing'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <path d="M1 10h22"/>
            </svg>
            BILLING
          </a>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <!-- Account Settings Section -->
        <section class="settings-section">
          <h2 class="section-title">YOUR ACCOUNT SETTINGS</h2>

          <form @submit.prevent="handleSaveSettings">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                  type="email"
                  id="name"
                  v-model="userProfile.email"
                  placeholder="Enter your Email"
              />
            </div>

            <div class="form-group">
              <label for="first-name">First name</label>
              <input
                  type="text"
                  id="first-name"
                  v-model="userProfile.firstName"
                  placeholder="Enter your first name"
              />
            </div>


            <div class="form-group">
              <label for="last-name">Last name</label>
              <input
                type="text"
                id="last-name"
                v-model="userProfile.lastName"
                placeholder="Enter your last name"
            />
          </div>

            <div class="form-group">
              <label for="address">Address</label>
              <input
                  type="text"
                  id="address"
                  v-model="userProfile.address"
                  placeholder="Enter your address"
              />
            </div>

            <div class="form-group">
              <label for="phone-number">Phone number</label>
              <input
                  type="text"
                  id="phone-number"
                  v-model="userProfile.phoneNumber"
                  placeholder="Enter your phone number"
              />
            </div>

            <div class="avatar-upload">
              <div class="avatar-preview">
                <svg v-if="!userProfile.avatar" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M20 21a8 8 0 1 0-16 0"/>
                </svg>
                <img v-else :src="`http://localhost:3000${userProfile.avatar}`" alt="Avatar" />
              </div>
              <input
                  type="file"
                  id="avatar-file"
                  @change="handleAvatarChange"
                  accept="image/*"
                  hidden
              />
              <label for="avatar-file" class="file-label">Choose file/photo</label>
            </div>

            <button type="submit" class="btn-save">SAVE SETTINGS</button>
          </form>
        </section>

        <!-- Password Change Section -->
        <section class="settings-section">
          <h2 class="section-title">PASSWORD CHANGE</h2>

          <form @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label for="current-password">Current password</label>
              <input
                  type="password"
                  id="current-password"
                  v-model="passwordForm.oldPassword"
                  placeholder="••••••••"
              />
            </div>

            <div class="form-group">
              <label for="new-password">New password</label>
              <input
                  type="password"
                  id="new-password"
                  v-model="passwordForm.password"
                  placeholder="••••••••"
              />
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirm password</label>
              <input
                  type="password"
                  id="confirm-password"
                  v-model="passwordForm.passwordConfirm"
                  placeholder="••••••••"
                  :class="{ 'error': passwordForm.passwordConfirm && passwordForm.password !== passwordForm.passwordConfirm }"
              />
            </div>

            <button type="submit" class="btn-save" :disabled="passwordForm.password !== passwordForm.passwordConfirm">
              SAVE PASSWORD
            </button>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {getUserProfile} from "@/api/profiles/user-profile.js";
import {changeProfile} from "@/api/profiles/change-profile.js";
import {changePassword} from "@/api/profiles/change-password.js";
import {logout} from "@/api/auth/logout.js";
import {changeAvatar} from "@/api/profiles/change-avatar.js";
import {useNotificationStore} from "@/components/notification.js";

const activeTab = ref('settings')

const user = ref({});

const notification =useNotificationStore();

const userProfile = reactive({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  avatar:'',
  phoneNumber: '',

})

const passwordForm = {
  oldPassword: '',
  password: '',
  passwordConfirm: ''
}

onMounted(() => {
  loadUser()
})

const loadUser = async () => {

  try{
    const response = await getUserProfile();
    user.value = response.data;

    userProfile.email = user.value.email || ""
    userProfile.firstName = user.value.firstName || ""
    userProfile.lastName = user.value.lastName || ""
    userProfile.address = user.value.address || ""
    userProfile.avatar = user.value.pictureUrl||""
    userProfile.phoneNumber = user.value.phoneNumber || ""

  }
  catch (error){
    console.error("Error loading users", error);
  }
}


const handleSaveSettings = async () => {
  try{
    const payload = Object.fromEntries(Object.entries(userProfile).filter(([key,value])=>value!==''&&key!=='avatar'));
    const response = await changeProfile(payload)

    await loadUser()

  }
  catch (error){
    console.error("Failed to update profile:", error)
  }
}

const handleChangePassword = async () => {
  if (passwordForm.password !== passwordForm.passwordConfirm) {
    notification.show("Error, passwords do not match","error");
    return
  }
  try{

    const response = await changePassword(passwordForm);
    passwordForm.oldPassword = ''
    passwordForm.password = ''
    passwordForm.passwordConfirm = ''

    notification.show("Success, password has been uploaded","success");
  }
  catch (error){
    notification.show("Error, password has not been changed","error");
    console.error("Failed to update password:", error)
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;
  try{
    const response = await changeAvatar(file);

    notification.show("success, avatar has been uploaded","success");
    window.location.reload();
  }
  catch (error){
    notification.show("Error, avatar has not been uploaded","error");
    console.log(error);
  }
  finally {
    event.target.value = '';
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
  margin: 0;
  padding: 0;
}

.page-wrapper {
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

/* Header */
.header {
  background-color: #374151; /* Changed from #4a4a4a to match aggregator header */
  color: white;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  flex: 1;
}

.logo-text {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color:white;
  text-decoration:none
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}



.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
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

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #999;
}

.user-avatar svg {
  width: 20px;
  height: 20px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 15px;
  font-weight: 500;
}

/* Main Content */
.main-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 56px);
  padding-top: 20px; /* Added top padding for spacing between header and sidebar */
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #94A3B8;
  padding: 0;
  margin-left: 20px;
  border-radius: 4px;
  align-self: stretch;
  margin-bottom: 40px;
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
  color: #FFFFFF;
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
  padding: 40px 60px;
  background-color: white;
  margin: 0 40px 40px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 48px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d; /* Changed from #5cb85c (green) to dark gray */
  margin-bottom: 28px;
  letter-spacing: 0.5px;
}

/* Form Styles */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  background-color: #fafafa;
  color: #666;
}

.form-group input:focus {
  border-color: #2d2d2d; /* Changed from #5cb85c (green) to dark gray */
  background-color: white;
}

.form-group input.error {
  border-color: #dc3545;
}

.form-group input::placeholder {
  color: #aaa;
}

/* Avatar Upload */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #999;
}

.avatar-preview svg {
  width: 32px;
  height: 32px;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-label {
  font-size: 13px;
  color: #2d2d2d; /* Changed from #5cb85c (green) to dark gray */
  cursor: pointer;
  transition: opacity 0.2s;
  text-decoration: underline;
}

.file-label:hover {
  opacity: 0.8;
}

/* Save Button */
.btn-save {
  background-color: #2d2d2d; /* Changed from #5cb85c (green) to dark gray */
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
  letter-spacing: 0.5px;
}

.btn-save:hover:not(:disabled) {
  background-color: #1a1a1a; /* Changed from #4cae4c (light green) to darker gray */
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 968px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
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
    margin: 20px;
    padding: 30px 24px;
  }
}

@media (max-width: 600px) {
  .header-content {
    padding: 0 12px;
  }

  .logo-text {
    font-size: 12px;
  }

  .username {
    display: none;
  }

  .content-area {
    padding: 24px 20px;
  }

  .form-group input {
    max-width: 100%;
  }
}
</style>
