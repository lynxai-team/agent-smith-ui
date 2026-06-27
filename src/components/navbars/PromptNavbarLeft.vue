<template>
    <div class="flex flex-row text-light">
        <button class="btn px-[0]" v-if="uistate.autoscroll" @click="toggleAutoscroll(false)">
            <ScrollIcon height="32" width="32"></ScrollIcon>
        </button>
        <button class="btn px-[0]" v-else>
            <NoScrollIcon height="32" width="32" @click="toggleAutoscroll(true)"></NoScrollIcon>
        </button>
        <button class="btn px-[0]" v-if="uistate.viewMode == 'markdown'" @click="toggleTextViewMode('text')">
            <MarkdownIcon height="32" width="32"></MarkdownIcon>
        </button>
        <button class="btn px-[0] flex flex-row space-x-2" v-else-if="uistate.viewMode == 'text'"
            @click="toggleTextViewMode('raw')">
            <TextFormatIcon height="32" width="32" class="mt-1"></TextFormatIcon>
        </button>
        <button class="btn px-[0] flex flex-row space-x-2" v-else @click="toggleTextViewMode('markdown')">
            <TextIcon height="32" width="32" class="mt-1"></TextIcon>
        </button>
    </div>
</template>

<script setup lang="ts">
import { uistate } from '../../state.js';
import MarkdownIcon from '../../widgets/icons/MarkdownIcon.vue';
import TextIcon from '../../widgets/icons/TextIcon.vue';
import ScrollIcon from '../../widgets/icons/ScrollIcon.vue';
import NoScrollIcon from '../../widgets/icons/NoScrollIcon.vue';
import { toast } from '../../components/vibe/toast/composable.js';
import TextFormatIcon from '../../widgets/icons/TextFormatIcon.vue';

function toggleTextViewMode(mode: "text" | "markdown" | "raw") {
    uistate.value.viewMode = mode;
    toast.info(`View <b>${mode}</b> mode`);
}

function toggleAutoscroll(mode: boolean) {
    uistate.value.autoscroll = mode;
    toast.info(`Autoscroll <b>${mode}</b>`);
}
</script>