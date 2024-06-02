import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layouts/index.vue';
import type { RouteRecordRaw } from 'vue-router';

const routeList: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/charts',
    meta: { title: '主页' },
    children: [
      {
        path: '/charts',
        name: 'Charts',
        component: () => import('@/pages/charts/index.vue'),
        meta: {
          title: '数据配置',
        },
      },
      {
        path: '/board',
        name: 'Board',
        component: () => import('@/pages/board/index.vue'),
        meta: {
          title: '画板',
        },
      },
      {
        path: 'timeFunction',
        name: 'TimeFunction',
        component: () => import('@/pages/animation/timeFunction.vue'),
        meta: { title: '运动-时间函数' },
      },

      {
        path: '/video',
        name: 'Video',
        component: () => import('@/pages/video/index.vue'),
        meta: {
          title: '视频',
        },
      },
      {
        path: '/note',
        name: 'Note',
        component: () => import('@/pages/note/index.vue'),
        meta: {
          title: '笔记',
        },
      },
    ],
  },
  {
    path: '/background',
    name: 'Background',
    component: () => import('@/pages/backgroundColor/index.vue'),
    meta: { title: '背景板' },
  },
  {
    path: '/animation',
    name: 'Animation',
    redirect: '/animation/transition',
    meta: { title: '动画' },
    children: [
      {
        path: 'transition',
        name: 'AnimationTransition',
        component: () => import('@/pages/animation/transition.vue'),
        meta: { title: '运动-过渡' },
      },
      {
        path: 'animation',
        name: 'AnimationAnimation',
        component: () => import('@/pages/animation/animation.vue'),
        meta: { title: '运动-动画' },
      },
      {
        path: 'scrollTrigger',
        name: 'AnimationScrollTrigger',
        component: () => import('@/pages/animation/scrollTrigger.vue'),
        meta: { title: '运动-滚动' },
      },
    ],
  },
  {
    path: '/game',
    name: 'Game',
    redirect: '/game/map',
    meta: { title: '游戏' },
    children: [
      {
        path: 'map',
        name: 'GameMap',
        component: () => import('@/pages/game/map.vue'),
        meta: { title: '游戏-地图' },
      },
      {
        path: 'dino',
        name: 'GameDino',
        component: () => import('@/pages/game/dinoJump.vue'),
        meta: { title: '游戏-恐龙' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routeList,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Hayate';
});

export default router;
