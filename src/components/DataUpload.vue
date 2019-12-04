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
      return;
      this.rawData = undefined;
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        const data = JSON.parse(e.target.result);

        // filter data out of patras
        this.rawData = data.filter(
          x =>
            distanceInKmBetweenEarthCoordinates(
              x.latitude,
              x.longitude,
              patrasLat,
              patrasLng
            ) <= 10
        );
      };
      reader.readAsText(file);
    },
    async sendData() {
      this.filteredData = this.circles.map(function(c) {
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
        };
      });

      for (circle of filterCircles) {
        this.filteredData = filteredData.filter(
          x =>
            distanceInKmBetweenEarthCoordinates(
              x.latitude,
              x.longitude,
              circle.lat,
              circle.lng
            ) <= circle.distanceKm
        );
      }

      try {
        await this.axios.post("/user/upload", filteredData);
        this.$router.replace("/dashboard");
      } catch (e) {
        this.error = e.response.data;
      }
    },
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    },
    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
      var earthRadiusKm = 6371;

      var dLat = degreesToRadians(lat2 - lat1);
      var dLon = degreesToRadians(lon2 - lon1);

      lat1 = degreesToRadians(lat1);
      lat2 = degreesToRadians(lat2);

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
