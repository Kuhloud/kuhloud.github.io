import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Auth from "./components/Auth.vue";
import { getAuthToken, setAuthToken } from "@/utils/auth";
import { createPinia } from "pinia";

import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import Login from "@/components/registration/Login.vue";
import Signup from "@/components/registration/Signup.vue";
import Transfer from "@/components/Transfer.vue";
import TransferHistory from "@/components/TransferHistory.vue";

// Initialize auth token if it exists
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/transfer",
    component: Transfer,
  },
  {
    path: "/transfer/history",
    component: TransferHistory,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
