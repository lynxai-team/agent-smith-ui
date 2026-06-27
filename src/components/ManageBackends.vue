<template>
    <div class="flex flex-col space-y-3">
        <button v-for="(v, k) in state.backends" class=" btn flex flex-row space-x-2 items-center" @click="change(k)">
            <div v-if="v.isDefault && Object.keys(state.models).length > 0" class="rounded-full success w-5 h-5"></div>
            <div v-else class="w-5 h-5"></div>
            <div>{{ k }}</div>
            <div class="text-semilight">{{ v.type }}</div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { msg } from '../services/notify.js';
import { srv, state, uistate } from '../state.js';

const emit = defineEmits(["end"]);

async function change(name: string) {
    console.log("Loading backend", name);
    try {
        const old = uistate.value.backend;
        const ok = await srv.setBackend(name);
        if (ok) {
            state.backends[old].isDefault = false;
            state.backends[name].isDefault = true;
            uistate.value.backend = name;
        }
    } catch (e) {
        throw e
    }
    let m: Record<string, any> = {};
    try {
        m = await srv.loadModels(name);
        state.models = m;
    } catch (e) {
        msg.error("Can not load models", "Check you backend server")
    }
    msg.success(`Default backend set to ${name}`, `The backend ${uistate.value.backend} is ready`);
    emit("end");
}
</script>