<template>
  <div class="atm-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="$router.push('/employeedashboard')">← Back</button>
    </div>

    <div class="atm-header">
      <h2>All Transactions</h2>
      <p class="atm-subtitle">Overview of all past transactions (employee view).</p>
    </div>

    <div class="atm-card" v-if="transactions.length">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>From IBAN</th>
            <th>To IBAN</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Initiator Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx.id">
            <td>{{ tx.id }}</td>
            <td>{{ tx.fromIban }}</td>
            <td>{{ tx.toIban }}</td>
            <td>€{{ tx.amount.toFixed(2) }}</td>
            <td>{{ tx.description }}</td>
            <td>{{ formatDate(tx.date) }}</td>
            <td>{{ tx.initiatorRole }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-muted">No transactions found or access denied.</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { getAuthToken } from '@/utils/auth'

const transactionStore = useTransactionStore()
const { transactions, fetchAllTransactionsWithRoles } = transactionStore

onMounted(async () => {
  const token = getAuthToken()
  await fetchAllTransactionsWithRoles(token)
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}
</script>
