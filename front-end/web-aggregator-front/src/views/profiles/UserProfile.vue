<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <div class="profile-card">
        <h2 class="profile-title">Профиль пользователя</h2>

        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar">
            <svg v-if="!userProfile.avatar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <img v-else :src="userProfile.avatar" alt="Avatar" />
          </div>
          <button type="button" class="btn-change-avatar" @click="handleChangeAvatar">
            Изменить фото
          </button>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="handleSaveProfile">
          <div class="form-row">
            <div class="form-group">
              <label for="first-name">Имя</label>
              <input
                  type="text"
                  id="first-name"
                  v-model="userProfile.firstName"
                  :disabled="!isEditing"
                  placeholder="Введите имя"
                  required
              />
            </div>

            <div class="form-group">
              <label for="last-name">Фамилия</label>
              <input
                  type="text"
                  id="last-name"
                  v-model="userProfile.lastName"
                  :disabled="!isEditing"
                  placeholder="Введите фамилию"
                  required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                v-model="userProfile.email"
                :disabled="!isEditing"
                placeholder="Введите email"
                required
            />
          </div>

          <div class="form-group">
            <label for="phone">Телефон</label>
            <input
                type="tel"
                id="phone"
                v-model="userProfile.phone"
                :disabled="!isEditing"
                placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div class="form-group">
            <label for="city">Город</label>
            <input
                type="text"
                id="city"
                v-model="userProfile.city"
                :disabled="!isEditing"
                placeholder="Введите город"
            />
          </div>

          <div class="form-group">
            <label for="address">Адрес</label>
            <input
                type="text"
                id="address"
                v-model="userProfile.address"
                :disabled="!isEditing"
                placeholder="Введите адрес"
            />
          </div>

          <div class="form-group">
            <label for="birth-date">Дата рождения</label>
            <input
                type="date"
                id="birth-date"
                v-model="userProfile.birthDate"
                :disabled="!isEditing"
            />
          </div>

          <!-- Action Buttons -->
          <div class="button-group" v-if="!isEditing">
            <button type="button" class="btn btn-primary" @click="isEditing = true">
              Редактировать профиль
            </button>
            <button type="button" class="btn btn-secondary" @click="handleChangePassword">
              Изменить пароль
            </button>
          </div>

          <div class="button-group" v-else>
            <button type="submit" class="btn btn-primary">
              Сохранить изменения
            </button>
            <button type="button" class="btn btn-cancel" @click="handleCancel">
              Отмена
            </button>
          </div>
        </form>

        <!-- Account Actions -->
        <div class="account-actions">
          <button type="button" class="btn-link btn-logout" @click="handleLogout">
            Выйти из аккаунта
          </button>
          <button type="button" class="btn-link btn-delete" @click="handleDeleteAccount">
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isEditing = ref(false)

const userProfile = reactive({
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  city: 'Москва',
  address: 'ул. Примерная, д. 10',
  birthDate: '1990-01-15',
  avatar: null
})

// Сохраняем оригинальные данные для отмены изменений
const originalProfile = { ...userProfile }

const handleSaveProfile = () => {
  console.log('Save profile:', userProfile)
  isEditing.value = false
  // Обновляем оригинальные данные после сохранения
  Object.assign(originalProfile, userProfile)
  // Здесь логика сохранения профиля
}

const handleCancel = () => {
  // Восстанавливаем оригинальные данные
  Object.assign(userProfile, originalProfile)
  isEditing.value = false
}

const handleChangeAvatar = () => {
  console.log('Change avatar')
  // Здесь логика изменения аватара (открытие file picker)
}

const handleChangePassword = () => {
  console.log('Change password')
  // Переход на страницу смены пароля или открытие модального окна
}

const handleLogout = () => {
  console.log('Logout')
  // Здесь логика выхода из аккаунта
}

const handleDeleteAccount = () => {
  if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
    console.log('Delete account')
    // Здесь логика удаления аккаунта
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.profile-wrapper {
  width: 100%;
  max-width: 600px;
}

.profile-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-title {
  font-size: 28px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 30px;
  text-align: center;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
  color: #999;
  border: 3px solid #e0e0e0;
}

.avatar svg {
  width: 60px;
  height: 60px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-change-avatar {
  background: none;
  border: none;
  color: #2d2d2d;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
  padding: 8px 16px;
}

.btn-change-avatar:hover {
  opacity: 0.7;
}

/* Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #2d2d2d;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
  font-family: inherit;
  background-color: white;
}

.form-group input:disabled {
  background-color: #f9f9f9;
  color: #666;
  cursor: not-allowed;
}

.form-group input:not(:disabled):focus {
  border-color: #2d2d2d;
}

.form-group input::placeholder {
  color: #999;
}

/* Button Styles */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background-color: #2d2d2d;
  color: white;
}

.btn-primary:hover {
  background-color: #1a1a1a;
}

.btn-secondary {
  background-color: white;
  color: #2d2d2d;
  border: 1px solid #d1d1d1;
}

.btn-secondary:hover {
  background-color: #f9f9f9;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #2d2d2d;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

/* Account Actions */
.account-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-link {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
  padding: 8px;
}

.btn-link:hover {
  opacity: 0.7;
}

.btn-logout {
  color: #2d2d2d;
}

.btn-delete {
  color: #d32f2f;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-card {
    padding: 30px 24px;
  }

  .profile-title {
    font-size: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .avatar svg {
    width: 50px;
    height: 50px;
  }
}
</style>
