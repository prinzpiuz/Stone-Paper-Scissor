import { createStore } from "vuex";

const STORAGE_KEY = "sps-session";

function emptyState() {
  return {
    name: "",
    opponentName: "",
    gameCode: "",
    isHost: false
  };
}

// A reload on /game would otherwise drop the code and kick the player back to
// the start screen, so the session is mirrored into sessionStorage.
function savedState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyState(), ...JSON.parse(saved) } : emptyState();
  } catch (e) {
    return emptyState();
  }
}

const store = createStore({
  state: savedState(),
  getters: {
    hasSession: state => Boolean(state.name && state.gameCode)
  },
  mutations: {
    hostGame(state, { name, gameCode }) {
      state.name = name;
      state.gameCode = gameCode;
      state.isHost = true;
      state.opponentName = "";
    },
    joinGame(state, { name, gameCode }) {
      state.name = name;
      state.gameCode = gameCode;
      state.isHost = false;
      state.opponentName = "";
    },
    setOpponentName(state, value) {
      state.opponentName = value;
    },
    reset(state) {
      Object.assign(state, emptyState());
    }
  }
});

store.subscribe((mutation, state) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Private-mode browsers can refuse to write; the game still works.
  }
});

export default store;
