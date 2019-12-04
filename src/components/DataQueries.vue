<template>
  <v-col col="12" class="ml-3">
    <v-switch v-model="dateRangeEnabled" :label="'Range Selection'"></v-switch>
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
            <v-text-field label="Until time" readonly v-model="untilTimeValue" v-on="on"></v-text-field>
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

    <!-- Activity Types -->
    <p>Filter Activity Types</p>
    <v-overflow-btn
      v-for="(selection, index) in selectedActivityTypes"
      :key="index"
      :items="availableActivityTypes"
      @change="(e) => { selectedActivityTypes[index] = e }"
    ></v-overflow-btn>

    <v-row>
      <v-btn class="mr-2" color="primary" @click="selectedActivityTypes.push('*')">Add activity type</v-btn>
      <v-btn color="error" @click="selectedActivityTypes = ['*']">Clear activity filters</v-btn>
    </v-row>
    <v-spacer />
    <v-row class="mt-2">
      <v-btn class="mr-2" color="primary" @click="queryServer" :loading="loading">Query Server</v-btn>
      <v-btn color="accent" @click="exportCurrentData" v-if="data != undefined">Export current data</v-btn>
    </v-row>

    <p style="color: red;">{{ error }}</p>

    <!-- Visualizations -->

    <GmapMap
      v-if="data.heatmap"
      ref="map"
      style="width: 800px; height: 800px"
      class="mt-2 mb-2"
      :center="{lat: patrasLat, lng:patrasLng}"
      :zoom="12"
      map-type-id="roadmap"
      :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUi: true
        }"
    ></GmapMap>

    <div class="mt-2 mb-2" v-if="data.perActivity">
      <h2>Entries per activity type</h2>
      <GChart type="BarChart" :data="data.perActivity" />
    </div>

    <v-spacer class="mb-2" />

    <div v-if="data.mostOccurencesPerActivityHour" class="mb-2">
      <h2>Weekly activity stats</h2>
      <v-simple-table :dense="dense" :fixed-header="fixedHeader">
        <thead>
          <tr>
            <th class="text-left">Activity Type</th>
            <th class="text-left">Hour of most occurences</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k of Object.keys(data.mostOccurencesPerActivityHour)" :key="k">
            <td>{{ k }}</td>
            <td>{{ data.mostOccurencesPerActivityHour[k] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>

    <v-spacer class="mb-2" />

    <div v-if="data.mostOccurencesPerActivityWeek">
      <h2>Daily activity stats</h2>
      <v-simple-table :dense="dense" :fixed-header="fixedHeader">
        <thead>
          <tr>
            <th class="text-left">Activity Type</th>
            <th class="text-left">Day of most occurences</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k of Object.keys(data.mostOccurencesPerActivityWeek)" :key="k">
            <td>{{ k }}</td>
            <td>{{ data.mostOccurencesPerActivityWeek[k] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </v-col>
</template>

<script>
const availableActivityTypes = ["*", "UNKNOWN", "ON_FOOT", "IN_VEHICLE"];

export default {
  name: "DataQueries",
  mounted(){
      var admin = this.$route.query.admin
      admin = admin ? admin : false
      this.isAdmin = admin

    const that = this
    this.$refs.map.$mapPromise.then(map => {
      that.map = map;
      });
    
  },
  watch: {
    data: {
    immediate: true, 
    handler (val, oldVal) {
      if (!this.map){
        return
      }

      if(this.heatmap){
        this.heatmap.map = null
      }

      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.data.heatmap.map(x => new google.maps.LatLng(x.lat, x.lng)),
        map: this.map
      })

      this.heatmap.setMap(this.map)
    }
  }
  },
  data() {
    return {
      map: undefined,
      heatmap: undefined,
      isAdmin: false,
      data: {
        heatmap: [
          {lat: 38.230462, lng: 21.75315},
          {lat: 38.230463, lng: 21.75316},
          {lat: 38.230464, lng: 21.75317},
          {lat: 38.230465, lng: 21.75318}
        ],
        perActivity: [
          ['Activity Type', 'Occurences'],
          ['UNKNOWN', 300],
          ['ON_FOOT', 900],
          ['IN_VEHICLE', 1000],
        ],
        mostOccurencesPerActivityWeek: {
          UNKNOWN: 'Wednesday',
          ON_FOOT: 'Tuesday',
          IN_VEHICLE: 'Sunday'
        },
        mostOccurencesPerActivityHour: {
          UNKNOWN: '12:00',
          ON_FOOT: '13:00',
          IN_VEHICLE: '14:00'
        },
      },
      loading: false,
      error: "",
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
      untilTimeMenu: false,
      availableActivityTypes: availableActivityTypes,
      selectedActivityTypes: [availableActivityTypes[0]]
    };
  },
  methods: {
    async queryServer() {
      const url = this.isAdmin ? "admin" : "user";

      const filters = {
        atDate: this.atDate,
        atTime: this.atTime,
        untilDate: this.untilDate,
        untilTime: this.untilTime,
        activityTypes: this.selectedActivityTypes.filter(x => x !== "*")
      };

      if (this.loading) {
        return;
      }

      this.loading = true;

      try {
        const { response: data } = await this.axios.get(
          `${url}/query`,
          filters
        );
        this.data = response;
      } catch (e) {
        this.error = e.response.data;
      }

      this.loading = false;
    },
    download(data, filename, type) {
      var file = new Blob([data], {type: type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
    }},
      exportCurrentData() {
      if (this.data == undefined){
          return
      }

      this.download(this.data, 'export.json', 'text/plain')
    }
}
  }
};
</script>
