import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch accounts from the backend
  const fetchAccounts = async (userId) => {
    loading.value = true
    error.value = null
    try {
      console.log('fetching accounts')
      const response = await axios.get(`http://localhost:8080/accounts/${userId}`, { withCredentials: true })
      console.log('accounts fetched:', response.data)
      accounts.value = response.data
    } catch (err) {
      error.value = err
      accounts.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
  }
})