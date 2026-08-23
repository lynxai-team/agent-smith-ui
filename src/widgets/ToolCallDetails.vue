<template>
    <div class="border border-lighter rounded-md border-t-0 border-r-0">
        <div class="flex flex-col h-full">
            <div class="flex flex-row">
                <div class="toolcallbg p-2 border-r border-t border-lighter cursor-pointer"
                    :class="tab == 'call' ? ['border-b-0', 'opacity-60'] : ['border-b', 'text-semilight']"
                    @click="tab = 'call'">
                    <div class="overflow-y-auto slide-y max-w-5xl">Call {{ tool?.type == 'agent' ? ' agent' : '' }}
                    </div>
                </div>
                <div v-if="!(tool?.type == 'agent')"
                    class="toolcallbg p-2 border-r border-t border-lighter cursor-pointer rounded-tr-md"
                    :class="tab == 'response' ? ['border-b-0', 'opacity-60'] : ['border-b', 'text-semilight']"
                    @click="tab = 'response'">
                    <div class="overflow-y-auto max-w-5xl text-success">Response</div>
                </div>
                <div class="overflow-y-auto max-w-5xl text-warning font-semibold flex flex-row space-x-2 items-center pl-3"
                    v-if="!tool?.response">
                    <LoadingSpinner height="24" width="24"></LoadingSpinner>
                    <div>Executing tool ...</div>
                </div>
                <div class="flex grow border-b border-lighter"></div>
            </div>
        </div>
        <div class="toolcallbg border-r border-lighter">
            <div v-if="tab == 'call'" class="border-r border-lighter p-3">
                <template v-if="tool.call?.arguments">
                    <div v-for="[k, v] in Object.entries(tool.call.arguments)" class="flex flex-col space-y-5">
                        <div>
                            <span class="font-bold mr-2 text-accent">{{ k }}</span>
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

<style lang="css">
@reference "../styles/global.css";

.toolcallbg {
    @apply bg-sky-50/50 dark:bg-stone-800/50;
}
</style>