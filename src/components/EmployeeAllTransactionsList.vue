<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="$router.push('/employeedashboard')">← Back</button>
      <h2 class="m-0">All Transactions</h2>
    </div>

    <!-- Filters -->
    <div class="card p-4 shadow-sm mb-4">
      <h4 class="mb-3">Transaction Filters</h4>
      <form class="row g-3">
        <div class="col-md-2">
          <label class="form-label">Start Date</label>
          <input type="date" v-model="filters.startDate" class="form-control" />
        </div>
        <div class="col-md-2">
          <label class="form-label">End Date</label>
          <input type="date" v-model="filters.endDate" class="form-control" />
        </div>
        <div class="col-md-2">
          <label class="form-label">From IBAN</label>
          <input type="text" v-model="filters.fromIban" class="form-control" />
        </div>
        <div class="col-md-2">
          <label class="form-label">To IBAN</label>
          <input type="text" v-model="filters.toIban" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Amount</label>
          <div class="input-group">
            <select v-model="filters.amountOperator" class="form-select" style="max-width:70px;">
              <option value="eq">=</option>
              <option value="lt">&lt;</option>
              <option value="gt">&gt;</option>
            </select>
            <input type="number" v-model.number="filters.amount" class="form-control" />
          </div>
        </div>
        <div class="col-md-1 d-flex align-items-end">
          <button @click.prevent="resetFilters" class="btn btn-outline-secondary w-100">Reset</button>
        </div>
      </form>
    </div>

    <!-- All Transactions Table -->
    <div class="card p-4 shadow-sm" v-if="transactions.length">
      <h4 class="mb-3">Transaction History</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>From IBAN</th>
              <th>From Name</th>
              <th>To IBAN</th>
              <th>To Name</th>
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
              <td>{{ tx.fromFirstName }} {{ tx.fromLastName }}</td>
              <td>{{ tx.toIban }}</td>
              <td>{{ tx.toFirstName }} {{ tx.toLastName }}</td>
              <td>€{{ tx.amount.toFixed(2) }}</td>
              <td>{{ tx.description }}</td>
              <td>{{ formatDate(tx.date) }}</td>
              <td>{{ tx.initiatorRole }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-muted text-center mt-4">
      No transactions found or access denied.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs }      from 'pinia'
import { useTransactionStore } from '@/stores/transactionStore'
import { getAuthToken }        from '@/utils/auth'

// Pinia store
const transactionStore = useTransactionStore()
const { transactions } = storeToRefs(transactionStore)
const { fetchDetailedTransactions } = transactionStore

// Filters
const filters = ref({
  startDate: '',
  endDate: '',
  fromIban: '',
  toIban: '',
  amount: '',
  amountOperator: 'eq'
})

// Load data with current filters
const load = async () => {
  await fetchDetailedTransactions(getAuthToken(), { ...filters.value })
}

// Reset filters & reload
const resetFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    fromIban: '',
    toIban: '',
    amount: '',
    amountOperator: 'eq'
  }
  load()
}

// Format date helper
const formatDate = d => new Date(d).toLocaleString()

// Initial load and watch for changes
onMounted(load)
watch(filters, load, { deep: true })
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
