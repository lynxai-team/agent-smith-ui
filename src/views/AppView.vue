<template>
    <div v-if="isReady">
        <component :is="currentComponent" :msg="msg" :state="state" :uistate="uistate"></component>
    </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, shallowRef } from 'vue';
import { appSidebar, state, uistate } from '../state.js';
import { msg } from '../services/notify.js';

const props = defineProps({
    name: {
        required: true,
        type: String,
    }
});

const currentComponent = shallowRef();
const isReady = ref(false);

const loadComponent = async () => {
    const apps = import.meta.glob('../apps/*' /* @vite-ignore */,);
    //console.log("APPS", apps);
    const pack = "../apps/" + props.name + ".js";
    //console.log("P", pack);
    let mod = await apps[pack]();
    if (mod?.default) {
        mod = mod.default;
    }
    //console.log("MOD", mod);
    currentComponent.value = mod.AppComponent;
    if (mod?.AppSidebar) {
        appSidebar.value = mod.AppSidebar;
    }
};

onBeforeMount(() => {
    console.log("Loading app", props.name);
    loadComponent().then(c => isReady.value = true);
});

onBeforeUnmount(() => appSidebar.value = null);
</script>