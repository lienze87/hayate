import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/index.vue";

const routeList = [
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
    ],
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
