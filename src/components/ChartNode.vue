<template>
    <div class="max-h-150">
        <canvas :id="id" v-if="isValid">
        </canvas>
        <div v-else-if="node" class="text-semilight">
            Creating chart, emiting {{ nChars }} characters...
        </div>
    </div>
</template>

<script setup lang="ts">
import Chart, { type ChartConfiguration } from 'chart.js/auto';
import { nextTick, onBeforeMount, ref, watchEffect } from 'vue';

const props = defineProps<{
    node?: {
        type: 'chart'
        raw?: string,
        content?: string
        loading?: boolean
    }
    customId?: string
    isDark?: boolean
}>()

const id = ref("");
const isValid = ref(false);
const isChartRendered = ref(false);
const nChars = ref(0);

watchEffect(() => {
    if (isChartRendered.value === true) {
        return
    }
    //console.log("NODE", props.node);
    if (!props?.node) {
        return
    }
    nChars.value = props?.node?.content?.length ?? 0;
    //console.log("NODE", props.node);
    if (props.node?.loading === true) {
        return
    }
    if (props.node?.raw !== undefined) {
        if (!props.node.raw.endsWith("</chart>")) {
            return
        }
    }
    //console.log("NODE", props.node);
    //@ts-ignore
    if (!props.node?.content) {
        return
    }
    let content: Record<string, any> = {};
    try {
        //@ts-ignore
        content = JSON.parse(props.node.content);

    } catch (err) {
        console.error("ERR", err);
        console.log("DATA", props.node.content)
        return
    }
    isValid.value = true;
    nextTick(() => {
        //console.log("Display chart", id);
        //console.log(props.node);        
        new Chart(id.value, content as ChartConfiguration);
        isChartRendered.value = true
    })
});

onBeforeMount(() => id.value = crypto.randomUUID());
</script>