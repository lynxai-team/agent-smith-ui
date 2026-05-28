<template>
  <sw-topbar :topbar="topBar" class="z-10 flex items-center w-full h-16" breakpoint="lg">
    <template #mobile-back>
      <i-ion-arrow-back-outline class="inline-flex ml-2 text-3xl" v-if="!isHome"></i-ion-arrow-back-outline>
    </template>
    <template #mobile-branding>
      <div class="inline-flex flex-row items-center h-full pt-1 ml-2 text-2xl truncate">
        <div v-if="['task', 'agent'].includes(state.currentFeature.type)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path
                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor"
                d="M12 4a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M9.354 3c.705-.622 1.632-1 2.646-1s1.94.378 2.646 1H18a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.126 5H6v15h12V5h-2.126q.124.481.126 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6q.002-.519.126-1M8 11a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1" />
            </g>
          </svg>
          {{ state.currentFeature.name }}
        </div>
        <template v-else-if="state.currentFeature.type == 'none'">
          <img alt="" src="@/assets/logo.png" v-if="isHome" class="inline-block mx-3 opacity-35" />
          <span class="text-2xl txt-semilight">Agent Smith</span>
        </template>
      </div>
    </template>
    <template #branding>
      <div class="flex flex-row items-center h-full cursor-pointer">
        <div v-if="state.currentFeature.type == 'none'" @click="router.push('/')">
          <!-- div>
            <img alt="" src="@/assets/logo.png" class="inline-block mx-3 opacity-35" />
          </div -->
          <div v-if="uistate.title == 'Tasks'" class="flex flex-row items-center space-x-3 ml-5">
            <div class="txt-light" @click="goHome()">
              <task-icon width="36" height="36"></task-icon>
            </div>
            <div class="text-2xl txt-semilight">
              {{ uistate.title }}
            </div>
          </div>
          <div v-else-if="uistate.title == 'Agents'" class="flex flex-row items-center space-x-3 ml-5">
            <div class="txt-light" @click="goHome()">
              <agent-icon width="36" height="36"></agent-icon>
            </div>
            <div class="text-2xl txt-semilight">
              {{ uistate.title }}
            </div>
          </div>
          <div v-else-if="uistate.title == 'Workflows'" class="flex flex-row items-center space-x-3 ml-5">
            <div class="txt-light" @click="goHome()">
              <workflow-icon width="36" height="36"></workflow-icon>
            </div>
            <div class="text-2xl txt-semilight">
              {{ uistate.title }}
            </div>
          </div>
          <div v-else v-html="uistate.title"></div>
        </div>
        <div v-else-if="state.currentFeature.type == 'task'"
          class="txt-semilight flex flex-row space-x-3 ml-5 items-center">
          <div class="txt-light" @click="goHome()">
            <task-icon width="36" height="36"></task-icon>
          </div>
          <div class="text-2xl" @click="goHome()">
            {{ humanize(state.currentFeature.name) }}
          </div>
          <navbar-task :name="state.currentFeature.name" class="mt-1" />
        </div>
        <div v-else-if="state.currentFeature.type == 'agent'"
          class="txt-semilight flex flex-row space-x-3 ml-5 items-center">
          <div class="txt-light">
            <agent-icon width="36" height="36" @click="goHome()"></agent-icon>
          </div>
          <div class="text-2xl" @click="goHome()">
            {{ humanize(state.currentFeature.name) }}
          </div>
          <navbar-task :name="state.currentFeature.name" :is-agent="true" class="mt-1" />
        </div>
        <div v-else-if="state.currentFeature.type == 'workflow'"
          class="txt-semilight flex flex-row space-x-3 ml-5 items-center">
          <div class="txt-light">
            <WorkflowIcon width="36" height="36" @click="goHome()"></WorkflowIcon>
          </div>
          <div class="text-2xl" @click="goHome()">
            {{ humanize(state.currentFeature.name) }}
          </div>
        </div>
      </div>
    </template>
    <template #menu>
      <div class="flex flex-row items-center justify-end w-full h-full txt-semilight">
        <template v-if="state.isReady">
          <WorkspacePicker></WorkspacePicker>
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
            <button class="btn" :class="showApps ? 'txt-semilight' : 'txt-light'" @click="toggleApps($event)">
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
        <button class="border-none btn txt-light" @click="router.push('/config')">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="currentColor"
              d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z" />
            <path fill="currentColor"
              d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4" />
          </svg>
        </button>
        <div class="pr-5 text-lg cursor-pointer txt-lighter dark:txt-light" @click="user.toggleDarkMode()">
          <i-fa-solid:moon v-if="!user.isDarkMode.value"></i-fa-solid:moon>
          <i-fa-solid:sun v-else></i-fa-solid:sun>
        </div>
      </div>
    </template>
    <template #mobile-menu>
      <div class="flex flex-col p-3 pb-5 space-y-3 lighter border-y-2 bord-primary">
        <div>
          <button class="border-none btn" @click="router.push('/config'); topBar.closeMenu()">Config</button>
        </div>
        <div class="text-lg cursor-pointer" @click=" user.toggleDarkMode(); topBar.closeMenu()">
          <template v-if="!user.isDarkMode.value">
            <i-fa-solid:moon></i-fa-solid:moon>&nbsp;Dark mode
          </template>
          <template v-else>
            <i-fa-solid:sun></i-fa-solid:sun>&nbsp;Light mode
          </template>
        </div>
      </div>
    </template>
  </sw-topbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const router = useRouter()
const topBar = useTopbar(router);
const apps = ref();
const backends = ref();
const showApps = ref(false);
const showBackends = ref(false);
const isHome = computed<boolean>(() => router.currentRoute.value.path == "/");

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

const backendCls = computed(() => {
  if (Object.keys(state.models).length == 0) {
    return "txt-danger"
  }
  if (showBackends.value) {
    return 'txt-semilight'
  }
  return 'txt-light'
})
</script>

<style lang="sass">
#mobile-menu
  @apply absolute left-0 z-40 flex flex-col w-full space-y-3 text-xl top-16 lighter
*
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
</style>