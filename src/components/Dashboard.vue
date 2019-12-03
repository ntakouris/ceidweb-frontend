<template>
  <v-col col="12">
    <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>

    <div v-else>
      <v-card class="mx-auto" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">Monthly Activity Score</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-text>
        <v-col col="3">
        <p style="display: inline;" class="mr-3">This Month's score</p>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="15"
          :value="data.score"
          color="primary"
        >{{ data.score }}</v-progress-circular>
        </v-col>
<v-col col="9">
        <pure-vue-chart class="mx-auto"
            :points="data.scores"
            :show-y-axis="true"
            :show-x-axis="true"
            :show-values="true"
            :use-month-labels="true"
            :months="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
        />
</v-col>

        </v-card-text>
      </v-card>

      <v-card class="mx-auto mt-2" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">Leaderboards</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>

        <v-simple-table
            :dense="dense"
            :fixed-header="fixedHeader"
            :height="height"
            >
                <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Score</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.leaderboards.top" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.score }}</td>
                </tr>
                </tbody>
            </v-simple-table>

        <p class="mt-2">Your position: <b>{{ data.leaderboards.pos }}</b></p>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto mt-2" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">Upload statistics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>

        <p class="mt-2">Dates covered: <b>{{ uploadRanges[0] }} -- {{ uploadRanges[1] }}</b></p>
        <p class="mt-2">Last upload date: <b>{{ lastUpload }}</b></p>

        </v-card-text>
      </v-card>
    </div>
  </v-col>
</template>

<script>
import PureVueChart from 'pure-vue-chart';

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
        score: 50,
        scores: [50, 60, 99, 20, 30, 40, 50, 10, 90, 50],
        leaderboards: {
            top: [
                {
                    name: "Alex B.",
                    score: 99
                },
                {
                    name: "Bob C.",
                    score: 90
                },
                {
                    name: "Chris D.",
                    score: 90
                }
            ],
            pos: 102
        },
        uploads: {
            range: [1475399294, 1575399294],
            last: 1575379294
        }
      }
    };
  },
  computed: {
      uploadRanges(){
          return this.data.uploads.range.map(x => new Date(x).toDateString())
      },
      lastUpload(){
        return new Date(this.data.uploads.last).toDateString()
      }
  },
  async mounted() {
    var admin = this.$route.query.admin;
    admin = admin ? admin : false;

    const url = admin ? "admin" : "user";
    return;

    try {
      loading = true;
      //const { response: data } = await this.axios.get(`/${url}/dashboard`);

      this.data = response;
    } catch (e) {
      this.register.error = e.response.data;
    }

    loading = false;
  }
};
</script>
