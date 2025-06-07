<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="$router.back()">← Back</button>
      <h2 class="m-0">User Details</h2>
    </div>

    <!-- ✅ Alleen tonen als 'user' geladen is -->
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

    <!-- Transacties, ook pas tonen als geladen -->
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
            <tr v-for="tx in transactions" :key="tx.id">
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
  </div>

  <!-- ✅ Editable Limits -->
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
</template>

<script>
import axios from '@/axios-auth';
import { getAuthToken } from "@/utils/auth";

export default {
  data() {
    return {
      user: null,
      transactions: [],
      editDailyLimit: 0,
      editAbsoluteLimit: 0,
      checkingAccountId: null
    };
  },
  mounted() {
    this.loadUser();
    this.loadTransactions();
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

        console.log("User loaded:", this.user);
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
      })
        .then(res => (this.transactions = res.data))
        .catch(err => console.error("Failed to load transactions", err));
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    updateLimits() {
      const userId = this.user.id;
      const token = getAuthToken();

      // ✅ 1. Update Daily Limit
      axios.patch(`/users/${userId}/dailyLimit`, {
        dailyLimit: this.editDailyLimit
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        console.log('Daily limit updated');
      })
      .catch(err => {
        console.error('Failed to update daily limit:', err);
      });

      // ✅ 2. Update Absolute Limit (on account)
      if (this.checkingAccountId !== null) {
        axios.patch(`/accounts/${this.checkingAccountId}/absoluteLimit`, {
          absoluteLimit: this.editAbsoluteLimit
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          console.log('Absolute limit updated');
        })
        .catch(err => {
          console.error('Failed to update absolute limit:', err);
        });
      }
    }
  },
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
