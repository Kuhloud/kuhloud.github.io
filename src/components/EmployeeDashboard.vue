<template>
  <section class="dashboard-container">
    <h1 class="dashboard-title">Employee Dashboard</h1>
    <div class="dashboard-grid">
      <router-link to="/users/inactivelist" class="card">
        <div class="card-icon">👤</div>
        <h2 class="card-title">Activate Users</h2>
        <p class="card-desc">Approve new customer registrations</p>
      </router-link>

      <router-link to="/employee-transfer" class="card">
        <div class="card-icon">💸</div>
        <h2 class="card-title">Transfer Funds</h2>
        <p class="card-desc">Move money between customer accounts</p>
      </router-link>

      <router-link to="/users" class="card">
        <div class="card-icon">🔍</div>
        <h2 class="card-title">View User Details</h2>
        <p class="card-desc">Lookup customer profiles & transactions</p>
      </router-link>
      
      <router-link to="/employee-alltransactions" class="card">
        <div class="card-icon">🔍</div>
        <h2 class="card-title">View All Transactions</h2>
        <p class="card-desc">Lookup all transactions</p>
      </router-link>
    </div>
  </section>
</template>

<script setup>
// No additional logic needed—this is purely navigational.
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 60px auto;
  padding: 0 24px;
  text-align: center;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.dashboard-title {
  font-size: 2.4rem;
  color: #2a4365;
  margin-bottom: 32px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}


.card {
  display: block;
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.card-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.card-title {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: #234e7d;
}
.card-desc {
  font-size: 1rem;
  color: #4a5568;
}
</style>
