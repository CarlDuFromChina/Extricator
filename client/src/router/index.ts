import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import Register from '../views/register.vue';
import Admin from '../views/admin.vue';
import Signin from '../views/signin.vue';
import store from "../store";

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
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/sign',
    meta: { title: '后台管理', isAuth: true },
    children: [{
      name: 'signin',
      path: '/admin/signin',
      component: Signin,
      meta: { title: '平台签到' }
    }],
    component: Admin
  }
];

export default function() {
  const router = createRouter({
    history: createWebHistory(),
    routes
  });
  router.beforeEach((to, from ,next) => {
    if (to.meta.isAuth && !store.getters.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  })
  return router;
};

export interface RouteMeta {
  title: string,
  subTitle: string,
  isAuth: boolean
}