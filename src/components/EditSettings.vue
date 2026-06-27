<template>
    <div class="flex flex-col space-y-3 p-3">
        <div class="text-xl">Agents config</div>
        <div class="flex flex-row items-center space-x-3">
            <button class="btn bord-light text-semilight hover:primary text-sm py-1" @click="expandAll">Expand</button>
            <button class="btn bord-light text-semilight hover:primary text-sm py-1"
                @click="collapseAll">Collapse</button>
        </div>
        <div v-if="isReady" class="flex flex-col items-start">
            <Tree :value="nodes" v-model:expandedKeys="expandedKeys" class="p-0 m-0" selectionMode="single"
                @nodeSelect="onNodeSelect">
                <template #default="slotProps">
                    <div class="flex flex-row items-center space-x-3">
                        <sw-switch v-if="!slotProps.node?.children"
                            v-model:value="uistate.availableAgents[slotProps.node.key]" class="switch-success text-sm">
                            <div class="ml-2">{{ slotProps.node.label }}</div>
                        </sw-switch>
                        <div v-else>
                            {{ slotProps.node.label }}
                        </div>
                    </div>
                </template>
            </Tree>
            <button class="btn mt-5 success" @click="redirectReload()">Apply changes</button>
        </div>
        <div class="flex flex-col space-y-3 w-min">
            <div class="text-xl">Theme</div>
            <ThemeSwitcher></ThemeSwitcher>
        </div>
    </div>
</template>
<script setup lang="ts">
import SwSwitch from "@snowind/switch";
import { onBeforeMount, ref, toRaw } from "vue";
import { uistate } from "../state.js";
import { api } from "../services/api.js";
import { transformTasksData } from "../utils.js";
import type { TreeNode } from 'primevue/treenode';
import Tree from 'primevue/tree';
import { useRouter } from "vue-router";
import ThemeSwitcher from "./ThemeSwitcher.vue";

const isReady = ref(false);
const noDisplay = new Array<string>("subagent");
const agents = ref<Record<string, any>>({});
const nodes = ref<Array<TreeNode>>([]);
const expandedKeys = ref({});
const router = useRouter();

async function loadAgents() {
    const data = await api.get<Record<string, any>>("/agents");
    //console.log("DATA", data);
    const ts: Record<string, string> = {};
    for (const [n, t] of Object.entries(data.data)) {
        if (t?.category) {
            if (!noDisplay.includes(t.category)) {
                ts[n] = t.category
            }
        }
    }
    //console.log("TS", transformTasksData(ts))
    nodes.value = transformTasksData(ts) as Array<TreeNode>;
    agents.value = data.data;
    //console.log("AGENTS 1", agents.value);
    //console.log(agents.value);
}

const onNodeSelect = (node: TreeNode) => {
    if (!node?.children) {
        //open(node.key)
    }
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.children) {
            expandNode(child);
        }
    }
};

const expandAll = () => {
    for (let node of nodes.value) {
        expandNode(node);
    }

    expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
    expandedKeys.value = {};
};

const redirectReload = async () => {
    window.location.href = '/';
}

onBeforeMount(() => {
    loadAgents().then(() => {
        //console.log("AGENTS 2", agents.value);
        for (const [k, v] of Object.entries(toRaw(agents.value))) {
            if (!(k in uistate.value.availableAgents)) {
                let activateDefault = true;
                //console.log("A", k, v)
                if (v?.category == "internal") {
                    activateDefault = false;
                }
                uistate.value.availableAgents[k] = activateDefault
            }
        }
        isReady.value = true;
    })
})
</script>