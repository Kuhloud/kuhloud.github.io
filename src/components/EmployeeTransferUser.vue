<template>
  <div class="atm-container">
    <!-- Top navigation bar with back button -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="$router.push('/employeedashboard')">← Back</button>
    </div>

    <!-- Header -->
    <div class="atm-header">
      <h2>Employee Transfer</h2>
      <p class="atm-subtitle">
        Employees can transfer between customer checking accounts.
      </p>
    </div>

    <!-- Transfer form -->
    <div class="atm-card">

      <!-- From IBAN Picker -->
      <div class="form-group position-relative">
        <label for="fromIban">From IBAN:</label>
        <div class="d-flex">
          <input
            v-model="fromIban"
            type="text"
            id="fromIban"
            class="form-control"
            readonly
            placeholder="Select sender IBAN"
          />
          <!-- Clear button for fromIban -->
          <button
            v-if="fromIban"
            class="btn btn-outline-danger clear-btn"
            @click="clearField('from')"
          >&times;</button>
          <!-- Open picker modal -->
          <button class="btn btn-outline-secondary ms-2" @click="openPicker('from')">
            Pick
          </button>
        </div>
      </div>

      <!-- To IBAN Picker -->
      <div class="form-group position-relative">
        <label for="toIban">To IBAN:</label>
        <div class="d-flex">
          <input
            v-model="toIban"
            type="text"
            id="toIban"
            class="form-control"
            readonly
            placeholder="Select recipient IBAN"
          />
          <!-- Clear button for toIban -->
          <button
            v-if="toIban"
            class="btn btn-outline-danger clear-btn"
            @click="clearField('to')"
          >&times;</button>
          <!-- Open picker modal -->
          <button class="btn btn-outline-secondary ms-2" @click="openPicker('to')">
            Pick
          </button>
        </div>
      </div>

      <!-- Amount and description inputs -->
      <div class="form-group">
        <label for="amount">Amount:</label>
        <input
          v-model.number="amount"
          type="number"
          id="amount"
          class="form-control"
          placeholder="Enter amount"
        />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          v-model="description"
          id="description"
          class="form-control"
          placeholder="Enter description"
        ></textarea>
      </div>

      <!-- Submit button and result message -->
      <button class="btn-primary w-100" @click="submitTransfer" :disabled="loading">
        Transfer Funds
      </button>
      <div
        v-if="message"
        :class="['alert mt-3', messageType==='success'?'alert-success':'alert-danger']"
        role="alert"
      >
        {{ message }}
      </div>
    </div>

    <!-- Feature explanation -->
    <div class="atm-info-section">
      <h4>Employee Features</h4>
      <ul>
        <li>Transfer between customer checking accounts</li>
        <li>Only available for employees</li>
      </ul>
    </div>

    <!-- IBAN Picker Modal -->
    <div v-if="showPicker" class="modal-backdrop" @click.self="closePicker">
      <div class="modal-content">
        <h5>Search Customer</h5>
        <!-- First name filter -->
        <div class="form-group mb-2">
          <input
            v-model="firstName"
            @input="searchUsers"
            class="form-control"
            placeholder="First name"
          />
        </div>
        <!-- Last name filter -->
        <div class="form-group mb-3">
          <input
            v-model="lastName"
            @input="searchUsers"
            class="form-control"
            placeholder="Last name"
          />
        </div>

        <!-- Results Table -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr><th>Name</th><th>IBAN</th></tr>
            </thead>
            <tbody>
              <tr
                v-for="u in users"
                :key="u.id + (u.maskedIban || u.iban)"
                @click="selectIban(u)"
                style="cursor:pointer;"
              >
                <td>{{ u.firstName }} {{ u.lastName }}</td>
                <td>{{ u.maskedIban ?? u.iban }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Close button -->
        <button class="btn btn-secondary mt-2 w-100" @click="closePicker">Close</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useTransactionStore } from '@/stores/transactionStore'
import { userStore } from '@/stores/userStore.js'
import { getAuthToken } from '@/utils/auth.js'

// Toast for success/failure messages
const toast = useToast()

// Pinia stores
const transactionStore = useTransactionStore()
const store = userStore()

// Local state
const userId = parseInt(localStorage.getItem('user_id'))
const fromIban = ref('')
const toIban = ref('')
const amount = ref(null)
const description = ref('')
const loading = ref(false)

