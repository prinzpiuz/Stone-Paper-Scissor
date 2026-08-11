<template>
  <v-container class="fill-height">
    <v-card class="mx-auto flex-center" flat>
      <div class="pa-4">
        <v-text-field
          v-model="name"
          label="Enter Name *"
          :error-messages="nameError"
          @keyup.enter="joinGame"
        ></v-text-field>
        <v-text-field
          v-model="code"
          label="Enter Code To Join Game *"
          :error-messages="codeError"
          :maxlength="GAME_CODE_LENGTH"
          @keyup.enter="joinGame"
        ></v-text-field>
        <v-btn variant="text" color="green" @click="joinGame">Join Game</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  GAME_CODE_LENGTH,
  isGameCodeValid,
  normalizeGameCode
} from "@/game";
import { useFormField } from "@/composables/useFormField";

const router = useRouter();
const route = useRoute();
const store = useStore();

const { value: name, error: nameError } = useFormField(store.state.name);
// A shared invite link carries the code in ?g=, so prefill it.
const { value: code, error: codeError } = useFormField(
  normalizeGameCode(route.query.g)
);

function joinGame() {
  const playerName = name.value.trim();
  const gameCode = normalizeGameCode(code.value);

  nameError.value = playerName ? "" : "Enter your name";
  codeError.value = isGameCodeValid(gameCode)
    ? ""
    : `Enter the ${GAME_CODE_LENGTH} character game code`;
  if (nameError.value || codeError.value) return;

  store.commit("joinGame", { name: playerName, gameCode });
  router.push({ name: "game" });
}
</script>
