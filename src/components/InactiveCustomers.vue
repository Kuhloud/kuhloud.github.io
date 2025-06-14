<template>
  <section class="py-4">
    <div class="container">
      <!-- Back button -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-danger" @click="$router.push('/employeedashboard')">← Back</button>
      </div>

      <h2 class="mb-4">Unapproved Customers</h2>

      <!-- Page limit input -->
      <div class="mb-3 row align-items-center">
        <label for="limit" class="col-sm-2 col-form-label">Page Limit</label>
        <div class="col-sm-2">
          <input
            type="number"
            id="limit"
            v-model="pageLimit"
            @change="fetchUnapprovedCustomers"
            min="1"
            class="form-control"
          />
        </div>
      </div>

      <!-- Unapproved user table -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th class="text-center">Daily Limit</th>
              <th class="text-center">Absolute Limit</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.role }}</td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model.number="activationInputs[user.id].dailyLimit"
                  placeholder="Daily limit"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model.number="activationInputs[user.id].absoluteLimit"
                  placeholder="Absolute limit"
                />
              </td>
              <td class="text-center">
                <button @click="approveCustomer(user.id)" class="btn btn-sm btn-outline-success">
                  Approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4">
        <vue-awesome-paginate
          :items-per-page="pageLimit"
          :max-pages-shown="5"
          v-model="currentPage"
          :on-click="fetchUnapprovedCustomers"
        />
      </div>
    </div>
  </section>
</template>

<script>
import axios from '@/axios-auth';
import { getAuthToken } from '@/utils/auth';
import { useToast } from 'vue-toastification';

export default {
  name: "InactiveCustomerList",
  data() {
    return {
      users: [],
      currentPage: 1,
      pageLimit: 10,
      activationInputs: {}, // Stores user ID → daily/absolute limit values
      toast: useToast()
    };
  },
  mounted() {
    this.fetchUnapprovedCustomers();
  },
  methods: {
    // Fetch paginated list of unapproved users
    fetchUnapprovedCustomers() {
      const offset = (this.currentPage - 1) * this.pageLimit;

      axios.get('/users/inactive', {
        params: {
          approved: false,
          offset,
          limit: this.pageLimit
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      })
      .then(res => {
        this.users = res.data;

        // Initialize default input values for activation form
        this.activationInputs = {};
        res.data.forEach(user => {
          this.activationInputs[user.id] = {
            dailyLimit: 1000,
            absoluteLimit: 500
          };
        });
      })
      .catch(err => console.error("Failed to fetch users", err));
    },

    // Approve and activate a user with limits
    approveCustomer(id) {
      const input = this.activationInputs[id];

      // Basic input validation
      if (!input || input.dailyLimit == null || input.absoluteLimit == null) {
        this.toast.error("Please enter both daily and absolute limits.");
        return;
      }

      if (input.dailyLimit < 0 || input.absoluteLimit < 0) {
        this.toast.error("Limits must be zero or positive numbers.");
        return;
      }

      // Send activation request
      axios.post(`/users/${id}/activateuser`, {
        dailyLimit: input.dailyLimit,
        absoluteLimit: input.absoluteLimit
      }, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        this.fetchUnapprovedCustomers(); // Refresh table
        delete this.activationInputs[id]; // Clear input state
        this.toast.success("User successfully activated.");
      })
      .catch(err => {
        const message = err?.response?.data?.message || err?.message || "Unknown error";
        console.error("Activation failed:", message, err);
        this.toast.error("Failed to activate user: " + message);
      });
    }
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
