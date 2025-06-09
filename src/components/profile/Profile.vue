<template>
  <section class="profile-container">
    <section class="welcome-section">
      <h1 class="profile-title">User Profile</h1>
      <p class="subtitle">View and manage your account details</p>
    </section>

    <section class="card-section">
      <section class="profile-card" v-if="user">
        <h3>Personal Information</h3>
        <div class="profile-detail">
          <span class="detail-label">Name:</span>
          <span class="detail-value">{{ user.firstName }} {{ user.lastName }}</span>
        </div>
        <div class="profile-detail">
          <span class="detail-label">E-mail:</span>
          <span class="detail-value">{{ user.email }}</span>
        </div>
        <div class="profile-detail">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">{{ user.phoneNumber }}</span>
        </div>
        <div class="profile-detail">
          <span class="detail-label">BSN:</span>
          <span class="detail-value">{{ user.bsn }}</span>
        </div>
      </section>
      <p v-else class="no-data">No user data available</p>
    </section>

    <section class="card-section">
      <h3 class="accounts-title">Your Accounts</h3>
      <section class="accounts-grid" v-if="accounts.length > 0">
        <section class="account-card" v-for="account in accounts" :key="account.id">
          <h4>{{ account.name }}</h4>
          <div class="account-detail">
            <span class="detail-label">Balance: </span>
            <span class="detail-value">€ {{ account.balance }}</span>
          </div>
          <div class="account-detail">
            <span class="detail-label">IBAN: </span>
            <span class="detail-value">{{ account.iban }}</span>
          </div>
        </section>

        <section class="account-card total-card">
          <h4>Total Balance</h4>
          <div class="account-detail">
            <span class="detail-value total-balance">
              ${{ accounts.reduce((sum, acc) => sum + acc.balance, 0) }}
            </span>
          </div>
        </section>
      </section>
      <p v-else class="no-data">No accounts found</p>
    </section>
  </section>
</template>
<!--<script setup lang="js">-->
<script>
import {useAccountStore} from "@/stores/accountStore.js";
import {computed, onMounted} from "vue";
import {userStore} from "@/stores/userStore.js";
import axios from "axios";

export default {
  setup() {
    const uStore = userStore();
    const user = computed(() => uStore.user);
    const accounts = computed(() => user.value?.accounts || []);
    const user_id = localStorage.getItem("user_id");
    onMounted(
        async () => {
          try {
            console.log('fetching user info')
            // await accountStore.fetchAccounts(user_id);
            await uStore.getUserInfo(user_id);
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
    )
    return { user, accounts };
  },
  methods: {
    useAccountStore,
    userStore,
  },
};

</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #f4f7fa;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  color: #223046;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.profile-title {
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
  margin-bottom: 40px;
}

.profile-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 80, 120, 0.06);
  padding: 28px 24px;
  width: 100%;
  margin-bottom: 24px;
}

.profile-card h3 {
  color: #2b6cb0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.profile-detail {
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-label {
  font-weight: 600;
  color: #385170;
  min-width: 120px;
}

.detail-value {
  color: #42516d;
}

.accounts-title {
  color: #2b6cb0;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.account-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 80, 120, 0.06);
  padding: 24px;
  transition: transform 0.2s;
}

.account-card:hover {
  transform: translateY(-4px);
}

.account-card h4 {
  color: #2a4365;
  margin-bottom: 16px;
}

.total-card {
  background: #e6ecf5;
  grid-column: 1 / -1;
}

.total-balance {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2b6cb0;
}

.no-data {
  color: #718096;
  text-align: center;
  padding: 24px;
}
</style>