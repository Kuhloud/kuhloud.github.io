<template>
  <div class="transfer-container">
    <router-link to="/transfer/history" class="btn-primary transfer-history-link">
      To Transfer History →
    </router-link>
    <h1>Transfer Money</h1>

    <!-- Message Box -->
    <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
      {{ message }}
    </div>

    <!-- Transfer Type Toggle -->
    <div class="form-group">
      <label>Transfer Type:</label>
      <div>
        <label>
          <input
            type="radio"
            value="own"
            v-model="transferType"
          />
          Between My Accounts
        </label>
        <label>
          <input
            type="radio"
            value="external"
            v-model="transferType"
          />
          To Someone Else
        </label>
      </div>
    </div>

    <!-- Select Bank Account -->
    <div class="form-group">
      <label for="fromAccount">Select Account to Transfer From:</label>
      <select v-model="selectedAccount" id="fromAccount" class="form-control">
        <option v-for="account in accounts" :key="account.id + '-' + account.balance" :value="account">
          {{ account.name }} - {{ account.balance }} €
        </option>
      </select>
    </div>

    <!-- Transfer Details -->
    <div v-if="transferType === 'own'" class="form-group">
      <label for="toAccount">Select Account to Transfer To:</label>
      <select v-model="toAccount" id="toAccount" class="form-control">
        <option
          v-for="account in accounts"
          :key="account.id + '-' + account.balance"
          :value="account"
          :disabled="account.id === selectedAccount?.id"
        >
          {{ account.name }} - {{ account.balance }} €
        </option>
      </select>
    </div>

    <div v-else class="form-group">
      <label for="toIban">Recipient IBAN:</label>
      <input
        v-model="toIban"
        type="text"
        id="toIban"
        class="form-control"
        placeholder="Enter recipient's IBAN"
      />
    </div>

    <div class="form-group">
      <label for="amount">Amount:</label>
      <input
        v-model="amount"
        type="number"
        id="amount"
        class="form-control"
        placeholder="Enter amount to transfer"
      />
    </div>

    <div class="form-group">
      <label for="description">Description:</label>
      <textarea
        v-model="description"
        id="description"
        class="form-control"
        placeholder="Enter a description"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button @click="submitTransfer" class="btn-primary">Transfer</button>

    <div class="transfer-info-section">
      <h4>How does it work?</h4>
      <ul>
        <li>Transfer between your own accounts or to any IBAN in Europe</li>
        <li>All transfers are instant and secure</li>
        <li>See your balances update live after each transfer</li>
      </ul>
      <p class="transfer-footer-note">
        Benevolent Bank keeps your money moving, safely and quickly.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import { useAccountStore } from "@/stores/accountStore";
import { useTransactionStore } from "@/stores/transactionStore";
import axios from "axios";

export default {
  setup() {
    const router = useRouter(); // Initialize router
    const accountStore = useAccountStore();
    const transactionStore = useTransactionStore();
    const transferType = ref("own");
    const selectedAccount = ref(null);
    const toAccount = ref(null);
    const toIban = ref("");
    const amount = ref("");
    const description = ref("");
    const userId = localStorage.getItem("user_id");

    // Redirect to login if not logged in
    onMounted(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      if (userId) {
        accountStore.fetchAccounts(userId);
      }
    });

    // Message state
    const message = ref("");
    const messageType = ref("success"); // 'success' or 'danger'

    const showMessage = (msg, type = "danger") => {
      message.value = msg;
      messageType.value = type;
      setTimeout(() => {
        message.value = "";
      }, 4000);
    };

    const submitTransfer = async () => {
      const token = localStorage.getItem("token");
      if (!selectedAccount.value) {
        showMessage("Please select an account to transfer from.");
        return;
      }
      if (transferType.value === "own" && !toAccount.value) {
        showMessage("Please select an account to transfer to.");
        return;
      }
      if (transferType.value === "external" && !toIban.value) {
        showMessage("Please enter the recipient's IBAN.");
        return;
      }
      if (!amount.value || amount.value <= 0) {
        showMessage("Amount must be greater than zero.");
        return;
      }
      if (!description.value) {
        showMessage("Please enter a description.");
        return;
      }

      const payload = {
        fromAccountIban: selectedAccount.value.iban,
        toAccountIban:
          transferType.value === "own"
            ? toAccount.value.iban
            : toIban.value,
        amount: parseFloat(amount.value),
        description: description.value,
        date: new Date().toISOString()
      };

      const success = await transactionStore.submitTransfer(payload, token);
      if (success) {
        showMessage("Transfer successful!", "success");
        toAccount.value = null;
        toIban.value = "";
        amount.value = "";
        description.value = "";
        // Refresh accounts after transfer and reset selection
        if (userId) {
          await accountStore.fetchAccounts(userId);
          selectedAccount.value = null;
          toAccount.value = null;
        }
      } else {
        showMessage("Failed to make transfer. Please try again.");
      }
    };

    return {
      accounts: computed(() => accountStore.accounts),
      transferType,
      selectedAccount,
      toAccount,
      toIban,
      amount,
      description,
      submitTransfer,
      loading: accountStore.loading || transactionStore.loading,
      error: accountStore.error || transactionStore.error,
      message,
      messageType,
    };
  },
};
</script>

<style scoped>
.transfer-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #f4f7fa;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 80, 120, 0.08);
  color: #223046;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.transfer-history-link {
  display: inline-block;
  margin-bottom: 20px;
}

h1 {
  color: #2a4365;
  font-size: 2rem;
  margin-bottom: 1.2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: 500;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
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
  margin-bottom: 15px;
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

.transfer-info-section {
  background: #f0f4fa;
  border-radius: 10px;
  padding: 24px 20px;
  margin-top: 24px;
}

.transfer-info-section h4 {
  color: #385170;
  margin-bottom: 12px;
}

.transfer-info-section ul {
  color: #42516d;
  margin-bottom: 14px;
  padding-left: 20px;
}

.transfer-footer-note {
  color: #7b8ba3;
  font-size: 0.98rem;
  margin-top: 10px;
  text-align: center;
}
</style>