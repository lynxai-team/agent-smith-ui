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
    let mod;
    try {
        //console.log("M1");
        mod = await apps[pack]();
        //console.log("M2", mod);
    } catch (e) {
        throw new Error(`loading app ${props.name}: ${e}`);
    }
    //console.log("MOD", mod);
    if (mod?.default) {
        mod = mod.default;
    }
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