<template>
    <div>
        {{ wf }}
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { srv, state, uistate } from '../state.js';

// @ts-ignore
const props = defineProps({
    name: String,
    required: true,
})

const wf = ref();
const name = ref("");

async function load() {
    const res = await srv.loadWorkflow(props.name);
    console.log(res);
    wf.value = res;
    name.value = props.name;
    uistate.value.title = "Workflows";
}

watchEffect(() => {
    if (name.value != props.name) {
        load()
    }
})

onBeforeMount(() => load());
</script>