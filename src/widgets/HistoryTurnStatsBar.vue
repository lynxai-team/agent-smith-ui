<template>
    <div class="w-full flex flex-col text-sm">
        <div class="w-full max-w-5xl flex flex-row">
            <div class="flex flex-row px-2 space-x-2 w-1/2">
                <div>
                    <span class="opacity-70">{{ stats.prefillTokensPerSecond.toFixed(1) }}</span>
                    <span class="txt-light"> tps </span>
                    <span class="text-orange-400">{{ stats.nPrefillProcessedTokens }}</span>
                    <span class="txt-light">/ </span>
                    <span class="opacity-75">{{ stats.nPrefillTotalTokens }}</span>
                </div>
                <div v-if="stats.percentCache > 0">
                    <span class="txt-semilight">cache </span>
                    <span class="text-green-500">{{ stats.percentCache.toFixed(1) }}% </span>
                    <span class="txt-semilight">{{ stats.nPrefillCacheTokens }}</span>
                </div>
                <div>
                    <span class="txt-semilight" v-html="formatDuration(stats.prefilDuration, 'txt-light')"></span>
                </div>
            </div>
            <div class="flex flex-row px-2 space-x-2 justify-end w-1/2">
                <div>
                    <span class="txt-semilight">Ctx </span>
                    <span class="opacity-75">{{ humanizeNumber(stats.nTotalTokens) }}</span>
                    <span class="txt-semilight"> / </span>
                    <span class="txt-semilight" v-html="humanizeNumber(state.currentModel.ctx, true)"></span>
                </div>
                <div>
                    <span class="opacity-75">{{ stats.emittedTokensPerSecond.toFixed(1) }}</span>
                    <span class="txt-light"> tps </span>
                    <span class="text-sky-500">{{ stats.nEmittedTokens }}</span>
                </div>
                <div v-if="stats.percentDraft > 0">
                    <span class="txt-semilight">draft </span>
                    <span class="text-green-500">
                        {{ stats.percentDraft.toFixed(1) }}%
                    </span>
                    <span class="txt-semilight">{{ stats.nDraftTokensAccepted }}</span>
                </div>
                <div>
                    <span class="txt-semilight" v-html="formatDuration(stats.emitDuration, 'txt-light')"></span>
                </div>
            </div>
        </div>
        <div class="w-full flex flex-row h-1 max-w-5xl space-x-2 opacity-50">
            <div class="flex flex-row text-sm w-1/2 rounded-sm">
                <div v-if="bar.cachePercentWidth > 0" :style="`width:${bar.cachePercentWidth}%`"
                    class="bg-green-400 overflow-hidden"></div>
                <div class="flex-grow bg-orange-300 overflow-hidden flex flex-row items-center"></div>
            </div>
            <div class="overflow-hidden flex flex-row items-center w-1/2 rounded-sm">
                <div v-if="bar.draftPercentWidth > 0" :style="`width:${bar.draftPercentWidth}%`"
                    class="bg-green-500 overflow-hidden">&nbsp;</div>
                <div class="bg-sky-300 flex-grow">&nbsp;</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { InferenceStats } from '@agent-smith/types';
import { reactive } from 'vue';
import { state } from '../state.js';
import { formatDuration, humanizeNumber } from '../services/str.js';

const props = defineProps<{
    //ctx: number,
    stats: InferenceStats
}>();

const bar = reactive({
    draftPercentWidth: props.stats.nDraftTokensAccepted > 0
        ? ((props.stats.nDraftTokensAccepted / props.stats.nEmittedTokens) * 100)
        : 0,
    cachePercentWidth: props.stats.nPrefillCacheTokens > 0
        ? (props.stats.nPrefillCacheTokens / props.stats.nPrefillTotalTokens) * 100
        : 0,
});

//onBeforeMount(() => console.log("STATS", props.stats, "\nBar", bar))
</script>