import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layouts/index.vue';

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
        path: '/gradient',
        name: 'Gradient',
        component: () => import('@/pages/gradient/index.vue'),
        meta: {
          title: '颜色渐变',
        },
      },
      {
        path: '/board',
        name: 'Board',
        component: () => import('@/pages/board/brush.vue'),
        meta: {
          title: '画板',
        },
      },
      {
        path: '/animationNav',
        name: 'AnimationNav',
        component: () => import('@/pages/animation/index.vue'),
        meta: {
          title: '动画',
        },
      },
      {
        path: '/gameNav',
        name: 'GameNav',
        component: () => import('@/pages/game/index.vue'),
        meta: {
          title: '游戏',
        },
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
      {
        path: 'timeFunction',
        name: 'TimeFunction',
        component: () => import('@/pages/animation/timeFunction.vue'),
        meta: { title: '运动-时间函数' },
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
        path: 'dino',
        name: 'GameDino',
        component: () => import('@/pages/game/dinoJump.vue'),
        meta: { title: '游戏-恐龙' },
      },
      {
        path: 'reel',
        name: 'GameReel',
        component: () => import('@/pages/game/reel.vue'),
        meta: { title: '游戏-卷轴' },
      },
      {
        path: 'collision',
        name: 'GameCollision',
        component: () => import('@/pages/game/collision.vue'),
        meta: { title: '游戏-碰撞' },
      },
      {
        path: 'star',
        name: 'GameStar',
        component: () => import('@/pages/game/star.vue'),
        meta: { title: '游戏-星星' },
      },
      {
        path: 'map',
        name: 'GameMap',
        component: () => import('@/pages/game/map.vue'),
        meta: { title: '游戏-地图' },
      },
      {
        path: 'smooth',
        name: 'GameSmooth',
        component: () => import('@/pages/game/smooth.vue'),
        meta: { title: '游戏-平滑' },
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
