<template>
  <div class="transfer-container">
    <h1>Transfer Money</h1>

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
import axios from "axios"; // Ensure axios is installed and imported

export default {
  setup() {
    const accounts = ref([]); // Store the user's bank accounts
    const transferType = ref("own"); // Default to transferring between own accounts
    const selectedAccount = ref(null);
    const toAccount = ref(null);
    const toIban = ref("");
    const amount = ref("");
    const description = ref("");

    // Fetch accounts from the backend
    const fetchAccounts = async () => {
      const userId = localStorage.getItem("user_id"); // Get the logged-in user's ID from localStorage
      if (!userId) {
        alert("User is not logged in.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/accounts/${userId}`);
        accounts.value = response.data; // Populate the accounts array with the response
      } catch (error) {
        console.error("Error fetching accounts:", error);
        alert("Failed to fetch accounts. Please try again later.");
      }
      console.log("Accounts fetched:", accounts.value);
    };

    // Submit transfer function
    const submitTransfer = () => {
      if (!selectedAccount.value) {
        alert("Please select an account to transfer from.");
        return;
      }
      if (transferType.value === "own" && !toAccount.value) {
        alert("Please select an account to transfer to.");
        return;
      }
      if (transferType.value === "external" && !toIban.value) {
        alert("Please enter the recipient's IBAN.");
        return;
      }
      if (!amount.value || amount.value <= 0) {
        alert("Amount must be greater than zero.");
        return;
      }
      if (!description.value) {
        alert("Please enter a description.");
        return;
      }

      // Mock transfer logic
      if (transferType.value === "own") {
        alert(
          `Transfer of ${amount.value} € from ${selectedAccount.value.name} to ${toAccount.value.name} with description "${description.value}" has been submitted.`
        );
      } else {
        alert(
          `Transfer of ${amount.value} € from ${selectedAccount.value.name} to IBAN ${toIban.value} with description "${description.value}" has been submitted.`
        );
      }

      // Reset form
      toAccount.value = null;
      toIban.value = "";
      amount.value = "";
      description.value = "";
    };

    // Fetch accounts when the component is mounted
    onMounted(fetchAccounts);

    return {
      accounts,
      transferType,
      selectedAccount,
      toAccount,
      toIban,
      amount,
      description,
      submitTransfer,
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
</style>