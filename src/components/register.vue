<template>
  <v-container class="fill-height">
    <v-col class="text-center">
      <template v-for="(move, index) in MOVES" :key="move">
        <v-divider v-if="index > 0" class="mx-5" vertical></v-divider>
        <i :class="handClass(move)" class="icon-hand" :style="{ color: MOVE_COLORS[move] }"></i>
      </template>
    </v-col>
    <v-card class="mx-auto container" flat>
      <div class="pa-4">
        <v-text-field
          v-model="name"
          label="Enter Name *"
          :error-messages="nameError"
          @keyup.enter="hostGame"
        ></v-text-field>
        <v-btn variant="text" color="blue" @click="hostGame">Host Game</v-btn>
        <v-col class="text-center">
          <v-spacer></v-spacer>
          <p>OR</p>
          <v-btn variant="text" color="green" @click="goJoin">Join Game</v-btn>
        </v-col>
      </div>
    </v-card>
    <div class="container">
      <ul>
        <li>
          <router-link :to="{ name: 'about' }" title="How to play">
            <i class="fas fa-hands-helping"></i>
          </router-link>
        </li>
      </ul>
      <ul>
        <li>
          <a :href="`${REPO_URL}/blob/master/LICENSE`">Licence</a>
        </li>
      </ul>
      <ul>
        <li>
          <a :href="REPO_URL" title="Source on GitHub"><i class="fab fa-github"></i></a>
        </li>
      </ul>
    </div>
    No Server, No Storage, Just Peer to Peer
    <v-btn
      variant="text"
      class="theme-toggle"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="toggleTheme"
    >
      <i class="far fa-lightbulb" :style="{ color: isDark ? 'white' : 'black', fontSize: '20px' }"></i>
    </v-btn>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useTheme } from "vuetify";
import { MOVES, newGameCode } from "@/game";

const REPO_URL = "https://github.com/prinzpiuz/Stone-Paper-Scissor";
const MOVE_COLORS = { stone: "red", paper: "blue", scissors: "green" };
const MOVE_ICONS = {
  stone: "fa-hand-rock",
  paper: "fa-hand-paper",
  scissors: "fa-hand-scissors"
};

const router = useRouter();
const store = useStore();
const theme = useTheme();

const name = ref(store.state.name);
const nameError = ref("");

const isDark = computed(() => theme.global.current.value.dark);

watch(name, () => {
  nameError.value = "";
});

function handClass(move) {
  return `far ${MOVE_ICONS[move]}`;
}

function hostGame() {
  const playerName = name.value.trim();
  if (!playerName) {
    nameError.value = "Enter your name";
    return;
  }
  store.commit("hostGame", { name: playerName, gameCode: newGameCode() });
  router.push({ name: "game" });
}

function goJoin() {
  router.push({ name: "join_game" });
}

function toggleTheme() {
  theme.global.name.value = isDark.value ? "light" : "dark";
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
a {
  margin-right: 10px;
  text-decoration: none;
}
ul {
  list-style-type: none;
}
.icon-hand {
  font-size: 200px;
  vertical-align: middle;
}
.theme-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
