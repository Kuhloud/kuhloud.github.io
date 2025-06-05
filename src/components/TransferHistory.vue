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

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router"; // Add this import
import { useTransactionStore } from "@/stores/transactionStore";
import { useAccountStore } from "@/stores/accountStore";

export default {
  setup() {
    const router = useRouter(); // Initialize router
    const transactionStore = useTransactionStore();
    const accountStore = useAccountStore();
    const userId = localStorage.getItem("user_id");

    const filters = ref({
      startDate: "",
      endDate: "",
      fromIban: "",
      toIban: "",
      amount: "",
      amountOperator: "eq",
    });

    // Redirect to login if not logged in
    onMounted(async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      if (userId) {
        await accountStore.fetchAccounts(userId);
        await transactionStore.fetchTransactions(userId, filters.value);
      }
    });

    // Add computed properties for transactions
    const filteredOutgoing = computed(() => {
      return transactionStore.transactions.filter(tx =>
          accountStore.accounts.some(acc => acc.iban === tx.fromAccountIban)
      );
    });

    const filteredIncoming = computed(() => {
      return transactionStore.transactions.filter(tx =>
          accountStore.accounts.some(acc => acc.iban === tx.toAccountIban)
      );
    });

    // Add formatDate function
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString();
    };

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

    onMounted(async () => {
      if (userId) {
        console.log('fetching user info')
        await accountStore.fetchAccounts(userId);
        await transactionStore.fetchTransactions(userId, filters.value);
        console.log('transactions fetched:', transactionStore.transactions);
      }
    });

    watch(filters, async () => {
      if (userId) {
        await transactionStore.fetchTransactions(userId, filters.value);
      }
    }, { deep: true });

    return {
      filters,
      resetFilters,
      filteredOutgoing, // Expose to template
      filteredIncoming, // Expose to template
      formatDate // Expose to template
    };
  }
}
</script>