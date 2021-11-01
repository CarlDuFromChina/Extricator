import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import Register from '../views/register.vue';
import Admin from '../views/admin.vue';

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
    component: Admin
  }
];

export default function() {
  return createRouter({
    history: createWebHistory(),
    routes
  });
};