// Modal state for customer picker
const showPicker = ref(false)
const pickerTarget = ref('')
const firstName = ref('')
const lastName = ref('')
const users = ref([])

// Open the customer picker (for 'from' or 'to' IBAN)
function openPicker(target) {
  pickerTarget.value = target
  showPicker.value = true
  firstName.value = ''
  lastName.value = ''
  users.value = []
}

// Close picker modal
function closePicker() {
  showPicker.value = false
}

// Search users by name
async function searchUsers() {
  if (!firstName.value && !lastName.value) {
    users.value = []
    return
  }
  try {
    users.value = await store.getUsersByFirstNameAndLastName(
      firstName.value,
      lastName.value
    )
  } catch (err) {
    console.error('Search failed', err)
    toast.error('Failed to search users.')
  }
}

// Set selected IBAN from modal
function selectIban(u) {
  const iban = u.maskedIban ?? u.iban
  if (pickerTarget.value === 'from') fromIban.value = iban
  else toIban.value = iban
  closePicker()
}

// Clear an input field
function clearField(which) {
  if (which === 'from') fromIban.value = ''
  else toIban.value = ''
}

// Submit transfer
async function submitTransfer() {
  // Validate input fields
  if (!fromIban.value || !toIban.value || !amount.value || !description.value) {
    toast.warning('Please fill in all fields.')
    return
  }

  loading.value = true

  const payload = {
    fromAccountIban: fromIban.value,
    toAccountIban: toIban.value,
    amount: parseFloat(amount.value),
    description: description.value,
    date: new Date().toISOString(),
    userInitiatingTransfer: userId
  }

  console.log('[UI] sending payload:', payload)

  const token = getAuthToken()
  const result = await transactionStore.performEmployeeTransfer(payload, token)

  if (result.success) {
    toast.success('Transfer completed!')
    // Reset form
    fromIban.value = ''
    toIban.value = ''
    amount.value = null
    description.value = ''
  } else {
    toast.error(result.message || 'Transfer failed, try again.')
  }

  loading.value = false
}
</script>



<style scoped>
.atm-container {max-width:500px;margin:40px auto;padding:32px 24px;background:#f4f7fa;border-radius:16px;box-shadow:0 4px 24px rgba(60,80,120,0.08);color:#223046;font-family:'Segoe UI','Roboto',Arial,sans-serif;}
.atm-header{text-align:center;margin-bottom:28px;}
.atm-subtitle{color:#5a6b82;font-size:1.08rem;margin-top:0.5rem;}
.atm-card{background:#e6ecf5;border-radius:12px;box-shadow:0 2px 8px rgba(60,80,120,0.06);padding:24px 20px;margin-bottom:32px;}
.form-group{margin-bottom:14px;position:relative;}
.clear-btn{position:absolute;top:30px;right:100px;width:2rem;height:2rem;padding:0;font-size:1.2rem;line-height:1;border:none;background:transparent;color:#d9534f;cursor:pointer;}
input,textarea,select{width:100%;padding:9px;margin-top:5px;border:1px solid #bfc9d9;border-radius:4px;background:#f8fafc;}
.btn-primary{background:#2b6cb0;color:#fff;padding:10px 22px;border-radius:6px;font-weight:600;transition:background .2s;border:none;cursor:pointer;width:100%;margin-top:8px;}
.btn-primary:hover{background:#234e7d;}
.alert{margin-bottom:10px;padding:10px;border-radius:4px;}
.alert-success{background:#d4edda;color:#155724;} .alert-danger{background:#f8d7da;color:#721c24;}
.atm-info-section{background:#f0f4fa;border-radius:10px;padding:20px 16px;margin-top:10px;}
.atm-info-section h4{color:#385170;margin-bottom:10px;} .atm-info-section ul{color:#42516d;margin-bottom:10px;padding-left:20px;}
/* modal */
.modal-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
.modal-content{background:#fff;padding:20px;border-radius:8px;width:90%;max-width:500px;box-shadow:0 4px 12px rgba(0,0,0,0.2);}
.modal-content h5{margin-bottom:16px;} .modal-content .form-control{margin-bottom:12px;} .modal-content table{margin-bottom:12px;}
</style>
