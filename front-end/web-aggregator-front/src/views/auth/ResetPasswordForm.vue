<template>
  <div class="auth-container">
    <div class="auth-form-wrapper">
      <div class="auth-form">
        <h2 class="form-title">New password</h2>
        <p class="form-subtitle">Enter a new password for your account</p>

        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label for="new-password">New password</label>
            <input
                type="password"
                id="new-password"
                v-model="resetForm.password"
                placeholder="enter a new password"
                minlength="6"
                required
            />
            <span class="input-hint">Minimum 6 characters</span>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm password</label>
            <input
                type="password"
                id="confirm-password"
                v-model="resetForm.passwordConfirm"
                placeholder="repeat password"
                required
                :class="{ 'input-error': showError }"
            />
            <span v-if="showError" class="error-message">Passwords do not match</span>
          </div>

          <button type="submit" class="btn btn-primary">Save password</button>
        </form>

        <p class="form-footer">
          Remembered your password?
          <a href="/auth/login">Sign In</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {resetPassword} from "@/api/auth/reset-password.js";
import {useRoute} from "vue-router";
import router from "@/router/index.js";

const resetForm = ref({
  password: '',
  passwordConfirm: ''
});

const route = useRoute();
const token = route.query.token;

const showError = computed(() => {
  return resetForm.value.passwordConfirm.length > 0 &&
      resetForm.value.password !== resetForm.value.passwordConfirm
})

const handleResetPassword = async () => {
  if (resetForm.value.password !== resetForm.value.passwordConfirm) {
    return
  }

  if (resetForm.value.password.length < 6) {
    return
  }

  try{

    const data ={
      password: resetForm.value.password,
      passwordConfirm:resetForm.value.passwordConfirm
    }

    const response = await resetPassword(token,data);
    console.log('Your password has been changed successfully:', response.data);
    alert("Your password has been changed successfully. Redirection to Login page...");
    setTimeout(() => {
      router.push('/auth/login');
    }, 1500);

  }
  catch (error){
    console.error('Password reset failed:', error)
    alert('Password reset failed! Please check your details.')
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 440px;
}

.auth-form {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 28px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 12px;
  text-align: center;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
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
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus {
  border-color: #2d2d2d;
}

.form-group input::placeholder {
  color: #999;
}

.input-error {
  border-color: #dc3545 !important;
}

.input-error:focus {
  border-color: #dc3545 !important;
}

.input-hint {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.error-message {
  display: block;
  font-size: 12px;
  color: #dc3545;
  margin-top: 6px;
  font-weight: 500;
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
  margin-bottom: 20px;
}

.btn-primary:hover {
  background-color: #1a1a1a;
}

.btn-primary:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
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

/* Responsive */
@media (max-width: 500px) {
  .auth-form {
    padding: 30px 24px;
  }

  .form-title {
    font-size: 24px;
  }
}
</style>
