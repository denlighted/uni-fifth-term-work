<!-- frontend/src/views/Register.vue -->
<script setup>
import { ref } from 'vue';
import { registerUser } from '../api/auth';

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');

const loading = ref(false);
const error = ref('');
const success = ref('');

async function submit() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const response = await registerUser({
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phoneNumber: phoneNumber.value || null,
    });

    success.value = 'Регистрация успешно выполнена';
    console.log('Response:', response.data);

  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка запроса';
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <h2>Регистрация</h2>

    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="firstName" type="text" placeholder="Имя" required />
      <input v-model="lastName" type="text" placeholder="Фамилия" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <input v-model="passwordConfirm" type="password" placeholder="Повторите пароль" required />
      <input v-model="phoneNumber" type="text" placeholder="Номер телефона"/>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Зарегистрироваться' }}
      </button>
    </form>

    <p v-if="success" style="color: green">{{ success }}</p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>

</template>

<style>
/* необязательные стили */
.container {
  max-width: 450px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
