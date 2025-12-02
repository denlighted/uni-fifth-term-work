<template>
  <transition name="dialog-fade">
    <div class="dialog-overlay" v-if="dialogVisible" @click="handleCancel">
      <transition name="dialog-slide">
        <div class="dialog-box" v-if="dialogVisible" @click.stop>
          <div class="dialog-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="dialog-content">
            <h3 class="dialog-title">Authorization required</h3>
            <p class="dialog-message">You must be logged in to perform this action. Please log in or create a new account</p>
          </div>
          <div class="dialog-actions">
            <button class="btn btn-secondary" @click="handleCancel">Cancel</button>
            <button class="btn btn-primary" @click="handleLogin">Log in</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import router from "@/router/index.js";

const dialogVisible = ref(false)

defineExpose({
  showDialog: () => {
    dialogVisible.value = true;
  }
});


const handleCancel = () => {
  dialogVisible.value = false
}

const handleLogin = () => {
  dialogVisible.value = false
  router.push('/auth/login');
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dialog-demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.dialog-demo h2 {
  font-size: 28px;
  color: #2d2d2d;
  margin-bottom: 30px;
}

.dialog-demo > button {
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  background: white;
  color: #2d2d2d;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.dialog-demo > button:hover {
  background-color: #2d2d2d;
  color: white;
  border-color: #2d2d2d;
}

/* Dialog Overlay */
.dialog-overlay {
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
  padding: 20px;
}

/* Dialog Box */
.dialog-box {
  background: white;
  border-radius: 12px;
  padding: 36px 32px 28px;
  max-width: 460px;
  width: 100%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dialog-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #2d2d2d;
}

.dialog-content {
  margin-bottom: 32px;
  width: 100%;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 14px;
}

.dialog-message {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.dialog-actions {
  width: 100%;
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #2d2d2d;
  border: 1px solid #d1d1d1;
}

.btn-secondary:hover {
  background-color: #e5e5e5;
  border-color: #b1b1b1;
}

.btn-primary {
  background-color: #2d2d2d;
  color: white;
}

.btn-primary:hover {
  background-color: #1a1a1a;
}

/* Animations */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-slide-enter-active,
.dialog-slide-leave-active {
  transition: all 0.3s ease;
}

.dialog-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.dialog-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive */
@media (max-width: 500px) {
  .dialog-box {
    padding: 32px 24px 24px;
  }

  .dialog-title {
    font-size: 22px;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
