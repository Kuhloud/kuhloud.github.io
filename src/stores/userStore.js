import axios from '../axios-auth'
import { defineStore } from 'pinia'
import {setAuthToken} from "@/utils/auth.js";
import {getAuthToken} from "@/utils/auth.js";

export const userStore = defineStore('store', {
  state: () => ({
    token: '',
    user_id: 0,
    role: '',
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    //getUserId: (state) => state.user_id,
    isEmployee: (state) => state.role === 'ROLE_EMPLOYEE',
  },
  actions: {
    async signup(firstName, lastName, email, password, bsn, phoneNumber) {
      const sanitizedFirstName = firstName.trim().replace(/[^a-zA-Z'-]/g, '')
      const sanitizedLastName = lastName.trim().replace(/[^a-zA-Z'-]/g, '')
      const sanitizedEmail = email.trim().toLowerCase()
      try {
        if (!this.validateInput(sanitizedEmail)) {
          return Promise.reject(new Error("Please enter a valid email address"))
        }
        const res = await axios.post('/users/signup', {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          password: password,
          bsn: bsn,
          phoneNumber: phoneNumber
        })
        await this.setUserData(res.data)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async login(email, password) {
      const sanitizedEmail = email.trim().toLowerCase()
      try {
        if (!this.validateInput(sanitizedEmail)) {
          return Promise.reject(new Error("Please enter a valid email address"))
        }
        const res = await axios.post('/users/login', {
          email: sanitizedEmail,
          password: password
        })
        await this.setUserData(res.data)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async setUserData(response) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user_id', response.id)
      localStorage.setItem('role', response.role)
      this.token = response.token
      this.user_id = response.id
      this.role = response.role
      setAuthToken(response.token)
    },
    async autologin() {
      if (localStorage['token']) {
        try {
          this.token = getAuthToken();
          this.user_id = localStorage.getItem('user_id')
          this.role = localStorage.getItem('role')
        } catch (error) {
          console.error('Error while retrieving data from localStorage:', error)
        }
      }
    },

    validateInput(email) {
      if (email === '') {
        this.errorMessage = 'Please fill in your email address'
        return false
      }
      return true
    },
fetchUnapprovedCustomers(page, limit) {
  const offset = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    axios.get('/users/inactive', {
      params: {
        approved: false,
        offset: offset,
        limit: limit,
      },
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    .then(result => resolve(result.data))
    .catch(error => reject(error.response));
  });
},

approveCustomer(id) {
  const input = this.activationInputs[id];
  if (!input || input.dailyLimit == null || input.absoluteLimit == null) {
    alert("Please enter both daily and absolute limits.");
    return;
  }

  axios.post(`/users/${id}/activateuser`, {
    dailyLimit: input.dailyLimit,
    absoluteLimit: input.absoluteLimit
  }, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    this.fetchUnapprovedCustomers();
    delete this.activationInputs[id]; // 🔧 FIXED: No this.$delete
    alert("User successfully activated.");
  })
  .catch(err => {
    const message = err?.response?.data?.message || err.message || "Unknown error";
    console.error("Activation failed:", message);
    alert("Failed to activate user: " + message);
  });
}


,
    async getUserInfo(user_id) {
      console.log("Current axios defaults:", axios.defaults.headers.common)
      console.log('Authorization header:', getAuthToken())
      try {
        const response = await axios.get(`/users/profile/${user_id}`, {
          headers: {
            Authorization: `Bearer ${this.token}` // ✅ Attach token
          },
          withCredentials: true // ✅ Send cookies (if needed)
        });
        console.log('User info fetched:', response.data);
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user:', error.response || error);
        throw error; // ✅ Throw the full error for debugging
      }
    },
 
getAllUsers(page, limit) {
  const offset = (page - 1) * limit;

  return axios.get('/users', {
    params: { offset, limit },
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    throw error.response;
  });
},
    async getUsersByFirstNameAndLastName(firstName, lastName)
    {
      const params = {};
      if (firstName) params.firstName = firstName;
      if (lastName) params.lastName = lastName;
        return axios.get('/users/search', {
            params,
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => response.data)
        .catch(error => {
            throw error.response;
        });
    },
    logout() {
      this.token = ''
      this.user_id = 0
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('role')
      axios.defaults.headers.common['Authorization'] = ''
    }
  }
})
