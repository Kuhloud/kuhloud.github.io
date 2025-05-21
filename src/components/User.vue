<template>
<section>
  <div class="container">
    <button class="btn btn-danger " @click="this.$router.push('/')">Back</button>

    <div class="row">
      <div class="col-md-12">
        <h1>Unapproved User List</h1>
        <div>
          <label for="limit" class="form-group">Page limit</label>
          <input type="number" id="limit" v-model="pageLimit" @change="getAllUnapprovedUsers" min="1" class="form-control inputField">
        </div>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.firstName + " " + user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="approveUser(user.id)" class="btn btn-success btn-sm">Approve</button>
              </td>
            </tr>
          </tbody>
        </table>
        <vue-awesome-paginate
            :items-per-page="this.pageLimit"
            :max-pages-shown="5"
            v-model="currentPage"
            :on-click="getAllUnapprovedUsers"
        />
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { userStore } from "@/stores/userStore";


export default {
  name: "UnapprovedCustomerList",
  setup() {
    const uStore = userStore();
    return { uStore };
  },
  data() {
    return {
      users: [],
      currentPage: 1,
      pageLimit: 10,
    }
  },
  mounted() {
    this.getAllUnapprovedUsers();
  },
  methods: {
    getAllUnapprovedUsers() {
      this.uStore.getAllUnapprovedUsers(this.currentPage, this.pageLimit)
          .then((result) => {
            this.users = result;
          });
          console.log(this.users);
    },
    approveUser(id) {
      this.uStore.approveUser(id)
          .then(() => {
            this.getAllUnapprovedUsers();
          });
    }
  }
}
</script>

<style>
.user-pagination-container {
  display: flex;
  column-gap: 10px;
}
.user-paginate-btn {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.user-paginate-btn:hover {
  background-color: #d8d8d8;
}
.user-active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}
.user-active-page:hover {
  background-color: #2988c8;
}
</style>