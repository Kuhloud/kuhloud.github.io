import axios from '../axios-auth'
import { defineStore } from 'pinia'

export const userStore = defineStore('store', {
  state: () => ({
    token: '',
    user_id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    username: ''
  }),
  getters: {
    isLoggedIn: (state) => state.user_id != '',
    getUserId: (state) => state.user_id,
    // getRole: (state) => state.role,
    isEmployee: (state) => state.role == 'RULE_EMPLOYEE',
  },
  actions: {
    async signup(firstName, lastName, email, password, bsn) {
      const sanitizedFirstName = firstName.trim().replace(/[^a-zA-Z'-]/g, '')
      const sanitizedLastName = lastName.trim().replace(/[^a-zA-Z'-]/g, '')
      const sanitizedEmail = email.trim().toLowerCase()
      try {
        const res = await axios.post('/users/signup', {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          password: password,
          bsn: bsn
        })
        console.log('Response from signup:', res.data)
        await this.setUserData(res.data)
        // await this.getUserRole()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async login(email, password) {
      const sanitizedEmail = email.trim().toLowerCase()
      try {
        const res = await axios.post('/users/login', {
          email: sanitizedEmail,
          password: password
        })
        await this.setUserData(res.data)
        // await this.getUserRole()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // async getUserRole() {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get(`/userrole/${this.user_id}`)
    //       .then((res) => {
    //         localStorage.setItem('role', res.data)
    //         this.role = res.data
    //         resolve()
    //       })
    //       .catch((error) => reject(error))
    //   })
    // },
    async setUserData(response) {
      //localStorage.setItem('token', response.token)
      localStorage.setItem('user_id', response.id)
      localStorage.setItem('firstName', response.firstName)
      localStorage.setItem('lastName', response.lastName)
      localStorage.setItem('email', response.email)
      localStorage.setItem('phoneNumber', response.phoneNumber)
      localStorage.setItem('role', response.role)
      this.token = response.token
      this.user_id = response.user_id
      this.firstName = response.firstName
      this.lastName = response.lastName
      this.email = response.email
      this.phoneNumber = response.phoneNumber
      this.role = response.role
      this.username = response.username
    },
    autologin() {
      if (localStorage['token']) {
        try {
          this.token = localStorage.getItem('token')
          this.user_id = localStorage.getItem('user_id')
          this.username = localStorage.getItem('username')
          this.role = localStorage.getItem('role')
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        } catch (error) {
          console.error('Error while retrieving data from localStorage:', error)
        }
      }
    },
    validateInput(email) {
      if (email != '') {
        this.errorMessage = 'Please fill in your email address'
        return false
      }
      return true
    },
    logout() {
      this.token = ''
      this.user_id = 0
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phoneNumber = ''
      this.role = ''
      this.username = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('firstName')
      localStorage.removeItem('lastName')
      localStorage.removeItem('email')
      localStorage.removeItem('phoneNumber')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      axios.defaults.headers.common['Authorization'] = ''
    }
  }
})
