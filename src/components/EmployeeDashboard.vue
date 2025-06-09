<template>
  <div class="atm-container">
    <div class="atm-header">
      <h2>Employee Transfer</h2>
      <p class="atm-subtitle">
        Employees can transfer between customer checking accounts.
      </p>
    </div>

    <div class="atm-card">
      <div class="form-group">
        <label for="fromIban">From IBAN:</label>
        <input v-model="fromIban" type="text" id="fromIban" class="form-control" placeholder="Enter sender IBAN" />
      </div>

      <div class="form-group">
        <label for="toIban">To IBAN:</label>
        <input v-model="toIban" type="text" id="toIban" class="form-control" placeholder="Enter recipient IBAN" />
      </div>

      <div class="form-group">
        <label for="amount">Amount:</label>
        <input v-model.number="amount" type="number" id="amount" class="form-control" placeholder="Enter amount" />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="description" id="description" class="form-control" placeholder="Enter description"></textarea>
      </div>

      <button class="btn-primary" @click="submitTransfer" :disabled="loading">
        Transfer Funds
      </button>

      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']" style="margin-top: 15px;">
        {{ message }}
      </div>
    </div>

    <div class="atm-info-section">
      <h4>Employee Features</h4>
      <ul>
        <li>Transfer between customer checking accounts</li>
        <li>Only available for employees</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { getAuthToken } from '@/utils/auth.js'

const transactionStore = useTransactionStore()
const userId = parseInt(localStorage.getItem('user_id'))

const fromIban = ref('')
const toIban = ref('')
const amount = ref(null)
const description = ref('')
const message = ref('')
const messageType = ref('success')
const loading = ref(false)

const showMessage = (msg, type = 'danger') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => (message.value = ''), 4000)
}

const submitTransfer = async () => {
  if (!fromIban.value || !toIban.value || !amount.value || !description.value) {
    showMessage('Please fill in all fields.')
    return
  }

  const payload = {
    fromAccountIban: fromIban.value,
    toAccountIban: toIban.value,
    amount: parseFloat(amount.value),
    description: description.value,
    date: new Date().toISOString(),
    userInitiatingTransfer: userId
  }

  loading.value = true
  const token = getAuthToken()
  const success = await transactionStore.performEmployeeTransfer(payload, token)

  if (success) {
    showMessage('Transfer completed successfully.', 'success')
    fromIban.value = ''
    toIban.value = ''
    amount.value = null
    description.value = ''
  } else {
    showMessage('Transfer failed. Please try again.')
  }

  loading.value = false
}
</script>

<style scoped>


.atm-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #f4f7fa;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  color: #223046;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.atm-header {
  text-align: center;
  margin-bottom: 28px;
}

.atm-subtitle {
  color: #5a6b82;
  font-size: 1.08rem;
  margin-top: 0.5rem;
}

.atm-card {
  background: #e6ecf5;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 80, 120, 0.06);
  padding: 24px 20px;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 14px;
}

input,
textarea,
select {
  width: 100%;
  padding: 9px;
  margin-top: 5px;
  border: 1px solid #bfc9d9;
  border-radius: 4px;
  background: #f8fafc;
}

.btn-primary {
  background: #2b6cb0;
  color: #fff;
  padding: 10px 22px;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
}

.btn-primary:hover {
  background: #234e7d;
}

.alert {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.atm-info-section {
  background: #f0f4fa;
  border-radius: 10px;
  padding: 20px 16px;
  margin-top: 10px;
}

.atm-info-section h4 {
  color: #385170;
  margin-bottom: 10px;
}

.atm-info-section ul {
  color: #42516d;
  margin-bottom: 10px;
  padding-left: 20px;
}
</style>
