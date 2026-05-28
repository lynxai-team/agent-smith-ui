<template>
    <div class="p-3">
        <div v-if="isReady" class="flex flex-col items-start">
            <button class="btn hover:secondary" v-for="workflow in workflows" @click="open(workflow.name)">
                {{ humanize(workflow.name) }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { api } from '../../services/api.js';
import { humanize } from '../../services/str.js';
import { uistate } from '../../state.js';
import { useRouter } from 'vue-router';

const workflows = ref<Record<string, any>>();
const isReady = ref(false);
const router = useRouter();

async function loadWorkflows() {
    const data = await api.get<Record<string, any>>("/workflows");
    workflows.value = data.data;
    console.log(workflows.value);
    isReady.value = true;
}

function open(w: string) {
    router.push('/workflow/' + w)
}

onBeforeMount(() => loadWorkflows())
</script>