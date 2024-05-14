import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/index.vue";
import type { RouteRecordRaw } from "vue-router";

const routeList: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/charts",
    meta: { title: "主页" },
    children: [
      {
        path: "/charts",
        name: "Charts",
        component: () => import("@/pages/charts/index.vue"),
        meta: {
          title: "数据配置",
        },
      },
      {
        path: "/board",
        name: "Board",
        component: () => import("@/pages/board/index.vue"),
        meta: {
          title: "画板",
        },
      },
      {
        path: "/video",
        name: "Video",
        component: () => import("@/pages/video/index.vue"),
        meta: {
          title: "视频",
        },
      },
      {
        path: "/note",
        name: "Note",
        component: () => import("@/pages/note/index.vue"),
        meta: {
          title: "笔记",
        },
      },
      {
        path: "/script",
        name: "Script",
        component: () => import("@/pages/script/index.vue"),
        meta: {
          title: "脚本",
        },
      },
    ],
  },
  {
    path: "/background",
    name: "Background",
    component: () => import("@/pages/backgroundColor/index.vue"),
    meta: { title: "背景板" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routeList,
  scrollBehavior() {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

export default router;
