<template>
    <div>
        <div v-if="isReady" class="flex flex-col items-start">
            <SwTree :nodes="nodes" :filter="true" @nodeSelect="onNodeSelect"></SwTree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { api } from '../../services/api.js';
import { uistate } from '../../state.js';
import { useRouter } from 'vue-router';
import { transformTasksData } from '../../utils.js';
import SwTree from '../vibe/tree/SwTree.vue';
import type { SwTreeNode } from '../vibe/tree/SwTree.vue';

const agents = ref<Record<string, any>>();
const isReady = ref(false);
const router = useRouter();
const nodes = ref<Array<SwTreeNode>>([]);
const noDisplay = new Array<string>("subagent");

async function loadAgents() {
    const data = await api.get<Record<string, any>>("/agents");
    const ts: Record<string, string> = {};
    for (const [n, t] of Object.entries(data.data)) {
        //console.log("A", "n=", n, "t=", t, "uis=" + uistate.value.availableAgents[n])
        if (t?.category) {
            if (!(n in uistate.value.availableAgents)) {
                uistate.value.availableAgents[n] = t.category.startsWith("internal") ? false : true;
                //console.log("ADD KEY", n, uistate.value.availableAgents[n]);
            }
            if (!noDisplay.includes(t.category) && uistate.value.availableAgents[n] === true) {
                ts[n] = t.category;
            }
        }
    }
    nodes.value = transformTasksData(ts) as Array<SwTreeNode>;
    agents.value = data.data;
    isReady.value = true;
}

function open(tn: string) {
    if (uistate.value.taskView == "run") {
        router.push('/agent/' + tn)
    } else {
        router.push('/agent/view/' + tn)
    }
}

const onNodeSelect = (node: SwTreeNode) => {
    if (!node?.children) {
        const k = node.key;
        //console.log("Open k", k);
        open(k)
    }
};

onBeforeMount(() => loadAgents())
</script>
