<template>
  <div class="atm-container">
    <div class="atm-header">
      <h2>Mock ATM</h2>
      <p class="atm-subtitle">
        Deposit or withdraw cash from your checking account, just like at a real ATM.
      </p>
    </div>
    <div v-if="checkingAccount" class="atm-card">
      <div class="account-info">
        <strong>Account:</strong> {{ checkingAccount.name }}<br>
        <strong>IBAN:</strong> {{ checkingAccount.iban }}<br>
        <strong>Balance:</strong> {{ checkingAccount.balance }} €
      </div>
      <div class="form-group">
        <label>Action:</label>
        <select v-model="action" class="form-control">
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
      </div>
      <div class="form-group">
        <label>Amount:</label>
        <input v-model.number="amount" type="number" min="0" class="form-control" placeholder="Enter amount" />
      </div>
      <button class="btn-primary" @click="performAction" :disabled="loading">
        {{ action === 'deposit' ? 'Deposit' : 'Withdraw' }}
      </button>
      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']" role="alert" style="margin-top: 15px;">
        {{ message }}
      </div>
    </div>
    <div v-else class="atm-card">
      <div class="alert alert-warning">No checking account found for this user.</div>
    </div>
    <div class="atm-info-section">
      <h4>ATM Features</h4>
      <ul>
        <li>Instantly deposit or withdraw cash from your checking account</li>
        <li>See your balance update live after each transaction</li>
        <li>Secure and simple—just like a real ATM</li>
      </ul>
      <p class="atm-footer-note">
        Benevolent Bank's Mock ATM is here for your convenience, 24/7.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router"; // Add this import
import { useAccountStore } from "@/stores/accountStore";
import { useTransactionStore } from "@/stores/transactionStore";
import axios from "axios";
import { getAuthToken } from "@/utils/auth.js";

const router = useRouter(); // Initialize router
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const userId = localStorage.getItem("user_id");
const action = ref("deposit");
const amount = ref(null);
const message = ref("");
const messageType = ref("success");
const loading = ref(false);

onMounted(async () => {
  const token = getAuthToken();
  if (!token) {
    router.push("/login");
    return;
  }
  if (userId) {
    await accountStore.fetchAccounts(userId);
    console.log('Authorization header:', axios.defaults.headers.common['Authorization'])
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
    const token = getAuthToken();
    const payload = {
      fromAccountIban: action.value === "deposit" ? "ATM" : checkingAccount.value.iban,
      toAccountIban: action.value === "deposit" ? checkingAccount.value.iban : "ATM",
      amount: parseFloat(amount.value),
      description: action.value === "deposit" ? "ATM Deposit" : "ATM Withdrawal",
      date: new Date().toISOString()
    };
    const success = await transactionStore.submitTransfer(payload, token);
    if (success) {
      await accountStore.fetchAccounts(userId);
      showMessage(
        action.value === "deposit"
          ? `Deposited €${amount.value} successfully!`
          : `Withdrew €${amount.value} successfully!`,
        "success"
      );
      amount.value = null;
    } else {
      showMessage("Failed to perform action. Please try again.");
    }
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

.atm-header h2 {
  color: #2a4365;
  font-size: 2rem;
  margin-bottom: 0.5rem;
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

.account-info {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 18px;
  border: 1px solid #e0e0e0;
  color: #223046;
}

.form-group {
  margin-bottom: 14px;
}

label {
  font-weight: 500;
}

input,
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
  text-decoration: none;
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

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
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

.atm-footer-note {
  color: #7b8ba3;
  font-size: 0.98rem;
  margin-top: 8px;
  text-align: center;
}
</style>