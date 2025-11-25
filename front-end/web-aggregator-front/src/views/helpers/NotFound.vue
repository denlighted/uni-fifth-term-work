<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page not found</h1>
      <p class="error-description">
        Unfortunately, the page you are looking for does not exist or has been moved.
      </p>

      <div class="error-actions">
        <button class="btn btn-primary" @click="goHome">
          To the home page
        </button>
        <button class="btn btn-secondary" @click="goBack">
          Go back
        </button>
      </div>

      <div class="error-links">
        <h3>Useful links:</h3>
        <ul>
          <li><a href="/">Home page</a></li>
          <li><a href="/auth/login">Sign In</a></li>
          <li><a href="/auth/register">Sign up</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const goHome = () => {
  window.location.href = '/'
}

const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.error-content {
  background: white;
  border-radius: 8px;
  padding: 60px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #2d2d2d;
  line-height: 1;
  margin-bottom: 20px;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
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

.error-links {
  border-top: 1px solid #e0e0e0;
  padding-top: 30px;
  text-align: left;
}

.error-links h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 16px;
}

.error-links ul {
  list-style: none;
  padding: 0;
}

.error-links li {
  margin-bottom: 10px;
}

.error-links a {
  color: #2d2d2d;
  text-decoration: none;
  font-size: 15px;
  transition: opacity 0.2s;
  display: inline-block;
}

.error-links a:hover {
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 600px) {
  .error-content {
    padding: 40px 24px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
