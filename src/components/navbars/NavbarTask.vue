<template>
    <div class="flex flex-row items-center">
        <button class="btn text-sm py-1 rounded-lg hover:primary" @click="openView('view')">View</button>
        <button class="btn text-sm py-1 rounded-lg hover:primary" @click="openView('run')">Run</button>
    </div>
</template>

<script setup lang="ts">
import type { UiTaskView } from '../../interfaces.js';
import { state, uistate } from '../../state.js';
import { useRouter } from 'vue-router';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    isAgent: {
        type: Boolean,
        default: false,
    }
});

const link = props.isAgent ? "agent" : "task";
const router = useRouter();

function openView(v: UiTaskView) {
    uistate.value.taskView = v;
    if (uistate.value.taskView == "view") {
        router.push(`/${link}/view/${props.name}`)
    } else {
        router.push(`/${link}/${props.name}`)
    }
}

</script>