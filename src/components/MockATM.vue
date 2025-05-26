<template>
  <div class="atm-container">
    <h2>Mock ATM</h2>
    <div v-if="checkingAccount">
      <div class="account-info mb-3">
        <strong>Account:</strong> {{ checkingAccount.name }}<br>
        <strong>IBAN:</strong> {{ checkingAccount.iban }}<br>
        <strong>Balance:</strong> {{ checkingAccount.balance }} €
      </div>
      <div class="form-group mb-2">
        <label>Action:</label>
        <select v-model="action" class="form-control">
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
      </div>
      <div class="form-group mb-2">
        <label>Amount:</label>
        <input v-model.number="amount" type="number" min="0" class="form-control" placeholder="Enter amount" />
      </div>
      <button class="btn btn-primary" @click="performAction" :disabled="loading">
        {{ action === 'deposit' ? 'Deposit' : 'Withdraw' }}
      </button>
      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']" role="alert" style="margin-top: 15px;">
        {{ message }}
      </div>
    </div>
    <div v-else>
      <div class="alert alert-warning">No checking account found for this user.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import axios from "axios";

const accountStore = useAccountStore();
const userId = localStorage.getItem("user_id");
const action = ref("deposit");
const amount = ref(null);
const message = ref("");
const messageType = ref("success");
const loading = ref(false);

onMounted(async () => {
  if (userId) {
    await accountStore.fetchAccounts(userId);
  }
});

const checkingAccount = computed(() =>
  accountStore.accounts.find(acc => acc.accountType === "CHECKING")
);

const showMessage = (msg, type = "danger") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

const performAction = async () => {
  if (!amount.value || amount.value <= 0) {
    showMessage("Please enter a valid amount.");
    return;
  }
  if (!checkingAccount.value) {
    showMessage("No checking account found.");
    return;
  }

  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    // Build payload for backend ATM logic
    const payload = {
      fromAccount: { iban: action.value === "deposit" ? "ATM" : checkingAccount.value.iban },
      toAccount: { iban: action.value === "deposit" ? checkingAccount.value.iban : "ATM" },
      amount: parseFloat(amount.value),
      description: action.value === "deposit" ? "ATM Deposit" : "ATM Withdrawal",
      date: new Date().toISOString(),
      userInitiatingTransfer: { id: parseInt(userId) },
    };
    await axios.post(
      "http://localhost:8080/transactions/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await accountStore.fetchAccounts(userId);
    showMessage(
      action.value === "deposit"
        ? `Deposited €${amount.value} successfully!`
        : `Withdrew €${amount.value} successfully!`,
      "success"
    );
    amount.value = null;
  } catch (err) {
    showMessage(
      err?.response?.data?.message ||
        "Failed to perform action. Please try again."
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.atm-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.account-info {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
}
</style>