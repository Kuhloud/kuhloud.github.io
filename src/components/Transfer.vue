<template>
  <div class="transfer-container">
    <router-link to="/transfer/history" class="btn btn-primary" style="margin-bottom: 20px;">
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
        <option v-for="account in accounts" :key="account.id" :value="account">
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
          :key="account.id"
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
    <button @click="submitTransfer" class="btn btn-primary">Transfer</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import { useTransactionStore } from "@/stores/transactionStore";

export default {
  setup() {
    const accountStore = useAccountStore();
    const transactionStore = useTransactionStore();
    const transferType = ref("own");
    const selectedAccount = ref(null);
    const toAccount = ref(null);
    const toIban = ref("");
    const amount = ref("");
    const description = ref("");
    const userId = localStorage.getItem("user_id");

    // Message state
    const message = ref("");
    const messageType = ref("success"); // 'success' or 'danger'

    onMounted(() => {
      if (userId) {
        accountStore.fetchAccounts(userId);
      }
    });

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
        fromAccount: { iban: selectedAccount.value.iban },
        toAccount:
          transferType.value === "own"
            ? { iban: toAccount.value.iban }
            : { iban: toIban.value },
        amount: parseFloat(amount.value),
        description: description.value,
        date: new Date().toISOString(),
        userInitiatingTransfer: { id: parseInt(userId) },
      };

      const success = await transactionStore.submitTransfer(payload, token);
      if (success) {
        showMessage("Transfer successful!", "success");
        toAccount.value = null;
        toIban.value = "";
        amount.value = "";
        description.value = "";
        // Refresh accounts after transfer
        if (userId) {
          // Need to look into this, accounts do not refresh
          accountStore.fetchAccounts(userId);
        }
      } else {
        showMessage("Failed to make transfer. Please try again.");
      }
    };

    return {
      accounts: accountStore.accounts,
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
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

label input[type="radio"] {
  margin-right: 5px;
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
</style>