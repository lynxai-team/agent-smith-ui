import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HomeView from "./views/HomeView.vue"
import AppView from "./views/AppView.vue";
import WorkflowView from "./views/WorkflowView.vue";

const baseTitle = "Agent Smith";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/config",
    component: () => import("./views/ConfigView.vue"),
    meta: {
      title: "Config"
    }
  },
  {
    path: "/init",
    component: () => import("./views/ConfigInitView.vue"),
    meta: {
      title: "Init"
    }
  },
  {
    path: "/workflow/:name",
    component: WorkflowView,
    meta: {
      title: "Workflow"
    },
    props: true
  },
  {
    path: "/app/:name",
    component: AppView,
    meta: {
      title: "App"
    },
    props: true
  },
  {
    path: "/task/:name",
    component: () => import("./views/TaskRunView.vue"),
    meta: {
      title: "Task: run"
    },
    props: true
  },
  {
    path: "/task/view/:name",
    component: () => import("./views/TaskViewView.vue"),
    meta: {
      title: "Task: view"
    },
    props: (route) => {
      return { name: route.params.name };
    }
  },
  {
    path: "/agent/:name",
    component: () => import("./views/TaskRunView.vue"),
    meta: {
      title: "Agent: run"
    },
    props: (route) => {
      return { name: route.params.name, isAgent: true };
    }
  },
  {
    path: "/agent/view/:name",
    component: () => import("./views/TaskViewView.vue"),
    meta: {
      title: "Agent: view"
    },
    props: (route) => {
      return { name: route.params.name, isAgent: true };
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.afterEach((to, from) => { // eslint-disable-line
  document.title = `${baseTitle} - ${to.meta?.title}`
});

export default router
