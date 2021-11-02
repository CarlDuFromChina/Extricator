import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import Register from '../views/register.vue';
import Admin from '../views/admin.vue';
import Juejin from '../views/juejin.vue';
import Jd from '../views/jd.vue';
import Setting from '../views/setting.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/juejin',
    children: [{
      name: 'juejin',
      path: '/admin/juejin',
      component: Juejin
    }, {
      name: 'jd',
      path: '/admin/jd',
      component: Jd
    }, {
      name: 'setting',
      path: '/admin/setting',
      component: Setting
    }],
    component: Admin
  }
];

export default function() {
  return createRouter({
    history: createWebHistory(),
    routes
  });
};