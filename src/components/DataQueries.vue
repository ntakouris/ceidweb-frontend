<template>
  <v-col col="12">
    <v-switch v-model="dateRangeEnabled" :label="'Range Selection'"></v-switch>
    <button @click="log(atTimeValue)">test</button>
    <v-row>
      <!-- At date picker -->
      <v-col col="3">
        <v-menu
          v-model="atDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="atDate" label="At" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="atDate" @input="atDateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col col="3">
        <v-menu
          ref="atTime"
          v-model="atTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="atTime"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="At time"
              readonly
              v-on="on"
              v-model="atTimeValue"
            >{{ atTimeValue ? atTimeValue.toString() : 'Select time' }}</v-text-field>
          </template>
          <v-time-picker
            v-if="atTimeMenu"
            v-model="atTimeValue"
            full-width
            @click:minute="atTimeMenu = false"
          ></v-time-picker>
        </v-menu>
      </v-col>

      <!-- Until date picker -->
      <v-col col="3" v-if="dateRangeEnabled">
        <v-menu
          v-model="untilDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="untilDate" label="At" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="untilDate" @input="untilDateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col col="3" v-if="dateRangeEnabled">
        <v-menu
          ref="untilTime"
          v-model="untilTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="untilTime"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Until time"
              readonly
              v-model="untilTimeValue"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="untilTimeMenu"
            v-model="untilTimeValue"
            full-width
            @click:minute="untilTimeMenu = false"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: "DataQueries",
  data() {
    return {
      dateRangeEnabled: false,
      atDate: new Date().toISOString().substr(0, 10),
      atDateMenu: false,
      untilDate: new Date().toISOString().substr(0, 10),
      untilDateMenu: false,
      atTime: null,
      atTimeValue: null,
      atTimeMenu: false,
      untilTime: null,
      untilTimeValue: null,
      untilTimeMenu: false
    };
  },
  methods: {
    log(x) {
      console.log(x);
    }
  }
};
</script>
