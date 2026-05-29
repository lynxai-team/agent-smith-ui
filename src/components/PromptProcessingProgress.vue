<template>
    <div class="w-full flex flex-col text-sm">
        <div class="w-full flex flex-row space-y-3">
            <div class="flex flex-row px-2 space-x-2">
                <div class="flex flex-row space-x-2">
                    <div class="txt-semilight">Prefill</div>
                    <div>{{ promptProcessingStats.tps }}</div>
                    <div class="txt-light">tps</div>
                    <div class="flex flex-row">
                        <div class="text-orange-400">{{ promptProcessingStats.total - promptProcessingStats.cache }}
                        </div>
                        <div class="txt-light">/</div>
                        <div class="opacity-75">{{ promptProcessingStats.total }}</div>
                    </div>
                    <div class="txt-semilight"> cache </div>
                    <div class="text-green-500">{{ promptProcessingStats.percent_cache.toFixed(1) }}% </div>
                    <div class="txt-semilight">{{ promptProcessingStats.cache }}</div>
                    <div class="txt-semilight">{{ promptProcessingStats.time_humanized }}</div>
                </div>
            </div>
        </div>
        <div class="w-full flex flex-row h-1 max-w-5xl space-x-2 opacity-50">
            <div class="flex flex-row text-sm w-1/2 rounded-sm">
                <div v-if="promptProcessingStats.percent_progress > 0"
                    :style="`width:${promptProcessingStats.percent_progress}%`" class="flex flex-row overflow-hidden">
                    <div :style="`width:${promptProcessingStats.percent_cache}%`" class="txt-success"></div>
                    <div class="flex-grow text-sky-500"></div>
                </div>
                <div class="flex-grow txt-light overflow-hidden flex flex-row items-center"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { PromptProcessingInProgressStats } from '@agent-smith/types';

const props = defineProps<{
    promptProcessingStats: PromptProcessingInProgressStats
}>();
</script>