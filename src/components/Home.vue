<template>
  <div>
    <h1>Welcome to the Benevolent Bank.</h1>
    <h2 v-if="firstName">Hello, {{ firstName }}!</h2>
    <h2 v-else>I need a medic bag.</h2>
  </div>
</template>

<script>
import { computed } from "vue";
import { userStore } from "@/stores/userStore"; // Ensure the correct path to your store

export default {
  setup() {
    const store = userStore();

    // Access the firstName from the store
    const firstName = computed(() => store.firstName);

    return {
      firstName,
    };
  },
};
</script>

<style lang="css" scoped></style>
