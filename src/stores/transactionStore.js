import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { getAuthToken } from "@/utils/auth.js";

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      return true
    } catch (err) {
      error.value = err
      return false
    } finally {
      loading.value = false
    }
  }

  const performEmployeeTransfer = async (payload, token) => {
    loading.value = true
    error.value = null
    try {
      await axios.post("http://localhost:8080/transactions/employee-transfer", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (err) {
      error.value = err
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Fetch all transactions for a user
  const fetchTransactions = async (userId, filter) => {
    // Build URLSearchParams from the filters object, ignoring empty/null values
    const query = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        query.append(key, value);
      }
    });
    loading.value = true
    error.value = null
    //console.log("Current axios defaults:", axios.defaults.headers.common)
    //console.log('Authorization header:', getAuthToken())
    try {
      const response = await axios.get(`http://localhost:8080/transactions/user/${userId}`,
      {
        params: query // Pass filters as query params
      });
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
    performEmployeeTransfer // ✅ Make sure this is here
  }
})
