<template>
    <div class="flex flex-col space-y-3">
        <div class="flex flex-row space-x-2 items-center cursor-pointer" @click="toggleToolCallProgress()">
            <ToolsIcon width="24" height="24" class="min-w-12 opacity-50 text-warning">
            </ToolsIcon>
            <LoadingSpinner class="text-light"></LoadingSpinner>
            <div class="w-max">{{ from }}</div>
            <div>=></div>
            <div class="font-semibold text-success">{{ toolCallSpec.name }}</div>
        </div>
        <div v-if="showToolCallProgress" v-html="parseStream()">
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ToolCallSpec } from '@agent-smith/types';
import { ref } from 'vue';
import { uistate } from '../state.js';
import ToolsIcon from '../widgets/icons/ToolsIcon.vue';
import LoadingSpinner from '../widgets/LoadingSpinner.vue';

const props = defineProps<{
    toolCallSpec: ToolCallSpec,
    from: string,
    stream: string,
}>();

const showToolCallProgress = ref(uistate.value.autoOpenTools);

function toggleToolCallProgress() {
    uistate.value.autoOpenTools = !uistate.value.autoOpenTools;
    showToolCallProgress.value = uistate.value.autoOpenTools;
}

function parseStream() {
    const txt = props.stream
    /*.replaceAll('\n', '<br />')
    .replaceAll('\\"', '')
    .replaceAll("\\\\n", "")
    .replaceAll('""', '"')*/
    return txt
}
</script>