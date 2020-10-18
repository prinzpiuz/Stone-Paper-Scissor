import Vue from "vue";
import Vuex from "vuex";
import VueClipboard from "vue-clipboard2";
import App from "./App.vue";
import router from "./router";
import "vuetify/dist/vuetify.min.css";
import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueClipboard);

Vue.prototype.$GAME_CODE_LENGTH = 4;
Vue.prototype.$TIMER = 20;
Vue.prototype.$URL = "https://silly-fermat-36c0e6.netlify.app/#/join_game/?g=";
// Vue.prototype.$URL = "192.168.43.170:8080/#/join_game/?g=";

var announceURLs = [
  "wss://wsswt.herokuapp.com/",
  "wss://tracker.openwebtorrent.com",
  "ws://127.0.0.1:8085",
  "wss://tracker.sloppyta.co:443/announce",
  "wss://tracker.novage.com.ua:443/announce",
  "wss://tracker.btorrent.xyz:443/announce",
];

if (window.location.hostname === "localhost") {
  announceURLs = ["ws://localhost:8085"];
}
Vue.prototype.$GAME_ANNOUNCE_URLS = announceURLs;

// For adding a new tracker
window.$ADD_TRACKER = function(trackerURL) {
  if (announceURLs.indexOf(trackerURL) === -1) {
    if (window.p2pt) {
      window.p2pt.addTracker(trackerURL);
    }
    announceURLs.push(trackerURL);
  }
};

Vue.prototype.isGameCodeValid = (gameCode) => {
  try {
    if (gameCode.length !== Vue.prototype.$GAME_CODE_LENGTH) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const store = new Vuex.Store({
  state: {
    name: "",
    opponent_name: "",
    game_code: "",
    intiator: false,
    joiner: false,
    rounds: 0,
  },
  mutations: {
    setName(state, value) {
      state.name = value;
    },
    setRounds(state, value) {
      state.rounds = value;
    },
    gameCode(state, value) {
      state.game_code = value;
    },
    setIntiator(state) {
      state.intiator = true;
    },
    setJoiner(state) {
      state.joiner = true;
    },
    setOpponent(state, value) {
      state.opponent_name = value;
    },
  },
});

new Vue({
  render: (h) => h(App),
  router,
  vuetify,
  store,
}).$mount("#app");
