<template>
    <div class="p-5 mt-24 flex flex-col items-center w-full">
        <div class="text-3xl">Welcome to Agent Smith</div>
        <div class="mt-12" v-if="view == 'start'">
            <button class="btn success" @click="createConf()">Create config</button>
        </div>
        <div v-else-if="view == 'create'" class="mt-12 flex flex-col space-y-12 items-center">
            <div>Configuration created at {{ confPath }}</div>
            <div>
                <button class="btn success w-max" @click="redirectReload()" :disabled="isProcessing"
                    :class="isProcessing ? 'cursor-wait' : ''">Next:
                    install
                    plugins</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '../services/api.js';
import type { ConfigFile } from "@agent-smith/types";
import { state } from '../state.js';

const view = ref<"start" | "create" | "install">("start");
const confPath = ref("");
const isProcessing = ref(false);

const redirectReload = async () => {
    isProcessing.value = true;
    state.hasConfig = true;
    window.location.href = '/?redirect=config&plugins=1';
}

async function createConf() {
    //console.log("CREATE");
    const res = await api.get<ConfigFile>("/conf/create");
    if (!res.ok) {
        console.error(res)
        return
        //throw new Error(res.text)
    }
    confPath.value = res.text;
    view.value = "create";
    //console.log("CREATE END");
}
</script>