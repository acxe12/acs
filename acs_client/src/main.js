import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import App from './App.vue'
import DashBoard from './components/Dashboard'

const routes = [
  { path: "/", component: DashBoard, props: { isAdmin: false } },
  { path: "/admin", component: DashBoard, props: { isAdmin: true } },
];
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes,
});


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
