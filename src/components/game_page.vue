<template>
  <v-container fluid>
    <v-banner
      v-show="!player_connected"
      single-line
      transition="slide-y-transition"
      tile
    >
      <div>
        <div v-show="this.$store.state.intiator">
          Share this code <a>{{ this.$store.state.game_code }}</a> to connect
          player<br />
        </div>
        waiting for player
        <v-progress-circular indeterminate color="red"></v-progress-circular>
      </div>
    </v-banner>
    <v-row>
      <v-container fluid>
        <v-row no-gutters>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile @click="clicked('stone')">
              <v-icon size="100" color="red">{{ this.your_stone }}</v-icon>
            </v-card>
          </v-col>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile @click="clicked('paper')">
              <v-icon size="100" color="blue">{{ this.your_paper }}</v-icon>
            </v-card>
          </v-col>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile @click="clicked('scissors')">
              <v-icon size="100" color="green">{{ this.your_scissors }}</v-icon>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-container fluid class="opponent">
        <v-row no-gutters>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile>
              <v-icon size="100" color="red">{{ this.opponent_stone }}</v-icon>
            </v-card>
          </v-col>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile>
              <v-icon size="100" color="blue">{{ this.opponent_paper }}</v-icon>
            </v-card>
          </v-col>
          <v-col class="text-center">
            <v-card class="pa-2" flat tile>
              <v-icon size="100" color="green">{{
                this.opponent_scissors
              }}</v-icon>
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
        <v-card max-width="200" flat class="mt-5">
          <v-list-item three-line>
            <v-list-item-content>
              <div>{{ this.$store.state.name }}</div>
              <v-list-item-title class="mb-1">
                {{ this.intiator_score }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card>
        vs
        <v-card max-width="200" flat class="mt-5">
          <v-list-item three-line>
            <v-list-item-content>
              <div>{{ this.$store.state.opponent_name }}</div>
              <v-list-item-title class="mb-1">
                {{ this.joiner_score }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-card>
    </div>
    <div>
      <v-card class="d-flex  justify-space-around" height="150" flat tile>
        <v-card max-width="200" flat class="mt-5">
          <v-list-item three-line>
            <v-list-item-content>
              <div>{{ timeout }}</div>
              <div>
                <span v-if="myTurn">Your turn</span>
                <span v-else>Waiting for opponent's move</span><br />
                <span v-show="timeEnd">your time ended</span>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-card>
    </div>
  </v-container>
</template>
<script>
const P2PT = require("p2pt");
const score_calculator = {
  stonepaper: 0,
  stonescissors: 1,
  paperstone: 1,
  paperscissors: 0,
  scissorsstone: 0,
  scissorspaper: 1
};
export default {
  // components: {
  // },
  data: () => ({
    p2pt: null,
    peer: null,
    timeout: null,
    myTurn: false,
    timeEnd: false,
    runtime: null,
    player_connected: false,
    gameFinished: false,
    opponent: "",
    intiator_score: 0,
    joiner_score: 0,
    intiator_button: null,
    joiner_button: null,
    button_pressed: null,
    opponent_button: null,
    cycle_end: false,
    your_stone: "far fa-hand-rock",
    your_paper: "far fa-hand-paper",
    your_scissors: "far fa-hand-scissors",
    opponent_stone: "far fa-hand-rock",
    opponent_paper: "far fa-hand-paper",
    opponent_scissors: "far fa-hand-scissors",
    change_color: false,
    message: null
  }),
  watch: {
    timeout: function() {
      if (this.timeout <= 0) {
        this.stopTimer();
        this.timeEnd = true;
      }
    }
  },
  methods: {
    clicked(data) {
      if (this.myTurn) {
        if (data === "stone") {
          this.your_stone = "fas fa-hand-rock";
        } else if (data === "paper") {
          this.your_paper = "fas fa-hand-paper";
        } else {
          this.your_scissors = "fas fa-hand-scissors";
        }
        if (!this.$store.state.intiator) {
          if (this.message.button === "stone") {
            this.opponent_stone = "fas fa-hand-rock";
          } else if (this.message.button === "paper") {
            this.opponent_paper = "fas fa-hand-paper";
          } else {
            this.opponent_scissors = "fas fa-hand-scissors";
          }
        }

        this.button_pressed = data;
        if (this.$store.state.intiator) {
          this.p2pt.send(
            this.peer,
            JSON.stringify({
              type: "move",
              button: data,
              intiator: true,
              cycle_end: false
            })
          );
        } else {
          this.p2pt.send(
            this.peer,
            JSON.stringify({
              type: "move",
              button: data,
              intiator: false,
              cycle_end: true
            })
          );
          setTimeout(() => {
            this.your_stone = "far fa-hand-rock";
            this.your_paper = "far fa-hand-paper";
            this.your_scissors = "far fa-hand-scissors";
            this.opponent_stone = "far fa-hand-rock";
            this.opponent_paper = "far fa-hand-paper";
            this.opponent_scissors = "far fa-hand-scissors";
          }, 3000);
        }

        this.stopTimer();
        this.myTurn = false;
      }
    },

    timer() {
      this.timeout = this.$TIMER;
      this.runtime = setInterval(this.turnEachSecond, 1000);
    },
    turnEachSecond() {
      this.timeout -= 1;
    },
    stopTimer() {
      clearInterval(this.runtime);
      this.timeout = 0;
    },
    init() {
      this.connect();
    },
    connect() {
      this.p2pt = new P2PT(
        this.$GAME_ANNOUNCE_URLS,
        this.$store.state.game_code
      );
      this.p2pt.start();

      const $this = this;

      this.p2pt.on("peerconnect", peer => {
        this.peer = peer;
        if (this.gameFinished) {
          return;
        }

        $this.p2pt.send(
          peer,
          JSON.stringify({
            type: "join",
            name: this.$store.state.name
          })
        );
        this.player_connected = true;
        $this.gameStatus = "joined";
        $this.status = "";
      });

      // this.p2pt.on("peerclose", (peer) => {
      //   var player;
      //   for (var id in $this.players) {
      //     player = $this.players[id];
      //     if (player.conn && player.conn.id === peer.id) {
      //       var name = $this.players[id].name;

      //       delete $this.playerTurns[id];
      //       delete $this.players[id];

      //       $this.chatAddMsg("!game!", `Connection lost with ${name}`);

      //       $this.fixPlayerTurns();

      //       break;
      //     }
      //   }
      // });

      this.p2pt.on("msg", (peer, msg) => {
        msg = JSON.parse(msg);
        this.message = msg;
        if (msg.type == "join") {
          this.$store.commit("setOpponent", msg.name);
          if (this.$store.state.intiator) {
            this.myTurn = true;
            this.timer();
          }
        }
        if (msg.type == "move") {
          if (msg.cycle_end) {
            if (msg.button === "stone") {
              this.opponent_stone = "fas fa-hand-rock";
            } else if (msg.button === "paper") {
              this.opponent_paper = "fas fa-hand-paper";
            } else {
              this.opponent_scissors = "fas fa-hand-scissors";
            }
            if (this.button_pressed === msg.button) {
              this.intiator_score += 0;
              this.joiner_score += 0;
            } else {
              let score_card = this.button_pressed + msg.button;
              this.intiator_score += score_calculator[score_card];
              if (score_calculator[score_card] == 0) {
                this.joiner_score += 1;
              } else {
                this.joiner_score += 0;
              }
            }
            this.p2pt.send(
              this.peer,
              JSON.stringify({
                type: "score",
                score: {
                  joiner: this.intiator_score,
                  intiator: this.joiner_score
                }
              })
            );
            setTimeout(() => {
              this.your_stone = "far fa-hand-rock";
              this.your_paper = "far fa-hand-paper";
              this.your_scissors = "far fa-hand-scissors";
              this.opponent_stone = "far fa-hand-rock";
              this.opponent_paper = "far fa-hand-paper";
              this.opponent_scissors = "far fa-hand-scissors";
            }, 3000);
            this.myTurn = true;
            this.timer();
          } else {
            this.myTurn = true;
            this.timer();
            setTimeout(null, this.$TIMER * 1000);

            if (this.button_pressed === msg.button) {
              this.intiator_score += 0;
              this.joiner_score += 0;
            } else {
              let score_card = msg.button + this.button_pressed;
              this.intiator_score += score_calculator[score_card];
              if (score_calculator[score_card] == 0) {
                this.joiner_score += 1;
              } else {
                this.joiner_score += 0;
              }
            }
          }
        }
        if (msg.type == "score") {
          this.intiator_score = msg.score.intiator;
          this.joiner_score = msg.score.joiner;
        }
      });

      // this.p2pt.on("trackerconnect", () => {
      //   // trackerConnected = true;
      // });

      window.p2pt = this.p2pt;
    }
  },
  mounted() {
    this.init();
    window.addEventListener("beforeunload", this.onBeforeUnload);
  }
};
</script>
<style>
.opponent {
  position: absolute;
  bottom: 45px;
}
.player1 {
  position: fixed;
  align-items: center;
}
</style>
