<template>
  <section class="py-4">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-danger" @click="$router.push('/employeedashboard')">← Back</button>
       
      </div>

      <h2 class="mb-4">Customer Overview</h2>

      <div class="mb-3 row align-items-center">
        <label for="limit" class="col-sm-2 col-form-label">Page Limit</label>
        <div class="col-sm-2">
          <input
            type="number"
            id="limit"
            v-model="pageLimit"
            @change="getAllUsers"
            min="1"
            class="form-control"
          />
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>BSN</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Approved</th>
              <th class="text-center">Account Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.bsn }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>
                <span
                  :class="['badge', user.active ? 'bg-success' : 'bg-secondary']"
                >
                  {{ user.active ? 'Approved' : 'Not Approved yet' }}
                </span>
              </td>
              <td class="text-center">
                <button @click="goToUserDetails(user.id)" class="btn btn-sm btn-outline-success">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <vue-awesome-paginate
          :items-per-page="pageLimit"
          :max-pages-shown="5"
          v-model="currentPage"
          :on-click="getAllUsers"
        />
      </div>
    </div>
  </section>
</template>


<script>
import { userStore } from "@/stores/userStore";

export default {
  name: "users",
  data() {
    return {
      users: [],
      currentPage: 1,
      pageLimit: 10,
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    getAllUsers() {
      const store = userStore();
      store
        .getAllUsers(this.currentPage, this.pageLimit)
        .then((result) => {
          this.users = result;
        })
        .catch((err) => {
          console.error("Failed to load users:", err);
        });
    },
    goToUserDetails(id) {
      this.$router.push(`/users/userdetails/${id}`);
    },
  },
};
</script>