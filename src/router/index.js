import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginRegister from '../components/LoginRegister.vue'
import Dashboard from '../components/Dashboard.vue'

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
  }
];

const router = new VueRouter({
  routes,
});

export default router;
