<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="$emit('close')">×</button>
      <h2 class="modal-title">Password recovery</h2>
      <p class="modal-description">Enter the email address associated with your account</p>

      <p v-if="message" class="feedback">{{ message }}</p>

      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="forgot-email">Email</label>
          <input
              type="email"
              id="forgot-email"
              v-model="email"
              placeholder="enter your email"
              required
              ref="emailInput"
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send link' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { forgotPassword } from "@/api/auth/forgot-password.js";

const email = ref('')
const message = ref('')
const isLoading = ref(false)
const emailInput = ref(null)

const handleForgotPassword = async () => {
  isLoading.value = true
  try {
    await forgotPassword({ email: email.value });
    message.value = "If this email exists, a password reset link has been sent.";
    email.value = ''
    setTimeout(() => $emit('close'), 2000);
  } catch (err) {
    console.error(err)
    message.value = "Something went wrong! Please check your email."
  } finally {
    isLoading.value = false
  }
}

// автофокус при открытии
watch(emailInput, async () => {
  await nextTick()
  emailInput.value?.focus()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
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

.feedback {
  margin-top: 16px;
  font-size: 14px;
  color: #2d2d2d;
  text-align: center;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus {
  border-color: #2d2d2d;
}

.form-group input::placeholder {
  color: #999;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary {
  background-color: #2d2d2d;
  color: white;
  margin-bottom: 20px;
}

.btn-primary:hover {
  background-color: #1a1a1a;
}

.divider span {
  padding: 0 16px;
}


.form-footer a {
  color: #2d2d2d;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.form-footer a:hover {
  opacity: 0.7;
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
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 40px;
  max-width: 440px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 32px;
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
}

.modal-close:hover {
  color: #2d2d2d;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 12px;
}

.modal-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 500px) {

  .modal {
    padding: 30px 24px;
  }
}
</style>
