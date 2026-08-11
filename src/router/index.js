import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";
import Register from "@/components/register.vue";
import Game from "@/components/game_page.vue";
import Join from "@/components/enter_code.vue";
import NotFound from "@/components/404.vue";
import About from "@/components/about.vue";

const routes = [
  { path: "/", name: "register", component: Register },
  {
    path: "/game",
    name: "game",
    component: Game,
    // Reaching the board without a name and a code leaves P2PT listening on an
    // empty room, so send those visitors back to the start screen.
    beforeEnter: () =>
      store.getters.hasSession ? true : { name: "register" }
  },
  { path: "/join_game", name: "join_game", component: Join },
  { path: "/about", name: "about", component: About },
  { path: "/:pathMatch(.*)*", name: "404", component: NotFound }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
