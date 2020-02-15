<template>
  <v-col col="12">
    <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>

    <div>
      <v-card class="mx-auto" outlined v-if="data.statistics.score">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">Monthly Activity Score</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-text>
        <v-col col="3">
        <p style="display: inline;" class="mr-3">This Month's score <br /></p>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="15"
          :value="data.statistics.score * 100"
          color="primary"
        >{{ Math.trunc(data.statistics.score * 100)}}</v-progress-circular>
        </v-col>
<v-col col="9">
        <pure-vue-chart class="mx-auto"
            :points="data.statistics.scores.map(x => Math.trunc(x * 100))"
            :show-y-axis="true"
            :show-x-axis="true"
            :show-values="true"
            :use-month-labels="true"
            :months="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
        />
</v-col>

        </v-card-text>
      </v-card>

      <v-card class="mx-auto mt-2" outlined v-if="data.statistics.leaderboards">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">Leaderboards</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>

        <v-simple-table
            :fixed-header="fixedHeader"
            >
                <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Score</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.statistics.leaderboards.top" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.score }}</td>
                </tr>
                </tbody>
            </v-simple-table>

        <p class="mt-2">Your position: <b>{{ data.statistics.leaderboards.pos }}</b></p>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto mt-2" outlined v-if="data.statistics.uploads">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">Upload statistics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>

        <p class="mt-2">Dates covered: <b>{{ data.statistics.uploads.range[0] }} -- {{ data.statistics.uploads.range[1] }}</b></p>
        <p class="mt-2">Last upload date: <b>{{ data.statistics.uploads.last }}</b></p>

        </v-card-text>
      </v-card>

      <!-- Admin -->
      <v-card class="mx-auto mt-2" outlined v-if="data.statistics">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">Data statistics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>

         <v-simple-table
            >
                <thead>
                <tr>
                    <th class="text-left">Activity Type</th>
                    <th class="text-left">Percentage</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.statistics.activityType" :key="item.type">
                    <td>{{ item.type }}</td>
                    <td>{{ item.percentage }}</td>
                </tr>
                </tbody>
            </v-simple-table>
            <v-spacer />
            <h2>Per user upload distribution approximation</h2>
            <GChart
            type="LineChart"
            :data="data.statistics.recordsPerUser"
            />

            <v-spacer />
            <h2>Activities uploaded per month</h2>
            <GChart
            type="LineChart"
            :data="data.statistics.recordsPerMonth"
            />
            
          <v-spacer />
            <h2>Activities uploaded per day</h2>
            <GChart
            type="LineChart"
            :data="data.statistics.recordsPerDay"
            />

          <v-spacer />
            <h2>Activities uploaded per hour</h2>
            <GChart
            type="LineChart"
            :data="data.statistics.recordsPerHour"
            />

          <v-spacer />
            <h2>Activities uploaded per year</h2>
            <GChart
            type="LineChart"
            :data="data.statistics.recordsPerYear"
            />
        </v-card-text>
      </v-card>

    </div>
  </v-col>
</template>

<script>
import PureVueChart from 'pure-vue-chart'

export default {
  name: "Dashboard",
  components: {
      PureVueChart
  },
  data() {
    return {
      loading: false,
      error: "",
      data: {
        statistics: {
          activityType:[
            {
              type: "IN_VEHICLE",
              percentage: 20
            },
            {
              type: "ON_BICYCLE",
              percentage: 20
            },
            {
              type: "ON_FOOT",
              percentage: 50
            },
            {
              type: "UNKNOWN",
              percentage: 50
            },
          ],
          recordsPerUser: [
            ['User Count', 'Uploaded Data'],
            ['10', 300],
            ['50', 900],
            ['90', 1000],
            ['3', 2000]
          ],
          recordsPerMonth: [
            ['Month', 'Uploads'],
            ['Jan', 200],
            ['Feb', 300],
            ['Mar', 400],
            ['Apr', 20],
            ['May', 800]
          ],
          recordsPerDay: [
            ['Day', 'Uploads'],
            ['Mon', 200],
            ['Tue', 300],
            ['Wed', 400],
            ['Thu', 20],
            ['Fri', 800]
          ],
          recordsPerHour: [
            ['Hour', 'Uploads'],
            ['12:00', 200],
            ['13:00', 300],
            ['14:00', 400],
            ['15:00', 20],
            ['16:00', 800]
          ],
          recordsPerYear: [
            ['Year', 'Uploads'],
            ['2004', 20000],
            ['2005', 10000],
            ['2010', 50000]
          ]
        }
      }
    };
  },
  async mounted() {
    var admin = this.$route.query.admin;
    admin = admin ? admin : false;

    try {
      this.loading = true;
      console.log('request')
      const { data } = await this.axios.get(`/dashboard?admin=${admin}`);
      console.log(data)
      console.log('loading to .statistics')
      this.data.statistics = data.statistics;
    } catch (e) {
      this.error = e.message
    }

    this.loading = false;
  }
};
</script>
