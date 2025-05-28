<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>Welcome to Benevolent Bank</h1>
      <h2 v-if="firstName">Hello, {{ firstName }}!</h2>
      <h2 v-else>Welcome, valued customer!</h2>
      <p class="subtitle">
        Your trusted partner in digital banking. Manage your finances with ease and security.
      </p>
    </div>

    <div class="card-section">
      <div class="feature-card">
        <h3>Mock ATM</h3>
        <p>
          Access your checking account just like at a real ATM. Deposit or withdraw cash instantly and see your balance update live.
        </p>
        <router-link to="/mockatm" class="btn-primary">Go to Mock ATM</router-link>
      </div>
      <div class="feature-card">
        <h3>Transfer Money</h3>
        <p>
          Easily transfer funds between your own accounts or to others. Fast, secure, and always available.
        </p>
        <router-link to="/transfer" class="btn-primary">Go to Transfers</router-link>
      </div>
    </div>

    <div class="info-section">
      <h4>Why choose Benevolent Bank?</h4>
      <ul>
        <li>24/7 secure online access to your accounts</li>
        <li>Instant money transfers and real-time balance updates</li>
        <li>Modern, user-friendly interface</li>
        <li>Dedicated support for all your banking needs</li>
      </ul>
      <p class="footer-note">
        Benevolent Bank is committed to making your banking experience simple, safe, and rewarding.
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { userStore } from "@/stores/userStore";

export default {
  setup() {
    const store = userStore();
    const firstName = computed(() => store.firstName);
    return { firstName };
  },
};
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #f4f7fa;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  color: #223046;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.welcome-section {
  text-align: center;
  margin-bottom: 36px;
}

.welcome-section h1 {
  color: #2a4365;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #5a6b82;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.card-section {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.feature-card {
  background: #e6ecf5;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 80, 120, 0.06);
  padding: 28px 24px;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.feature-card h3 {
  color: #2b6cb0;
  margin-bottom: 12px;
}

.feature-card p {
  color: #42516d;
  margin-bottom: 18px;
}

.btn-primary {
  background: #2b6cb0;
  color: #fff;
  padding: 10px 22px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #234e7d;
}

.info-section {
  background: #f0f4fa;
  border-radius: 10px;
  padding: 24px 20px;
  margin-top: 24px;
}

.info-section h4 {
  color: #385170;
  margin-bottom: 12px;
}

.info-section ul {
  color: #42516d;
  margin-bottom: 14px;
  padding-left: 20px;
}

.footer-note {
  color: #7b8ba3;
  font-size: 0.98rem;
  margin-top: 10px;
  text-align: center;
}
</style>
