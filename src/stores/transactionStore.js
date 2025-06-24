// src/stores/transactionStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { getAuthToken } from "@/utils/auth.js"

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading      = ref(false)
  const error        = ref(null)

  /**
   * Handles both customer & employee transfers via /transactions/create
   * Always returns { success: boolean, message?: string }
   */
  const submitTransfer = async (payload, token) => {
    loading.value = true
    error.value   = null

    try {
      await axios.post(
        "http://localhost:8080/transactions/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return { success: true }
    } catch (err) {
      let backendMessage = 'Transfer failed due to an unknown error.'

      if (err.response?.data) {
        backendMessage = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || err.response.data.error || backendMessage
      }

      error.value = err
      return { success: false, message: backendMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Employee transfer wrapper — sets the flag and forwards the full result
   */
  const performEmployeeTransfer = async (payload, token) => {
    payload.employeeTransfer = true
    return await submitTransfer(payload, token)
  }

  const fetchTransactions = async (filter) => {
    const query = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (value != null && value !== "") query.append(key, value)
    })

    loading.value = true
    error.value   = null
    try {
      const resp = await axios.get(
        `http://localhost:8080/transactions/history`,
        { params: query }
      )
      transactions.value = resp.data
    } catch (err) {
      error.value        = err
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchAllTransactionsWithRoles = async (token) => {
    loading.value = true
    error.value   = null
    try {
      const resp = await axios.get(
        "http://localhost:8080/transactions/employee-alltransactions",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      transactions.value = resp.data
      return true
    } catch (err) {
      error.value        = err
      transactions.value = []
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    submitTransfer,
    performEmployeeTransfer,
    fetchTransactions,
    fetchAllTransactionsWithRoles
  }
})
