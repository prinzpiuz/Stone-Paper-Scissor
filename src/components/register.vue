<template>
  <v-container fill-height>
    <v-col class="text-center">
      <v-icon size="200" color="red">far fa-hand-rock</v-icon
      ><v-divider class="mx-5" vertical></v-divider
      ><v-icon size="200" color="blue">far fa-hand-paper</v-icon
      ><v-divider class="mx-5" vertical></v-divider
      ><v-icon size="200" color="green">far fa-hand-scissors</v-icon>
    </v-col>
    <v-card class="mx-auto container" flat>
      <v-list-item three-line>
        <v-list-item-content>
          <v-alert type="error" v-show="alert" dismissible>
            Enter name
          </v-alert>
          <v-text-field
            v-model="name"
            :rules="rules"
            label="Enter Name *"
          ></v-text-field>
          <v-btn text color="blue" @click="host_game">Host Game</v-btn>
          <v-col class="text-center">
            <v-spacer></v-spacer>
            <p>OR</p>
            <v-btn text color="green" @click="join_game">Join Game</v-btn>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <div class="container">
      <ul>
        <li>
          <a @click="goAbout"><i class="fas fa-hands-helping"></i></a>
        </li>
      </ul>
      <ul>
        <li>
          <a
            href="https://github.com/prinzpiuz/Stone-Paper-Scissor/blob/master/LICENSE"
            >Licence</a
          >
        </li>
      </ul>
      <ul>
        <li>
          <a href=""><i class="fab fa-github"></i></a><br />
        </li>
      </ul>
    </div>
    No Server, No Storage, Just Peer to Peer
    <v-btn @click="change_theme" text absolute top right>
      <v-icon size="20" :color="icon_color">far fa-lightbulb</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    light: false,
    alert: false,
    name: "",
    icon_color: "black",
    rules: [value => !!value || "Required."]
  }),
  methods: {
    host_game() {
      if (!this.name) {
        this.alert = true;
      } else {
        this.$store.commit("setName", this.name);
        let game_code = Math.random()
          .toString(36)
          .substr(2, this.$GAME_CODE_LENGTH);
        this.$store.commit("gameCode", game_code);
        this.$store.commit("setIntiator");
        this.$router.push({ name: "game" });
      }
    },
    join_game() {
      this.$router.push({ name: "join_game" });
    },
    change_theme() {
      if (this.light) {
        this.light = !this.light;
        this.$vuetify.theme.dark = false;
        this.icon_color = "black";
      } else {
        this.light = !this.light;
        this.$vuetify.theme.dark = true;
        this.icon_color = "white";
      }
    },
    goAbout() {
      this.$router.push({ name: "about" });
    }
  }
};
</script>
<style scoped>
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.12) !important;
}
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
</style>
