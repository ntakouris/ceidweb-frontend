<template>
  <v-col col="12">
    <input type="file" label="File input" @change="loadDataFromFile" />

    <v-spacer />
    <h3>Click to add area to restrict</h3>
    <div>
      <v-btn small class="mt-2" @click="clearCircles">Clear Markers</v-btn>
    </div>

    <GmapMap
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
    >
      <GmapCircle
        :key="index"
        v-for="(c, index) in circles"
        :strokeColor="c.strokeColor"
        :strokeOpacity="c.strokeOpacity"
        :strokeWeight="c.strokeWeight"
        :fillColor="c.fillColor"
        :fillOpacity="c.fillOpacity"
        :center="c.center"
        :radius="c.radius"
        :clickable="true"
        :editable="true"
        @radius_changed="(e) => { c.radius = e }"
        @center_changed="(e) => { c.center = e }"
      />
    </GmapMap>

    <v-btn :loading="loading" class="mt-2 mb-2" @click="sendData">Upload Data</v-btn>

    <p style="color: red;">{{ error }}</p>
  </v-col>
</template>

<script>
const patrasLat = 38.230462;
const patrasLng = 21.75315;

export default {
  name: "DataUpload",
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      map.addListener("click", e => {
        const clickLoc = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };

        const circle = {
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          center: clickLoc,
          radius: 1000 // this is in meters
        };
        this.circles.push(circle);
      });
    });
  },
  data() {
    return {
      patrasLat: patrasLat,
      patrasLng: patrasLng,
      loading: false,
      error: "",
      rawData: {},
      proccessedData: {},
      filteredData: {},
      circles: [],
      filterCircles: {}
    };
  },
  methods: {
    clearCircles() {
      this.circles = [];
    },
    async loadDataFromFile(ev) {
      this.rawData = undefined;
      const file = ev.target.files[0];
      const reader = new FileReader();
      const that = this
      reader.onload = e => {
        console.log('finished loading')
        var data = JSON.parse(e.target.result);
        console.log(data.locations)
        // filter data out of patras
        // that.rawData = data.locations.filter(
        //   x =>
        //     that.distanceInKmBetweenEarthCoordinates(
        //       x.latitude,
        //       x.longitude,
        //       patrasLat,
        //       patrasLng
        //     ) <= 10
        // );

        that.rawData = data.locations
      };

      console.log(`reading ${file}`)
      reader.readAsText(file);
    },
    async sendData() {
      const that = this
      this.filterCircles = this.circles.map(function(c) {
        return {
          center: {
            lat:
              typeof c.center.lat === "function"
                ? c.center.lat()
                : c.center.lat,
            lng:
              typeof c.center.lng === "function" ? c.center.lng() : c.center.lng
          },
          distanceKm: c.radius * 1000
        }
      })

      console.log('Filtering data to upload to server, circles:')
      console.log(this.circles)

      this.filteredData = this.rawData
      // for (var circle of this.circles) {
      //   this.filteredData = this.rawData.filter(
      //     x =>
      //       that.distanceInKmBetweenEarthCoordinates(
      //         x.latitude,
      //         x.longitude,
      //         circle.lat,
      //         circle.lng
      //       ) <= circle.distanceKm
      //   );
      // }

      console.log(this.filteredData)
      try {
        await this.axios.post("/upload", {locations: this.filteredData});
        console.log('going to dashboard')
        this.$router.replace("/dashboard");
      } catch (e) {
        this.error = e.message;
      }
    },
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    },
    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
      var earthRadiusKm = 6371;

      var dLat = this.degreesToRadians(lat2 - lat1);
      var dLon = this.degreesToRadians(lon2 - lon1);

      lat1 = this.degreesToRadians(lat1);
      lat2 = this.degreesToRadians(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadiusKm * c;
    }
  }
};
</script>
