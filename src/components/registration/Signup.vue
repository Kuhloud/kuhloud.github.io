<template>
  <section class="signup-bg">
    <div class="signup-container">
      <h2 class="signup-title">Create your account</h2>
      <form class="signup-form" @submit.prevent="signup">
        <div v-if="errorMessage" class="alert alert-danger signup-alert">
          {{ errorMessage }}
        </div>
        <div class="mb-3">
          <label for="inputFirstName" class="form-label">First Name</label>
          <input id="inputFirstName" type="text" v-model="firstName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="inputLastName" class="form-label">Last Name</label>
          <input id="inputLastName" type="text" v-model="lastName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="inputEmail" class="form-label">Email Address</label>
          <input id="inputEmail" type="text" v-model="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input id="inputPassword" type="password" v-model="password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="ConfirmPassword" class="form-label">Confirm Password</label>
          <input id="ConfirmPassword" type="password" v-model="confirmPassword" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="inputBsn" class="form-label">BSN</label>
          <input id="inputBsn" type="text" v-model="bsn" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="inputPhone" class="form-label">Phone Number</label>
          <input id="inputPhone" type="text" v-model="phoneNumber" class="form-control" required />
        </div>
        <button type="submit" class="btn-primary signup-btn">Signup</button>
      </form>
      <p class="signup-footer-note">
        Join Benevolent Bank and experience secure, modern banking.
      </p>
    </div>
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
      phoneNumber: '',
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
    phoneNumberIsFormattedCorrectly(phoneNumber) {
      return /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    },
    async signup() {
      try {
        this.validatePassword()
        this.bsnIsAllNumeric(this.bsn)
        this.phoneNumberIsFormattedCorrectly(this.phoneNumber)
        await this.store
          .signup(this.firstName, this.lastName, this.email, this.password, this.bsn, this.phoneNumber)
        this.$router.replace('/')
      } catch (e) {
        this.errorMessage = "Could not create an user account. Please try again. " + e.message
      }
    }
  }
}
</script>

<style scoped>
.signup-bg {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-container {
  background: #e6ecf5;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  padding: 40px 32px 32px 32px;
  max-width: 440px;
  width: 100%;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-title {
  color: #2a4365;
  font-size: 2rem;
  margin-bottom: 24px;
  font-weight: 700;
  text-align: center;
}

.signup-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mb-3 {
  margin-bottom: 18px;
}

.form-label {
  color: #385170;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cfd8e3;
  background: #f9fbfd;
  color: #223046;
  font-size: 1rem;
  transition: border 0.2s;
}

.form-control:focus {
  border-color: #2b6cb0;
  outline: none;
  background: #fff;
}

.btn-primary.signup-btn {
  background: #2b6cb0;
  color: #fff;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.btn-primary.signup-btn:hover {
  background: #234e7d;
}

.signup-alert {
  width: 100%;
  margin-bottom: 16px;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 1rem;
}

.signup-footer-note {
  color: #7b8ba3;
  font-size: 0.98rem;
  margin-top: 18px;
  text-align: center;
}
</style>
