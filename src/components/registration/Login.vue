<template>
  <section>
    <section class="container">
      <section class="row">
        <section class="col-md-6">
          <form>
            <section v-if="errorMessage != ''" class="alert alert-danger">
              {{ errorMessage }}
            </section>
            <section class="mb-3">
              <label for="inputEmail" class="form-label">Email Address</label>
              <input id="inputEmail" type="text" v-model="email" class="form-control" required/>
              <small class="form-text text-danger">Required</small>
            </section>
            <section class="mb-3">
              <label for="inputPassword" class="form-label">Password</label>
              <input type="password" v-model="password" class="form-control" id="inputPassword" required/>
              <small class="form-text text-danger">Required</small>
            </section>
            <button type="button" class="btn btn-primary" @click="login">Login</button>
          </form>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
import { userStore } from '@/stores/userStore.js'

export default {
  name: 'LoginComponent',
  setup() {
    const store = userStore()
    return { store }
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      await this.store
        .login(this.email, this.password)
        .then(() => {
          //console.log('Token after login:', this.store.token)
          this.$router.replace('/')
        })
        .catch(() => (this.errorMessage = "Email or password is incorrect. Please try again."))
    }
  }
}
</script>

<style></style>
