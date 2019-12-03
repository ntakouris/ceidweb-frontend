<template>
  <MasterLayout>
    <router-view></router-view>
  </MasterLayout>
</template>

<script>
import MasterLayout from './components/MasterLayout.vue'
import LoginRegister from './components/LoginRegister.vue';

export default {
  name: 'App',
  components: {
    MasterLayout
  },
};
</script>
