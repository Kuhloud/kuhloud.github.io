import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuthToken, setAuthToken } from "@/utils/auth";
import { createPinia } from "pinia";

import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import Login from "@/components/registration/Login.vue";
import Signup from "@/components/registration/Signup.vue";
import Transfer from "@/components/Transfer.vue";
import MockATM from "@/components/MockATM.vue";

import TransferHistory from "@/components/TransferHistory.vue";

import User from "@/components/User.vue";
import InactiveList from "@/components/inactiveCustomers.vue";
import UserDetails from "@/components/UserDetails.vue";
import Profile from "@/components/profile/Profile.vue";
import IbanSearch from "@/components/IbanSearch.vue";
import Home from "@/components/Home.vue";
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

  },
  {
    path: "/users",
    component: User,
  },
  {
    path: "/users/inactivelist",
    component: InactiveList,
  },
  {
    path: "/users/userdetails/:id",
    component: UserDetails,
    props: true,
  },
  {
    path: "/mockATM",
    component: MockATM,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/ibanSearch",
    component: IbanSearch,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
