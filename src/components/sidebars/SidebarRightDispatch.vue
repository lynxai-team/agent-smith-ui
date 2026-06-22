<template>
    <div class="flex flex-col">
        <div class="flex flex-row space-x-2">
            <button v-for="sb in sidebars" class="btn" @click="sidebar = sb">{{ sb }}</button>
        </div>
        <div v-if="sidebar == 'sampling'">
            <SidebarInferParams :inference-params="inferenceParams"></SidebarInferParams>
        </div>
        <div v-else>
            <SidebarHistory></SidebarHistory>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SidebarInferParams from './SidebarInferParams.vue';
import SidebarHistory from './SidebarHistory.vue';
import type { InferenceParams } from '@agent-smith/types';

const props = defineProps({
    inferenceParams: {
        type: Object as () => InferenceParams,
        required: true
    }
});

const sidebar = ref("sampling");
const sidebars = ["sampling", "history"]
</script>