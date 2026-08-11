<template>
  <div class="flex-center">
    <div>
      <div class="flex-center img_container">
        <img :src="logo" />
      </div>
      <div class="flex-center"><h2>Rock Paper Scissor</h2></div>
      <p>
        This is a game built with
        <a href="https://vuejs.org/" target="_blank">Vue</a>+<a
          href="https://vuetifyjs.com/en/"
          target="_blank"
          >Vuetify</a
        >
        and
        <a href="https://github.com/subins2000/p2pt" target="_blank">p2p</a> by
        <a href="https://twitter.com/prinzpiuz" target="_blank">me</a>
      </p>
      <h4><b>How to play this game</b></h4>
      <ul>
        <li>This is a one to one game</li>
        <li>
          There are two options, you can either <b>host</b> a game or
          <b>join</b> a game
        </li>
        <li>
          To host, enter your name and click on <b>Host Game</b>
        </li>
        <li>
          You are taken to the game page, where you get a <b>sharable url</b>
          and a <b>game code</b>
        </li>
        <li>
          Share either one with the friend you want to play &mdash; they open
          the url, or click <b>Join Game</b> and type in the code
        </li>
        <li>
          Both of you pick a hand within the timer. The hands are revealed
          together, and a random hand is played for you if the timer runs out
        </li>
      </ul>
      <div class="flex-center">
        <router-link :to="{ name: 'register' }">Go Back</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/android-chrome-192x192.png";
</script>

<style scoped>
.img_container {
  max-width: 200px;
}
</style>
