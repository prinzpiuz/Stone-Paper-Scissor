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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { DRAW, MOVES, WIN, outcome } from "@/game";
import { useP2PGame } from "@/composables/useP2PGame";
import { MOVE_COLORS, handClass } from "@/ui/moves";

const store = useStore();
const router = useRouter();

const {
  timeLeft,
  timedOut,
  opponentConnected,
  peerLost,
  myScore,
  opponentScore,
  myMove,
  opponentMove,
  revealed,
  submitMove
} = useP2PGame({
  gameCode: store.state.gameCode,
  playerName: store.state.name,
  onOpponentName: name => store.commit("setOpponentName", name)
});

const copyText = ref("click to copy url");

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
