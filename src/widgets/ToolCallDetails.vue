<template>
    <div class="border bord-lighter rounded-md border-t-0 border-r-0">
        <div class="flex flex-col h-full">
            <div class="flex flex-row">
                <div class="toolcallbg p-2 border-r border-t bord-lighter cursor-pointer"
                    :class="tab == 'call' ? ['border-b-0', 'opacity-60'] : ['border-b', 'txt-semilight']"
                    @click="tab = 'call'">
                    <div class="overflow-y-auto slide-y max-w-5xl">Call {{ tool?.type == 'agent' ? ' agent' : '' }}
                    </div>
                </div>
                <div v-if="!(tool?.type == 'agent')"
                    class="toolcallbg p-2 border-r border-t bord-lighter cursor-pointer rounded-r-md"
                    :class="tab == 'response' ? ['border-b-0', 'opacity-60'] : ['border-b', 'txt-semilight']"
                    @click="tab = 'response'">
                    <div class="overflow-y-auto max-w-5xl txt-success">Response</div>
                </div>
                <div class="overflow-y-auto max-w-5xl txt-warning font-semibold flex flex-row space-x-2 items-center pl-3"
                    v-if="!tool?.response">
                    <LoadingSpinner height="24" width="24"></LoadingSpinner>
                    <div>Executing tool ...</div>
                </div>
                <div class="flex flex-grow border-b bord-lighter"></div>
            </div>
        </div>
        <div class="toolcallbg border-r bord-lighter">
            <div v-if="tab == 'call'" class="border-r bord-lighter p-3">
                <template v-if="tool.call?.arguments">
                    <div v-for="[k, v] in Object.entries(tool.call.arguments)" class="flex flex-col space-y-5">
                        <div>
                            <span class="font-bold mr-2 txt-accent">{{ k }}</span>
                            <span v-html="v.replaceAll('\n', '<br />')"></span>
                        </div>
                    </div>
                </template>
            </div>
            <div v-else class="p-3">
                <div v-if="tool?.response" v-html="tool?.response.replaceAll('\n', '<br />')"></div>
                <div v-else-if="!(tool?.type == 'agent')">Tool call in progress ...</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ToolTurn } from '@agent-smith/types';
import { ref, watchEffect } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
    tool: {
        type: Object as () => ToolTurn,
        required: true
    },
});

const tab = ref<"call" | "response">(props.tool?.response ? "response" : "call");

watchEffect(() => {
    if (props.tool?.response) {
        tab.value = props.tool.response
    }
})
</script>

<style lang="sass">
.toolcallbg
    @apply bg-sky-50 dark:bg-stone-800 bg-opacity-50
</style>