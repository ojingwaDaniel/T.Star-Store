import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import reveal from "./directives/reveal.js";
import { useAuthStore } from "@/stores/auth";
import "./assets/styles/tailwind.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.directive("reveal", reveal);
useAuthStore().init();
app.mount("#app");
