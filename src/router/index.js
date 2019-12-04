import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginRegister from '../components/LoginRegister.vue'
import Dashboard from '../components/Dashboard.vue'
import Purge from '../components/Purge.vue'
import DataUpload from '../components/DataUpload.vue'
import DataQueries from '../components/DataQueries.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'loginregister',
    component: LoginRegister,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/admin/purge',
    name: 'purge',
    component: Purge
  },
  {
    path: '/user/upload',
    name: 'userupload',
    component: DataUpload
  },
  {
    path: '/queries',
    name: 'queries',
    component: DataQueries
  }
];

const router = new VueRouter({
  routes,
});

export default router;
