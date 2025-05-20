<template>
  <div class="transaction-history-container">
    <router-link to="/transfer" class="btn btn-secondary" style="margin-bottom: 20px;">
      ← Back to Transfer
    </router-link>
    <h1>Transaction History</h1>

    <h2>Outgoing Transactions</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>To IBAN</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in outgoingTransactions" :key="tx.id">
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.toAccountIban }}</td>
          <td>{{ tx.amount }}</td>
          <td>{{ tx.description }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Incoming Transactions</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>From IBAN</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in incomingTransactions" :key="tx.id">
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.fromAccountIban }}</td>
          <td>{{ tx.amount }}</td>
          <td>{{ tx.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { useAccountStore } from "@/stores/accountStore";

const transactionStore = useTransactionStore();
const accountStore = useAccountStore();
const userId = localStorage.getItem("user_id");

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

// Outgoing: transactions where the user's IBAN is the sender
const outgoingTransactions = computed(() =>
  transactionStore.transactions.filter(tx => userIbans.value.includes(tx.fromAccountIban))
);

// Incoming: transactions where the user's IBAN is the recipient
const incomingTransactions = computed(() =>
  transactionStore.transactions.filter(tx => userIbans.value.includes(tx.toAccountIban))
);
</script>

<style scoped>
.transaction-history-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
}
th {
  background: #f0f0f0;
}
</style>