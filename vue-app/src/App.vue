<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div class="form-group">
        <label for="Password Confirmation">Password Confirmation</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div class="form-group">
        <label for="Password Confirmation">First name</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div class="form-group">
        <label for="Password Confirmation">Last name</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    error.value = '';
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      password: password.value,
    });
    // Сохраняем токен в localStorage
    localStorage.setItem('token', response.data.access_token);
    alert('Login successful!');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
