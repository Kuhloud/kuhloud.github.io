<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">Benevolent Bank</RouterLink>
      <div class="navbar-nav ms-auto">
        <template v-if="isLoggedIn">
          <RouterLink class="nav-item nav-link" to="/mockATM" v-if="!isEmployee">ATM</RouterLink>
          <RouterLink class="nav-item nav-link" to="/transfer">Transfer</RouterLink>
          <RouterLink class="nav-item nav-link" to="/users" v-if="isEmployee">Users</RouterLink>
          <RouterLink class="nav-item nav-link" to="/profile" v-if="!isEmployee">Profile</RouterLink>
          <button class="nav-item nav-link btn btn-link" @click="logout">Logout</button>
        </template>
        <template v-else>
          <RouterLink class="nav-item nav-link" to="/login">Login</RouterLink>
          <RouterLink class="nav-item nav-link" to="/signup">Signup</RouterLink>
        </template>
      </div>
    </div>
  </nav>
  <div class="container">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
import { computed } from "vue";
import { userStore } from "@/stores/userStore"; // Adjust the path based on your project structure
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = userStore();
    const router = useRouter();
    store.autologin()
    // Use the reactive isLoggedIn getter from the store
    const isLoggedIn = computed(() => store.isLoggedIn);
    const isEmployee = computed(() => store.isEmployee);

    // Use the logout function from the store
    const logout = () => {
      store.logout(); // Call the store's logout function
      router.replace("/"); // Redirect to the login page after logout
    };

    return {
      isLoggedIn,
      isEmployee,
      logout,
    };
  },
};
</script>
