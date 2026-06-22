<template>
    <div class="flex flex-col w-full">
        <Popover ref="sidebarDialog">
            <div class="flex flex-row space-x-2">
                <button v-for="sb in sidebars" class="btn" @click="setSidebar(sb); toggleSidebarsDialog($event)">{{ sb
                }}</button>
            </div>
        </Popover>
        <button class="btn" @click="toggleSidebarsDialog($event)">
            <DotsIcon width="24" height="24" class="txt-semilight flex w-full justify-center"></DotsIcon>
        </button>
        <div v-if="uistate.inferenceSidebarName == 'sampling'">
            <SidebarInferParams :inference-params="inferenceParams" @paramchange="changeInferParam($event)">
            </SidebarInferParams>
        </div>
        <div v-else>
            <SidebarHistory @moveto-turn="moveToTurn($event)"></SidebarHistory>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SidebarInferParams from './SidebarInferParams.vue';
import SidebarHistory from './SidebarHistory.vue';
import type { InferenceParams } from '@agent-smith/types';
import DotsIcon from '../../widgets/icons/DotsIcon.vue';
import Popover from 'primevue/popover';
import { uistate } from '../../state.js';

const props = defineProps({
    inferenceParams: {
        type: Object as () => InferenceParams,
        required: true
    }
});

const emit = defineEmits(["goto-turn", "paramchange"]);

const sidebars = ["sampling", "history"]
const sidebarDialog = ref();

const toggleSidebarsDialog = (event) => {
    sidebarDialog.value.toggle(event);
}

function setSidebar(s: string) {
    uistate.value.inferenceSidebarName = s;
}

function moveToTurn(i: number) {
    //console.log("Move to", i);
    emit('goto-turn', i)
}

function changeInferParam(n: any) {
    emit('paramchange', n)
}
</script>