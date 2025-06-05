<template>
  <section class="login-bg">
    <div class="login-container">
      <h2 class="login-title">Sign in to Benevolent Bank</h2>
      <form @submit.prevent="login" class="login-form">
        <div v-if="errorMessage" class="alert alert-danger login-alert">
          {{ errorMessage }}
        </div>
        <div class="mb-3">
          <label for="inputEmail" class="form-label">Email Address</label>
          <input
            id="inputEmail"
            type="text"
            v-model="email"
            class="form-control"
            required
            autocomplete="username"
          />
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            id="inputPassword"
            required
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="btn-primary login-btn">Login</button>
      </form>
      <p class="login-footer-note">
        Welcome back! Your security and privacy are our top priority.
      </p>
    </div>
  </section>
</template>

<script>
import { userStore } from '@/stores/userStore.js'

export default {
  name: 'LoginComponent',
  setup() {
    const store = userStore()
    return { store }
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      await this.store
        .login(this.email, this.password)
        .then(() => {
          this.$router.replace('/')
        })
        .catch(() => (this.errorMessage = "Email or password is incorrect. Please try again."))
    }
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background: #e6ecf5;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  padding: 40px 32px 32px 32px;
  max-width: 400px;
  width: 100%;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  color: #2a4365;
  font-size: 2rem;
  margin-bottom: 24px;
  font-weight: 700;
  text-align: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mb-3 {
  margin-bottom: 18px;
}

.form-label {
  color: #385170;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cfd8e3;
  background: #f9fbfd;
  color: #223046;
  font-size: 1rem;
  transition: border 0.2s;
}

.form-control:focus {
  border-color: #2b6cb0;
  outline: none;
  background: #fff;
}

.btn-primary.login-btn {
  background: #2b6cb0;
  color: #fff;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.btn-primary.login-btn:hover {
  background: #234e7d;
}

.login-alert {
  width: 100%;
  margin-bottom: 16px;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 1rem;
}

.login-footer-note {
  color: #7b8ba3;
  font-size: 0.98rem;
  margin-top: 18px;
  text-align: center;
}
</style>
