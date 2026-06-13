<template>
    <div>
        <div v-if="isReady" class="flex flex-col items-start">
            <Tree :value="nodes" :filter="true" filterMode="lenient" class="p-0 m-0" selectionMode="single"
                @nodeSelect="onNodeSelect">
            </Tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { api } from '../../services/api.js';
import { uistate } from '../../state.js';
import { useRouter } from 'vue-router';
import { transformTasksData } from '../../utils.js';
import type { TreeNode } from 'primevue/treenode';
import Tree from 'primevue/tree';

const agents = ref<Record<string, any>>();
const isReady = ref(false);
const router = useRouter();
const nodes = ref<Array<TreeNode>>([]);
const noDisplay = new Array<string>("subagent");

async function loadAgents() {
    const data = await api.get<Record<string, any>>("/agents");
    const ts: Record<string, string> = {};
    for (const [n, t] of Object.entries(data.data)) {
        //console.log("A", n, t, uistate.value.availableAgents[n])
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
    //console.log("TS", transformTasksData(ts))
    nodes.value = transformTasksData(ts) as Array<TreeNode>;
    agents.value = data.data;
    //console.log("SB", agents.value);
    isReady.value = true;
}

function open(tn: string) {
    if (uistate.value.taskView == "run") {
        router.push('/agent/' + tn)
    } else {
        router.push('/agent/view/' + tn)
    }
}

const onNodeSelect = (node: TreeNode) => {
    if (!node?.children) {
        open(node.key)
    }
};

onBeforeMount(() => loadAgents())
</script>
