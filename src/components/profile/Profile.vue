<template>
  <section class="container">
    <section class="row">
      <section class="col-12" v-if="user">
        <h1 class="text-center">Profile</h1>
        <p class="text-center">Name: {{ user.firstName }} {{ user.lastName }}</p>
        <p class="text-center">E-mail Address: {{ user.email }}</p>
        <p class="text-center">Bsn: {{ user.bsn }}</p>
        <p class="text-center">Phone Number: {{ user.phoneNumber }}</p>
      </section>
      <p v-else>No user found.</p>
    </section>
    <section class="row">
      <section class="col-12">
        <h2>Accounts</h2>
        <ul v-if="accounts.length > 0">
          <li v-for="account in accounts" :key="account.id">
            <section class="card">
              <h4>{{ account.name }}</h4>
              <span class="text-muted">(${{ account.balance }})</span>
              <p>{{ account.iban }}</p>
            </section>
          </li>
          <li>
            <section class="card">
              <h4>Total</h4>
              <span class="text-muted">(${{ accounts[0].balance + accounts[1].balance }})</span>
            </section>
          </li>
        </ul>
        <p v-else>No accounts found.</p>
      </section>
    </section>

  </section>
</template>
<!--<script setup lang="js">-->
<script>
import {useAccountStore} from "@/stores/accountStore.js";
import {computed, onMounted} from "vue";
import {userStore} from "@/stores/userStore.js";
import axios from "axios";

export default {
  setup() {
    const uStore = userStore();
    const user = computed(() => uStore.user);
    const accounts = computed(() => user.value?.accounts || []);
    const user_id = localStorage.getItem("user_id");
    onMounted(
        async () => {
          try {
            console.log('fetching user info')
            // await accountStore.fetchAccounts(user_id);
            await uStore.getUserInfo(user_id);
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
    )
    return { user, accounts };
  },
  methods: {
    useAccountStore,
    userStore,
  },
};

</script>

<style scoped>

</style>