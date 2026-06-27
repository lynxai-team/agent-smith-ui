<template>
  <div class="z-10 flex items-center w-full h-16">
    <div class="flex flex-row items-center cursor-pointer h-full">
      <div v-if="state.currentFeature.type == 'none'" @click="router.push('/')" class="flex flex-row items-center">
        <div v-if="router.currentRoute.value.path == '/'" class="flex flex-row items-center space-x-3">
          <div>
            <img alt="" src="@/assets/logo.png" v-if="isHome" class="inline-block mx-3 opacity-35" />
          </div>
          <div class="text-2xl text-semilight">Agent&nbsp;Smith</div>
        </div>
        <div v-else-if="uistate.title == 'Agents'" class="flex flex-row items-center space-x-3 ml-5">
          <div class="" @click="goHome()">
            <agent-icon width="36" height="36"></agent-icon>
          </div>
          <div class="text-2xl text-semilight">
            {{ uistate.title.replaceAll(' ', '&nbsp;') }}
          </div>
        </div>
        <div v-else-if="uistate.title == 'Workflows'" class="flex flex-row items-center space-x-3 ml-5">
          <div class="" @click="goHome()">
            <workflow-icon width="36" height="36"></workflow-icon>
          </div>
          <div class="text-2xl text-semilight">
            {{ uistate.title.replaceAll(' ', '&nbsp;') }}
          </div>
        </div>
        <div v-else v-html="uistate.title.replaceAll(' ', '&nbsp;')"></div>
      </div>
      <div v-else-if="state.currentFeature.type == 'agent'"
        class="text-semilight flex flex-row space-x-3 ml-5 items-center">
        <div class="">
          <agent-icon width="36" height="36" @click="goHome()"></agent-icon>
        </div>
        <div class="text-2xl" @click="goHome()">
          {{ humanize(state.currentFeature.name) }}
        </div>
        <navbar-task :name="state.currentFeature.name" :is-agent="true" class="mt-1" />
      </div>
      <div v-else-if="state.currentFeature.type == 'workflow'"
        class="text-semilight flex flex-row space-x-3 ml-5 items-center">
        <div class="">
          <WorkflowIcon width="36" height="36" @click="goHome()"></WorkflowIcon>
        </div>
        <div class="text-2xl" @click="goHome()">
          {{ humanize(state.currentFeature.name) }}
        </div>
      </div>
    </div>
    <div class="flex flex-row items-center grow justify-end h-full">
      <template v-if="state.isReady">
        <WorkspacePicker :show-workspace="openWorkspace"></WorkspacePicker>
        <SamplingPresets></SamplingPresets>
        <div>
          <button class="btn" :class="backendCls" @click="toggleBackends($event)">
            <BackendIcon width="32" height="32"></BackendIcon>
          </button>
          <Popover ref="backends" @hide="showBackends = false">
            <ManageBackends class="min-w-[18rem]" @end="toggleBackends($event)"></ManageBackends>
          </Popover>
        </div>
        <div v-if="conf?.apps">
          <button class="btn" :class="showApps ? 'text-semilight' : ''" @click="toggleApps($event)">
            <apps-icon width="32" height="32"></apps-icon>
          </button>
          <Popover ref="apps" @hide="showApps = false">
            <div class="flex flex-col space-y-2">
              <button class="btn" v-for="(v, k) in conf.apps" @click="goApp(k)">
                {{ humanize(k) }}
              </button>
            </div>
          </Popover>
        </div>
      </template>
      <button class="border-none btn " @click="router.push('/config')">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path fill="currentColor"
            d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z" />
          <path fill="currentColor"
            d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4" />
        </svg>
      </button>
      <div class="pr-3 text-lg cursor-pointer  dark:" @click="user.toggleDarkMode()">
        <MoonIcon width="24" height="24" v-if="!user.isDarkMode.value"></MoonIcon>
        <SunIcon width="24" height="24" v-else></SunIcon>
      </div>
      <div class="pr-5 cursor-pointer " @click="toggleRightSidebar()">
        <SidebarIcon width="32" height="32"></SidebarIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { SwTopbar, useTopbar } from "@snowind/header";
import { useRouter } from 'vue-router';
import { resetCurrentFeature, user, state, conf, uistate } from '@/state.js';
import { humanize } from '../services/str.js';
import NavbarTask from './navbars/NavbarTask.vue';
import TaskIcon from '../widgets/icons/TaskIcon.vue';
import AgentIcon from '../widgets/icons/AgentIcon.vue';
import AppsIcon from '../widgets/icons/AppsIcon.vue';
import Popover from 'primevue/popover';
import WorkflowIcon from '../widgets/icons/WorkflowIcon.vue';
import BackendIcon from '../widgets/icons/BackendIcon.vue';
import ManageBackends from './ManageBackends.vue';
import WorkspacePicker from './WorkspacePicker.vue';
import SamplingPresets from './SamplingPresets.vue';
import SidebarIcon from '../widgets/icons/SidebarIcon.vue';
import MoonIcon from '../widgets/icons/MoonIcon.vue';
import SunIcon from '../widgets/icons/SunIcon.vue';

const router = useRouter()
const topBar = useTopbar(router);
const apps = ref();
const backends = ref();
const showApps = ref(false);
const showBackends = ref(false);
const isHome = computed<boolean>(() => router.currentRoute.value.path == "/");
const openWorkspace = ref(false);

const toggleApps = (event) => {
  apps.value.toggle(event);
  showApps.value = !showApps.value;
}

const toggleBackends = (event) => {
  backends.value.toggle(event);
  showBackends.value = !showBackends.value
}

function goHome() {
  router.push("/");
  resetCurrentFeature()
}

function goApp(name: string) {
  toggleApps(null);
  router.push(`/app/${name}`);
}

function toggleRightSidebar() {
  if (uistate.value.inferenceSidebar == "none") {
    uistate.value.inferenceSidebar = "full"
  } else if (uistate.value.inferenceSidebar == "full") {
    uistate.value.inferenceSidebar = "mini"
  } else if (uistate.value.inferenceSidebar == "mini") {
    uistate.value.inferenceSidebar = "none"
  }
}

async function redirOpts() {
  const q = router.currentRoute.value.query;
  if (q?.workspace) {
    if (q.workspace.toString() == "1") {
      openWorkspace.value = true
    }
  }
}

const backendCls = computed(() => {
  if (Object.keys(state.models).length == 0) {
    return "text-danger"
  }
  if (showBackends.value) {
    return 'text-semilight'
  }
  return ''
})

onBeforeMount(() => redirOpts())
</script>

<style lang="sass">
#mobile-menu
  @apply absolute left-0 z-40 flex flex-col w-full space-y-3 text-xl top-16 lighter
*
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
</style>