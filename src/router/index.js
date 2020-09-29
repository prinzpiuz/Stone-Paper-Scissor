import Vue from "vue";
import Router from "vue-router";
import Register from "@/components/register";
import Game from "@/components/game_page.vue";
import Join from "@/components/enter_code.vue";
import NotFound from "@/components/404.vue";

Vue.use(Router);

export default new Router({
  // mode: "history",
  routes: [
    {
      path: "/",
      name: "register",
      component: Register,
    },
    {
      path: "/game",
      name: "game",
      component: Game,
    },
    {
      path: "/join_game",
      name: "join_game",
      component: Join,
    },
    {
      path: "*",
      name: "404",
      component: NotFound,
    },
  ],
});
