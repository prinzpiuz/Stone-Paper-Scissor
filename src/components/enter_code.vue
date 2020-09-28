<template>
  <v-container fill-height>
    <v-card class="mx-auto container" flat>
      <v-list-item three-line>
        <v-list-item-content>
          <v-text-field
            v-model="name"
            label="Enter Name *"
            :rules="rules"
          ></v-text-field>
          <v-alert type="error" v-show="alert">
            Enter valid game code
          </v-alert>
          <v-text-field
            v-model="code"
            label="Enter Code To Join Game *"
            :rules="rules"
          ></v-text-field>
          <v-btn text color="green" @click="check_input">Join Game</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    code: "",
    name: "",
    alert: false,
    rules: [value => !!value || "Required."]
  }),
  watch: {
    code: function(val) {
      if (val) {
        this.alert = false;
      }
    }
  },
  methods: {
    check_input() {
      if (!this.isGameCodeValid(this.code)) {
        this.alert = true;
      } else {
        this.$store.commit("setName", this.name);
        this.$store.commit("gameCode", this.code);
        this.$router.push({ name: "game" });
      }
    }
  }
};
</script>
