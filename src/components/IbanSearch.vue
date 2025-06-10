<template>
  <section class="search-bg">
    <section class="search-container">
      <h1 class="search-title">Customer Search</h1>

      <section class="search-form">
        <section class="search-field">
          <label class="search-label">First Name</label>
          <input
              v-model="firstName"
              class="search-control"
              placeholder="Enter first name"
              @input="searchUsers"
          />
        </section>

        <section class="search-field">
          <label class="search-label">Last Name</label>
          <input
              v-model="lastName"
              class="search-control"
              placeholder="Enter last name"
              @input="searchUsers"
          />
        </section>
      </section>
      <section class="search-results" v-if="users.length">
        <table class="results-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>IBAN</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.iban }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <p v-else class="search-empty">No customers found.</p>
    </section>
  </section>
</template>

<script>
import {userStore} from "@/stores/userStore.js";

export default {
  setup() {
    const store = userStore()
    return { store }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      users: []
    };
  },
  methods: {
    async searchUsers() {
      if (!this.firstName && !this.lastName) {
        this.users = [];
        return;
      }
      try {
        this.users = await this.store.getUsersByFirstNameAndLastName(this.firstName, this.lastName);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }
  }
};
</script>


<style scoped>
.search-bg {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container {
  background: #e6ecf5;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  padding: 40px 32px 32px 32px;
  max-width: 600px;
  width: 100%;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
}

.search-title {
  color: #2a4365;
  font-size: 1.8rem;
  margin-bottom: 24px;
  font-weight: 700;
  text-align: center;
}

.search-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.search-field {
  margin-bottom: 18px;
}

.search-label {
  color: #385170;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.search-control {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cfd8e3;
  background: #f9fbfd;
  color: #223046;
  font-size: 1rem;
  transition: border 0.2s;
}

.search-control:focus {
  border-color: #2b6cb0;
  outline: none;
  background: #fff;
}

.search-results {
  width: 100%;
  margin-top: 24px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  background: #2b6cb0;
  color: white;
  padding: 12px;
  text-align: left;
}

.results-table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.search-empty {
  color: #718096;
  text-align: center;
  margin-top: 24px;
}
</style>