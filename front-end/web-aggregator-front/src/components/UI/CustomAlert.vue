<template>
  <div class="alert-demo">
    <h2>Custom Alert Demo</h2>
    <!-- Custom Alert Component -->
    <transition name="alert-fade">
      <div class="alert-overlay" v-if="alertVisible" @click="closeAlert">
        <transition name="alert-slide">
          <div class="alert-box" v-if="alertVisible" @click.stop>
            <div class="alert-icon" :class="`alert-${alertType}`">
              <!-- svg как у тебя -->
            </div>
            <div class="alert-content">
              <p class="alert-message">{{ alertMessage }}</p>
            </div>
            <button class="alert-close" @click="closeAlert">×</button>
            <div class="alert-actions">
              <button class="btn btn-primary" @click="closeAlert">OK</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/components/notification.ts'

const store = useNotificationStore()

const alertVisible = computed(() => store.visible)
const alertMessage = computed(() => store.message)
const alertType = computed(() => store.type)

const closeAlert = () => {
  store.visible = false
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.alert-demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.alert-demo h2 {
  font-size: 28px;
  color: #2d2d2d;
  margin-bottom: 30px;
}

.demo-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-buttons button {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  background: white;
  color: #2d2d2d;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.demo-buttons button:hover {
  background-color: #2d2d2d;
  color: white;
  border-color: #2d2d2d;
}

/* Alert Overlay */
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Alert Box */
.alert-box {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 440px;
  width: 100%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.alert-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.alert-info {
  background-color: #e3f2fd;
  color: #1976d2;
}

.alert-success {
  background-color: #e8f5e9;
  color: #388e3c;
}

.alert-warning {
  background-color: #fff3e0;
  color: #f57c00;
}

.alert-error {
  background-color: #ffebee;
  color: #d32f2f;
}

.alert-content {
  margin-bottom: 28px;
  width: 100%;
}

.alert-title {
  font-size: 22px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 12px;
}

.alert-message {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.alert-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  border-radius: 4px;
}

.alert-close:hover {
  color: #2d2d2d;
  background-color: #f5f5f5;
}

.alert-actions {
  width: 100%;
}

.btn {
  width: 100%;
  padding: 12px;
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

/* Animations */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}

.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive */
@media (max-width: 500px) {
  .alert-box {
    padding: 28px 24px;
  }

  .alert-title {
    font-size: 20px;
  }

  .demo-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .demo-buttons button {
    width: 100%;
  }
}
</style>
