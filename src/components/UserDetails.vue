<template>
  <div class="container">
    <button class="btn btn-danger" @click="$router.back()">← Back</button>

    <h2>User Info</h2>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
      <p><strong>BSN:</strong> {{ user.bsn }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
    </div>

    <h3 class="mt-4">Transactions</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>From IBAN</th>
          <th>To IBAN</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td>{{ tx.id }}</td>
          <td>{{ tx.fromIban }}</td>
          <td>{{ tx.toIban }}</td>
          <td>{{ tx.amount }}</td>
          <td>{{ tx.description }}</td>
          <td>{{ tx.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '@/axios-auth'
import { getAuthToken } from "@/utils/auth"

export default {
  data() {
    return {
      user: null,
      transactions: [],
    };
  },
  mounted() {
    this.loadUser()
    this.loadTransactions()
  },
  methods: {
    loadUser() {
      const id = this.$route.params.id
      axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      })
        .then(res => (this.user = res.data))
        .catch(err => console.error("Failed to load user", err))
    },
    loadTransactions() {
      const id = this.$route.params.id
      axios.get(`/transactions/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      })
        .then(res => (this.transactions = res.data))
        .catch(err => console.error("Failed to load transactions", err))
    }
  }
}
</script>

