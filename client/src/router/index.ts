import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import Register from '../views/register.vue';
import Admin from '../views/admin.vue';
import Juejin from '../views/juejin.vue';
import Jd from '../views/jd.vue';
import Setting from '../views/setting.vue';
import Checkin from '../views/checkin.vue';
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
    redirect: '/admin/juejin',
    meta: { title: '后台管理', isAuth: true },
    children: [{
      name: 'juejin',
      path: '/admin/juejin',
      component: Juejin,
      meta: { title: '掘金', subTitle: '摸鱼大本营' }
    }, {
      name: 'jd',
      path: '/admin/jd',
      component: Jd,
      meta: { title: '京东', subTitle: '我的兄弟东哥' }
    }, {
      name: 'setting',
      path: '/admin/setting',
      component: Setting,
      meta: { title: '设置' }
    }, {
      name: 'checkin',
      path: '/admin/checkin',
      component: Checkin,
      meta: { title: '签到记录' }
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