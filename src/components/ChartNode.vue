<template>
    <div class="max-h-150">
        <canvas :id="id" v-if="isValid"></canvas>
    </div>
</template>

<script setup lang="ts">
import { type ParsedNode } from 'markstream-vue'
import Chart, { type ChartConfiguration } from 'chart.js/auto';
import { nextTick, ref, watchEffect } from 'vue';

const props = defineProps({
    node: {
        type: Object as () => ParsedNode,
    },
});

const id = crypto.randomUUID();
const isValid = ref(false);

watchEffect(() => {
    if (!props?.node) {
        return
    }
    if (props.node?.loading === true) {
        return
    }
    if (!props.node.raw.endsWith("</chart>")) {
        return
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
    }
    //@ts-ignore
    //console.log("CONTENT", content);
    //console.log("EL", id);
    isValid.value = true;
    nextTick(() => new Chart(id, content as ChartConfiguration))

})
</script>