<template>
  <v-col cols="12">
    <v-col cols="6">
      <v-card class="elevation-12" cols="6">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field label="Username" name="login" type="text" @input="value => { login.username = value }"/>
            <v-text-field label="Password" name="password" type="password" @input="value => { login.password = value }"/>
          </v-form>
          <p style="color: red;">{{ login.error }}</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="loginAsync()" v-if="!loading">Login</v-btn>
          <v-progress-circular
          v-else
        indeterminate
        color="primary"
    ></v-progress-circular>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card class="elevation-12" cols="6">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>or Register</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field label="Username" name="login" type="text" @input="value => { register.username = value }"/>
            <v-text-field label="Full Name" name="fullname" type="text" @input="value => { register.fullname = value }"/>

            <v-text-field label="Email" name="email" type="email" @input="value => { register.email = value }"/>

            <v-text-field id="password" label="Password" name="password" type="password" @input="value => { register.password = value }"/>
          </v-form>
          <p style="color: red;">{{ register.error }}</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="registerAsync()" v-if="!loading">Register</v-btn>
                <v-progress-circular
          v-else
        indeterminate
        color="primary"
    ></v-progress-circular>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-col>
</template>

<script>
export default {
  name: "LoginRegister",
  data() {
    return {
      loading: false,
      login: {
        username: '',
        password: '',
        error: ''
      },
      register: {
        username: '',
        password: '',
        email: '',
        fullname: '',
        error: ''
      }
    };
  },
  methods: {
    async loginAsync () {
      const username = this.login.username
      const pw = this.login.password

      this.axios.defaults.headers.common['Authorization'] = `Basic ${username}:${pw}`;

      try {
        loading = true
        const { response: data } = await this.axios.get('/user/login')
        
        this.$store.commit('setLoggedIn', true, response.admin)
        this.$store.commit('setUserDetails', {
          username: response.username,
          fullname: response.fullname,
          id: response.userId
        })

        this.$router.push({ path: '/dashboard', query: { admin: false }})
      } catch (e) {
        this.login.error = e.response.data
      }

      loading = false
    },
    async registerAsync() {
      this.axios.defaults.headers.common['Authorization'] = `Basic ${username}:${pw}`;

      try {
        loading = true
        const response = await this.axios.post('/user/register', this.register)

        // auto log in
        this.login.username = this.register.username
        this.login.password = this.register.password

        await this.loginAsync()
      } catch (e) {
        this.register.error = e.response.data
      }

      loading = false
    }
  }
};
</script>