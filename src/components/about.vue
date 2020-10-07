<template>
  <div class="container">
    <div>
      <div class="container img_container">
        <img :src="require('@/assets/android-chrome-192x192.png')" />
      </div>
      <div class="container"><h2>Rock Paper Scissor</h2></div>
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
      <ul>
        <h4><b>How to play this game</b></h4>
        <li>This is an one to one game</li>
        <li>
          There are two options, you can either <b>host</b> a game or
          <b>join</b> a game
        </li>
        <li>
          If you want to host a game you can
          <b>You can enter your name and Click on Host game</b>
        </li>
        <li>
          Then you will be taken to game page, There you will see a
          <b>Sharable url</b>
        </li>
        <li>you can share this <b>url</b> with friend you want to play</li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.img_container {
  max-width: 200px;
}
</style>
