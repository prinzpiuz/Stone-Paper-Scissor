<template>
  <v-container fluid>
    <v-banner v-if="!opponentConnected">
      <div>
        <div v-if="store.state.isHost">
          Share this link with your friend
          <div>{{ shareUrl }}</div>
          <div>
            Game code: <b>{{ store.state.gameCode }}</b>
            <span title="Click to copy the invite link">
              <a class="copy-link" @click="copyShareUrl">{{ copyText }}</a>
            </span>
          </div>
        </div>
        <div v-if="peerLost">Connection lost with peer !</div>
        waiting for player
        <v-progress-circular indeterminate color="red"></v-progress-circular>
      </div>
    </v-banner>
    <v-row>
      <v-container fluid>
        <v-row no-gutters>
          <v-col v-for="move in MOVES" :key="move" class="text-center">
            <v-card class="pa-2" flat tile @click="submitMove(move)">
              <i
                :class="handClass(move, myMove)"
                class="hand-icon"
                :style="{ color: MOVE_COLORS[move] }"
              ></i>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-container fluid class="opponent">
        <v-row no-gutters>
          <v-col v-for="move in MOVES" :key="move" class="text-center">
            <v-card class="pa-2" flat tile>
              <i
                :class="handClass(move, revealed ? opponentMove : null)"
                class="hand-icon"
                :style="{ color: MOVE_COLORS[move] }"
              ></i>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <div>
      <v-card
        class="d-flex align-center justify-space-around"
        height="150"
        flat
        tile
      >
        <v-card max-width="200" flat class="mt-5 pa-3">
          <div>
            <b>{{ store.state.name }}</b>
          </div>
          <div class="mb-1">{{ myScore }}</div>
        </v-card>
        vs
        <v-card max-width="200" flat class="mt-5 pa-3">
          <div>
            <b>{{ store.state.opponentName || "opponent" }}</b>
          </div>
          <div class="mb-1">{{ opponentScore }}</div>
        </v-card>
      </v-card>
    </div>
    <div>
      <v-card class="d-flex justify-space-around" height="150" flat tile>
        <v-card max-width="200" flat class="mt-5 pa-3">
          <div>
            <h1>{{ timeLeft }}</h1>
          </div>
          <div>{{ statusText }}</div>
        </v-card>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import P2PT from "p2pt";
import { GAME_ANNOUNCE_URLS, REVEAL_MS, TIMER } from "@/constants";
import { DRAW, MOVES, WIN, isMove, outcome, randomMove } from "@/game";

const MOVE_COLORS = { stone: "red", paper: "blue", scissors: "green" };
const MOVE_ICONS = {
  stone: "fa-hand-rock",
  paper: "fa-hand-paper",
  scissors: "fa-hand-scissors"
};

const store = useStore();
const router = useRouter();

const copyText = ref("click to copy url");
const timeLeft = ref(TIMER);
const timedOut = ref(false);
const opponentConnected = ref(false);
const peerLost = ref(false);
const myScore = ref(0);
const opponentScore = ref(0);
const myMove = ref(null);
const opponentMove = ref(null);
const revealed = ref(false);

let p2pt = null;
let peer = null;
let tickHandle = null;
let revealHandle = null;
// Rounds are numbered so a move that arrives while the previous result is still
// on screen is held back instead of being applied to the wrong round.
let roundNumber = 0;
const bufferedMoves = new Map();

const shareUrl = computed(() => {
  const href = router.resolve({
    name: "join_game",
    query: { g: store.state.gameCode }
  }).href;
  return new URL(href, window.location.href).href;
});

const statusText = computed(() => {
  if (!opponentConnected.value) return "Waiting for opponent to join";
  if (revealed.value) return roundResultText.value;
  if (myMove.value === null) return "Your turn";
  return "Waiting for opponent's move";
});

const roundResultText = computed(() => {
  const result = outcome(myMove.value, opponentMove.value);
  if (result === DRAW) return "Draw";
  const prefix = timedOut.value ? "Time up — " : "";
  return prefix + (result === WIN ? "You win this round" : "Opponent wins this round");
});

