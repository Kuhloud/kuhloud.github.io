<template>
    <section>
      <section class="container">
        <section class="row">
          <section class="col-md-6">
            <form>
              <section v-if="errorMessage != ''" class="alert alert-danger">
                {{ errorMessage }}
              </section>
<!--              <section class="mb-3">-->
<!--                <label for="inputUsername" class="form-label">Username</label>-->
<!--                <input id="inputUsername" type="text" v-model="username" class="form-control" required/>-->
<!--                <small class="form-text text-danger">Required</small>-->
<!--              </section>-->
              <section class="mb-3">
                <label for="inputFirstName" class="form-label">First Name</label>
                <input id="inputFirstName" type="text" v-model="firstName" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <section class="mb-3">
                <label for="inputLastName" class="form-label">Last Name</label>
                <input id="inputLastName" type="text" v-model="lastName" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <section class="mb-3">
                <label for="inputEmail" class="form-label">Email Address</label>
                <input id="inputEmail" type="text" v-model="email" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <section class="mb-3">
                <label for="inputPassword" class="form-label">Password</label>
                <input id="inputPassword" type="password" v-model="password" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <section class="mb-3">
                <label for="ConfirmPassword" class="form-label">Confirm Password</label>
                <input id="ConfirmPassword" type="password" v-model="confirmPassword" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <section class="mb-3">
                <label for="inputBsn" class="form-label">BSN</label>
                <input id="inputBsn" type="text" v-model="bsn" class="form-control" required/>
                <small class="form-text text-danger">Required</small>
              </section>
              <button type="button" class="btn btn-primary" @click="signup">Signup</button>
            </form>
          </section>
        </section>
      </section>
    </section>
  </template>
  
  <script>
  import { userStore } from '@/stores/userStore.js'
  
  export default {
    name: 'SignupComponent',
    setup() {
      const store = userStore()
      return { store }
    },
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        bsn: '',
        errorMessage: ''
      }
    },
    methods: {
      validatePassword() {
        if (this.confirmPassword !== this.password) {
          throw new Error("Passwords do not match");
        }
      },
      bsnIsAllNumeric(bsn) {
        return /^\d+$/.test(bsn);
      },
     async signup() {
        this.validatePassword()
        this.bsnIsAllNumeric(this.bsn)
        await this.store
          .signup(this.firstName, this.lastName, this.email, this.password, this.bsn)
          .then(() => {
            this.$router.replace('/')
          })
          .catch(() => (this.errorMessage = "Could not create an user account. Please try again."))
      }
    }
  }
  </script>
  
  <style></style>
  