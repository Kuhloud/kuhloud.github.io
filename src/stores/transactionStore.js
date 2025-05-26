import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const submitTransfer = async (payload, token) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(
        "http://localhost:8080/transactions/create",
        payload,
      )
      return true
    } catch (err) {
      error.value = err
      return false
    } finally {
      loading.value = false
    }
  }

  // Fetch all transactions for a user
  const fetchTransactions = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`http://localhost:8080/transactions/user/${userId}`)
      transactions.value = response.data
    } catch (err) {
      error.value = err
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    submitTransfer,
    fetchTransactions,
  }
})