function handClass(move, chosen) {
  // Solid hand marks the played move, outlined hands are the ones not picked.
  return `${chosen === move ? "fas" : "far"} ${MOVE_ICONS[move]}`;
}

function copyShareUrl() {
  if (!navigator.clipboard) {
    copyText.value = "copy it manually";
    return;
  }
  navigator.clipboard.writeText(shareUrl.value).then(
    () => {
      copyText.value = "copied !";
    },
    () => {
      copyText.value = "copy it manually";
    }
  );
}

function send(payload) {
  if (!peer) return;
  p2pt.send(peer, JSON.stringify(payload));
}

function startRound() {
  clearTimers();
  myMove.value = null;
  // A move for this round may already have arrived during the reveal pause.
  opponentMove.value = bufferedMoves.get(roundNumber) ?? null;
  bufferedMoves.delete(roundNumber);
  revealed.value = false;
  timedOut.value = false;
  timeLeft.value = TIMER;
  tickHandle = setInterval(tick, 1000);
}

function tick() {
  timeLeft.value -= 1;
  if (timeLeft.value > 0) return;

  timeLeft.value = 0;
  clearInterval(tickHandle);
  tickHandle = null;
  if (myMove.value === null) {
    timedOut.value = true;
    submitMove(randomMove());
  }
}

function submitMove(move) {
  // One move per round, and only once there is somebody to play against.
  if (!opponentConnected.value || revealed.value || myMove.value !== null) return;

  myMove.value = move;
  send({ type: "move", round: roundNumber, move });
  resolveRound();
}

function receiveMove(round, move) {
  if (!isMove(move)) return;
  if (round === roundNumber) {
    opponentMove.value = move;
    resolveRound();
  } else if (round > roundNumber) {
    bufferedMoves.set(round, move);
  }
}

function resolveRound() {
  if (myMove.value === null || opponentMove.value === null) return;

  clearTimers();
  revealed.value = true;

  // Both peers score the same pair of moves, so the totals stay in sync
  // without either side having to trust a score sent over the wire.
  const result = outcome(myMove.value, opponentMove.value);
  if (result === WIN) myScore.value += 1;
  else if (result !== DRAW) opponentScore.value += 1;

  roundNumber += 1;
  revealHandle = setTimeout(startRound, REVEAL_MS);
}

function clearTimers() {
  clearInterval(tickHandle);
  clearTimeout(revealHandle);
  tickHandle = null;
  revealHandle = null;
}

function onPeerConnect(connectedPeer) {
  // The room is a two player game: ignore anybody joining after the opponent.
  if (peer && peer !== connectedPeer) return;
  peer = connectedPeer;
  peerLost.value = false;
  send({ type: "hello", name: store.state.name });
}

function onPeerClose(closedPeer) {
  if (closedPeer !== peer) return;
  peer = null;
  opponentConnected.value = false;
  peerLost.value = true;
  clearTimers();
  // The reconnecting peer restarts at round 0, so drop any stale round state.
  roundNumber = 0;
  bufferedMoves.clear();
}

function onMessage(fromPeer, raw) {
  if (fromPeer !== peer) return;

  let msg;
  try {
    msg = JSON.parse(raw);
  } catch (e) {
    return;
  }

  if (msg.type === "hello") {
    store.commit("setOpponentName", String(msg.name || "opponent").slice(0, 32));
    if (!opponentConnected.value) {
      opponentConnected.value = true;
      startRound();
    }
  } else if (msg.type === "move") {
    receiveMove(msg.round, msg.move);
  }
}

onMounted(() => {
  p2pt = new P2PT(GAME_ANNOUNCE_URLS, store.state.gameCode);
  p2pt.on("peerconnect", onPeerConnect);
  p2pt.on("peerclose", onPeerClose);
  p2pt.on("msg", onMessage);
  p2pt.start();
});

onBeforeUnmount(() => {
  clearTimers();
  if (p2pt) p2pt.destroy();
  p2pt = null;
  peer = null;
});
</script>

<style scoped>
.opponent {
  position: absolute;
  bottom: 45px;
}
.hand-icon {
  font-size: 100px;
}
.copy-link {
  cursor: pointer;
  margin-left: 10px;
  text-decoration: underline;
}
</style>
