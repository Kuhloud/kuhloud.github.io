<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">Benevolent Bank</RouterLink>
      <div class="navbar-nav ms-auto">
        <RouterLink class="nav-item nav-link" to="/auth"
          >Login/Register</RouterLink
        >
        <RouterLink class="nav-item nav-link" to="/profile">Profile</RouterLink>
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
export default {
  setup() {
  },
};
</script>
