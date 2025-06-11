<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="$router.back()">← Back</button>
      <h2 class="m-0">User Details</h2>
    </div>

    <div v-if="user" class="card p-4 mb-4 shadow-sm">
      <h4 class="mb-3">Personal Information</h4>
      <div class="row">
        <div class="col-md-6 mb-2"><strong>ID:</strong> {{ user.id }}</div>
        <div class="col-md-6 mb-2"><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</div>
        <div class="col-md-6 mb-2"><strong>Email:</strong> {{ user.email }}</div>
        <div class="col-md-6 mb-2"><strong>Phone:</strong> {{ user.phoneNumber }}</div>
        <div class="col-md-6 mb-2"><strong>BSN:</strong> {{ user.bsn }}</div>
        <div class="col-md-6 mb-2"><strong>Role:</strong> {{ user.role }}</div>
      </div>
    </div>

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
            <select v-model="filters.amountOperator" class="form-select" style="max-width: 70px;">
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

    <div class="card p-4 shadow-sm">
      <h4 class="mb-3">Transaction History</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
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
          <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td>{{ formatDate(tx.date) }}</td>
              <td>{{ tx.fromAccountIban }}</td>
              <td>{{ tx.toAccountIban }}</td>
              <td>{{ tx.amount }}</td>
              <td>{{ tx.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="user" class="card p-4 mb-4 shadow-sm">
      <h4 class="mb-3">Limits</h4>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="dailyLimit" class="form-label">Daily Limit</label>
          <input type="number" id="dailyLimit" v-model="editDailyLimit" class="form-control" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="absoluteLimit" class="form-label">Absolute Limit (CHECKING)</label>
          <input type="number" id="absoluteLimit" v-model="editAbsoluteLimit" class="form-control" />
        </div>
      </div>
      <button @click="updateLimits" class="btn btn-success">Save Limits</button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios-auth';
import { getAuthToken } from "@/utils/auth";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      user: null,
      allTransactions: [],       // all fetched transactions
      filteredTransactions: [],  // only transactions for this user
      userIbans: [],             // user's own IBANs
      editDailyLimit: 0,
      editAbsoluteLimit: 0,
      checkingAccountId: null,
      filters: {
        startDate: "",
        endDate: "",
        fromIban: "",
        toIban: "",
        amount: "",
        amountOperator: "eq"
      }
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const id = this.$route.params.id;
      axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      })
      .then(res => {
        this.user = res.data;
        this.editDailyLimit = res.data.dailyLimit;

        const checking = res.data.accounts.find(acc => acc.accountType === 'CHECKING');
        if (checking) {
          this.editAbsoluteLimit = checking.absoluteLimit;
          this.checkingAccountId = checking.id;
        }

        // Store user's IBANs
        this.userIbans = res.data.accounts.map(acc => acc.iban);

        // Now load transactions
        this.loadTransactions();
      })
      .catch(err => {
        console.error("Failed to load user", err);
        this.user = null;
      });
    },
    loadTransactions() {
      const id = this.$route.params.id;
      axios.get(`/transactions/user/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        params: this.filters
      })
        .then(res => {
          this.allTransactions = res.data;
          this.filterToUserTransactions();
        })
        .catch(err => console.error("Failed to load transactions", err));
    },
   filterToUserTransactions() {
  console.log("User IBANs:", this.userIbans);
  console.log("All transactions:", this.allTransactions);

  this.filteredTransactions = this.allTransactions.filter(tx =>
    this.userIbans.includes(tx.fromAccountIban) || this.userIbans.includes(tx.toAccountIban)
  );

  console.log("Filtered transactions:", this.filteredTransactions);
},
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    resetFilters() {
      this.filters = {
        startDate: "",
        endDate: "",
        fromIban: "",
        toIban: "",
        amount: "",
        amountOperator: "eq"
      };
      this.loadTransactions();
    },
    updateLimits() {
      const toast = useToast();
      const userId = this.user.id;
      const token = getAuthToken();

      axios.patch(`/users/${userId}/dailyLimit`, {
        dailyLimit: this.editDailyLimit
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => toast.success("Daily limit updated"))
      .catch(err => {
        toast.error("Failed to update daily limit");
        console.error(err);
      });

      if (this.checkingAccountId !== null) {
        axios.patch(`/accounts/${this.checkingAccountId}/absoluteLimit`, {
          absoluteLimit: this.editAbsoluteLimit
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => toast.success("Absolute limit updated"))
        .catch(err => {
          toast.error("Failed to update absolute limit");
          console.error(err);
        });
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.loadTransactions();
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background-color: #fff;
}
.table th, .table td {
  vertical-align: middle;
}
</style>
