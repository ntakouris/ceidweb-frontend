<template>
  <v-col col="12">
      <h2 style="color: red;">Danger Zone</h2>
      <h3>By clicking purge data, you will clear all user upload data. 
          This action is not recoverable.</h3>

        <v-col col="3">
        <v-slider
          v-model="slider"
          label="Enable Button"
        ></v-slider>
        </v-col>

      <v-btn color="error" large :loading="loading" :disabled="slider != 100" @click="purgeData()" class="mt-2">PURGE DATA</v-btn>

      <p class="mt-2">{{ message }}</p>
  </v-col>
</template>

<script>
export default {
  name: 'Purge',
  data() {
      return {
          slider: 0,
          loading: false,
          message: '',
      }
  },
  methods: {
    async purgeData() {
        if (this.loading) {
            return
        }

        try {
            const { response: data } = await this.axios.post('/admin/purge')
            this.message = response;
        } catch (e) {
            this.message = e.message;
        }

        this.loading = false
    }
  }
};
</script>
