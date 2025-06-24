// src/stores/transactionStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { getAuthToken } from "@/utils/auth.js";

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading      = ref(false)
  const error        = ref(null)

  /**
   * Regular customer (and now employee) transfers against /transactions/create
   * @param {{…}} payload
   * @param {string} token
   * @returns {Promise<boolean>}
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
      return true
    } catch (err) {
      error.value = err
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Employee transfer wrapper:
   *  - tags payload.employeeTransfer = true
   *  - re-uses submitTransfer() above
   * @param {{…}} payload
   * @param {string} token
   * @returns {Promise<{success:boolean}>}
   */
  const performEmployeeTransfer = async (payload, token) => {
    // add the flag our backend looks for
    payload.employeeTransfer = true

    // call the existing create‐endpoint
    const success = await submitTransfer(payload, token)
    return { success }
  }

  /**
   * Fetch transactions for one user, applying filters via query params
   */
  const fetchTransactions = async (userId, filter) => {
    const query = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (value != null && value !== "") query.append(key, value)
    })

    loading.value = true
    error.value   = null
    try {
      const resp = await axios.get(
        `http://localhost:8080/transactions/user/${userId}`,
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

  /**
   * Employee‐only: load all txns with initiator role
   */
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
      console.error("[store] fetchAllTransactionsWithRoles ❌", err)
      error.value        = err
      transactions.value = []
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    transactions,
    loading,
    error,
    // actions
    submitTransfer,
    performEmployeeTransfer,
    fetchTransactions,
    fetchAllTransactionsWithRoles
  }
})
