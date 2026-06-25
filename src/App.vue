<template>
  <div class="h-full w-full" :class="`theme-${theme}`">
    <template v-if="state.hasConfig">
      <the-header class="h-16 background fixed top-0 left-0 border-b bord-lighter"></the-header>
      <div class="fixed left-0 top-16 w-full h-main">
        <SidebarsDispatch class="w-[15rem] fixed left-0 top-16 overflow-y-auto h-main"></SidebarsDispatch>
        <router-view class="fixed left-[15rem] top-16 h-main min-w-main"></router-view>
      </div>
    </template>
    <router-view v-else class="container mx-auto w-full h-full"></router-view>
    <Toast />
    <ConfirmDialog>
      <template #message="slotProps">
        <div class="flex flex-row items-center p-4">
          <!-- div>
          <named-icon :icon="`${slotProps.message.icon}`" class="text-3xl"></named-icon>
        </div -->
          <div class="pl-2">{{ slotProps.message.message }}</div>
        </div>
      </template>
    </ConfirmDialog>
    <SwToast :toasts="toasts" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import TheHeader from "@/components/TheHeader.vue";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { initNotifyService } from "@/services/notify.js";
import { initState, state, theme } from './state.js';
// @ts-ignore
import "@fontsource/roboto";
import SidebarsDispatch from './components/sidebars/SidebarsDispatch.vue';
import { useRouter } from 'vue-router';
import SwToast from './components/vibe/toast/SwToast.vue';
import { toasts } from "./components/vibe/toast/composable.js";

const router = useRouter();

onBeforeMount(() => {
  initState().then(r => {
    if (!state.hasConfig) {
      router.push("/init")
    }
  });
  initNotifyService();
});
</script>

<style lang="scss">
@use "./scss/main.scss";

.h-main {
  height: calc(100% - 4rem);
}

.mh-main {
  min-height: calc(100% - 4rem);
  max-height: calc(100% - 4rem);
}

.w-main {
  width: calc(100% - 15rem)
}

.min-w-main {
  width: calc(100% - 15rem)
}

.mdr {
  --ms-flow-paragraph-y: 0 !important
}
</style>

<style lang="sass">
.p-tree, .p-tree-filter-input
    background-color: transparent !important
    border-top: 0
    border-right: 0
    border-left: 0
    box-shadow: none
    border-radius: 0
.dark .p-tree-node-label
    color: white !important
.p-inputtext, .p-overlaypanel-content
  @apply background bord-lighter
.p-overlaypanel-content
  @apply dark:bord-lighter border
.h-main
  height: calc( 100% -  4rem)
.p-confirmdialog-accept-button
  @apply success bord-success
.p-confirmdialog-reject-button
  @apply bord-danger danger p-3
.dark .p-textarea
  background: transparent
  color: white
.dark .p-inputnumber-increment-button, .dark .p-inputnumber-decrement-button
  border: transparent
.btn.soft
  @apply border bord-lighter txt-light hover:primary
</style>
