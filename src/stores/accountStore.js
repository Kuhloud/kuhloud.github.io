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
      const response = await axios.get(`http://localhost:8080/accounts/${userId}`)
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