<template>
  <div class="transaction-history-container">
    <router-link to="/transfer" class="btn btn-secondary mb-3">
      ← Back to Transfer
    </router-link>
    <h1>Transaction History</h1>

    <!-- Filters -->
    <form class="row g-3 mb-4">
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
        <input type="text" v-model="filters.fromIban" class="form-control" placeholder="From IBAN" />
      </div>
      <div class="col-md-2">
        <label class="form-label">To IBAN</label>
        <input type="text" v-model="filters.toIban" class="form-control" placeholder="To IBAN" />
      </div>
      <div class="col-md-3">
        <label class="form-label">Amount</label>
        <div class="input-group">
          <select v-model="filters.amountOperator" class="form-select" style="max-width: 70px;">
            <option value="eq">=</option>
            <option value="lt">&lt;</option>
            <option value="gt">&gt;</option>
          </select>
          <input type="number" v-model.number="filters.amount" class="form-control" placeholder="Amount" />
        </div>
      </div>
      <div class="col-md-1 d-flex align-items-end">
        <button @click.prevent="resetFilters" type="button" class="btn btn-outline-secondary w-100">Reset</button>
      </div>
    </form>

    <h2>Outgoing Transactions</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-light">
        <tr>
          <th>Date</th>
          <th>From IBAN</th>
          <th>To IBAN</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in filteredOutgoing" :key="tx.id">
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.fromAccountIban }}</td>
          <td>{{ tx.toAccountIban }}</td>
          <td>{{ tx.amount }}</td>
          <td>{{ tx.description }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Incoming Transactions</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-light">
        <tr>
          <th>Date</th>
          <th>From IBAN</th>
          <th>To IBAN</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in filteredIncoming" :key="tx.id">
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.fromAccountIban }}</td>
          <td>{{ tx.toAccountIban }}</td>
          <td>{{ tx.amount }}</td>
          <td>{{ tx.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { useAccountStore } from "@/stores/accountStore";

const transactionStore = useTransactionStore();
const accountStore = useAccountStore();
const userId = localStorage.getItem("user_id");

// Filters state
const filters = ref({
  startDate: "",
  endDate: "",
  fromIban: "",
  toIban: "",
  amount: "",
  amountOperator: "eq",
});

const resetFilters = () => {
  filters.value = {
    startDate: "",
    endDate: "",
    fromIban: "",
    toIban: "",
    amount: "",
    amountOperator: "eq",
  };
};

// Fetch accounts and transactions on mount
onMounted(async () => {
  if (userId) {
    await accountStore.fetchAccounts(userId);
    await transactionStore.fetchTransactions(userId);
  }
});

// Get all user's IBANs
const userIbans = computed(() =>
  accountStore.accounts.map(acc => acc.iban)
);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

// Helper to apply all filters
function applyFilters(tx, direction) {
  // Date filter
  if (filters.value.startDate && new Date(tx.date) < new Date(filters.value.startDate)) return false;
  if (filters.value.endDate && new Date(tx.date) > new Date(filters.value.endDate)) return false;
  // From IBAN filter
  if (filters.value.fromIban && !(tx.fromAccountIban?.includes(filters.value.fromIban))) return false;
  // To IBAN filter
  if (filters.value.toIban && !(tx.toAccountIban?.includes(filters.value.toIban))) return false;
  // Amount filter
  if (filters.value.amount !== "" && filters.value.amount !== null) {
    if (filters.value.amountOperator === "eq" && tx.amount != filters.value.amount) return false;
    if (filters.value.amountOperator === "lt" && tx.amount >= filters.value.amount) return false;
    if (filters.value.amountOperator === "gt" && tx.amount <= filters.value.amount) return false;
  }
  // Direction filter (outgoing/incoming)
  if (direction === "out" && !userIbans.value.includes(tx.fromAccountIban)) return false;
  if (direction === "in" && !userIbans.value.includes(tx.toAccountIban)) return false;
  return true;
}

// Outgoing: transactions where the user's IBAN is the sender
const filteredOutgoing = computed(() =>
  transactionStore.transactions.filter(tx => applyFilters(tx, "out"))
);

// Incoming: transactions where the user's IBAN is the recipient
const filteredIncoming = computed(() =>
  transactionStore.transactions.filter(tx => applyFilters(tx, "in"))
);
</script>