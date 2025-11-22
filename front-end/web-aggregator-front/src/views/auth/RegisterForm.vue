<template>
  <div class="auth-container">
    <div class="auth-form-wrapper">
      <div class="auth-form">
        <h2 class="form-title">Sign Up</h2>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="register-name">Email</label>
            <input type="email" id="register-email" v-model="registerForm.email" placeholder="enter your email" required />
          </div>

          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" v-model="registerForm.password" placeholder="minimum 5 characters" minlength="5" required />
          </div>

          <div class="form-group">
            <label for="register-confirm">Confirm you password</label>
            <input type="password" id="register-confirm" v-model="registerForm.confirmPassword" placeholder="repeat your password" required />
          </div>

          <div class="form-group">
            <label for="first-name">First name</label>
            <input type="text" id="register-first-name" v-model="registerForm.firstName" placeholder="enter your first name" required />
          </div>

          <div class="form-group">
            <label for="last-name">Last name</label>
            <input type="text" id="register-last-name" v-model="registerForm.lastName" placeholder="enter your last name" required />
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone number</label>
            <input type="text" id="register-phone-number" v-model="registerForm.phoneNumber" placeholder="enter your phone number"/>
          </div>

          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

        <a :href="backendHost + '/api/auth/google'" class="btn btn-google">
          <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </a>

        <p class="form-footer">
          Already have an account?
          <router-link to="/auth/login">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {registerUser} from "@/api/auth/register.ts";
import {googleAuth} from "@/api/auth/google-auth.js";
import router from "@/router/index.js";

const backendHost = 'http://localhost:3000';

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName:'',
  lastName:'',
  phoneNumber:''
})

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  try {
    const data = {
      email: registerForm.value.email,
      password: registerForm.value.password,
      passwordConfirm: registerForm.value.confirmPassword,
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      phoneNumber: registerForm.value.phoneNumber || undefined
    }

    const response = await registerUser(data)
    console.log('Registration successful:', response.data)
    alert('Registration successful! Redirection to login page...')
    setTimeout(() => {
      router.push('/auth/login');
    }, 1500);

  } catch (error) {
    console.error('Registration failed:', error)
    alert('Registration error! Please check your details.')
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
  margin-bottom: 30px;
  text-align: center;
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

.forgot-password {
  display: inline-block;
  font-size: 14px;
  color: #2d2d2d;
  text-decoration: none;
  margin-bottom: 24px;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.7;
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

.btn-google {
  background-color: white;
  color: #2d2d2d;
  border: 1px solid #d1d1d1;
  margin-bottom: 24px;
}

.btn-google:hover {
  background-color: #f9f9f9;
}

.google-icon {
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #999;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider span {
  padding: 0 16px;
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