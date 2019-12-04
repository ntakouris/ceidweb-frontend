<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerRight" app clipped right >
      <v-list dense>
            <v-list-item @click.stop="logout()">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-right color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-if="!loggedIn">Please log in or register to view data</v-toolbar-title>
      <v-toolbar-title v-else>Hello {{ userDetails.fullname }}</v-toolbar-title>

      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" v-if="loggedIn"/>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Google Takeout Vis
          </v-list-item-title>
          <v-list-item-subtitle>
            By Ntakours + Livogiannis
          </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>

    <div >
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="subtitle">
            User
          </v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

            <v-list-item @click.stop="navigate('/dashboard')">
            <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>User Dashboard</v-list-item-title>
            </v-list-item-content>
            </v-list-item>

            <v-list-item  @click.stop="navigate('/user/upload')">
            <v-list-item-action>
                <v-icon>mdi-cloud-upload</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Upload Data</v-list-item-title>
            </v-list-item-content>
            </v-list-item>

            <v-list-item  @click.stop="navigate('/queries')">
            <v-list-item-action>
                <v-icon>mdi-magnify</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Explore User Data</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </div>

        <div >
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="subtitle">
            Admin
          </v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

            <v-list-item  @click.stop="navigate('/dashboard?admin=true')">
            <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Admin Dashboard</v-list-item-title>
            </v-list-item-content>
            </v-list-item>

            <v-list-item  @click.stop="navigate('/queries?admin=true')">
            <v-list-item-action>
                <v-icon>mdi-magnify</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Explore All Data</v-list-item-title>
            </v-list-item-content>
            </v-list-item>

            <v-list-item  @click.stop="navigate('/admin/purge')">
            <v-list-item-action>
                <v-icon>mdi-delete</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Clear DB</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </div>

        </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <v-row justify="center" align="center">
            <slot />
        </v-row>
      </v-container>
    </v-content>

    <v-navigation-drawer v-model="right" fixed right temporary />
  </v-app>
</template>

<script>
export default {
  name: "MasterLayout",
  data: () => ({
    drawer: null,
    drawerRight: null,
    right: false,
    left: false
  }),
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    userDetails() {
      return this.$store.state.details;
    }
  },
  methods: {
    logout() {
      this.axios.defaults.headers.common['Authorization'] = '';
      this.$store.commit('setLoggedIn', false, false)

      this.$router.replace('/')
    },
    navigate(route) {
      this.$router.push(route)
    }
  }
};
</script>
