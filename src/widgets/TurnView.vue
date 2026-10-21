<template>
    <div class="flex flex-col">
        <div class="flex flex-row" v-if="canViewHistoryTurn">
            <a :id="`turn-${index}`"></a>
            <div class="grow">
                <TurnTitle name="user" v-if="index == 0"></TurnTitle>
                <TurnTitle :name="turn.from" v-else-if="((prevFrom != turn.from) && (uistate.historyViewMode == 'plain'))
                    || index == 1" class="pt-3">
                </TurnTitle>
                <div v-if="turn?.user" class="p-3">
                    <!-- MarkdownRender :content="turn.user" v-if="uistate.viewMode == 'markdown'" / -->
                    <div class="text-semilight" v-html="turn.user.replaceAll('\n', '<br />')"></div>
                </div>
                <div v-if="turn?.prefillStats" class="pl-3">
                    <PromptProcessingProgress v-if="turn.prefillStats.total > 0"
                        :prompt-processing-stats="turn.prefillStats">
                    </PromptProcessingProgress>
                </div>
                <div v-if="turn?.think" class="pb-2 px-2">
                    <ThinkingContent :content="turn.think" :from="turn.from"></ThinkingContent>
                </div>
                <div v-if="turn?.assistant" class="px-3 pb-3 flex flex-col space-y-3">
                    <MarkdownRender v-if="uistate.viewMode == 'markdown'" :content="turn.assistant" class="mdr"
                        :typewriter="true" custom-id="assistant" :custom-html-tags="customHtmlTags" />
                    <div v-else-if="uistate.viewMode == 'text'" v-html="turn.assistant.replaceAll('\n', '<br />')"></div>
                    <div v-else>
                        <pre>{{ turn.assistant }}</pre>
                    </div>
                </div>
                <div v-if="turn?.tools" class="flex flex-col">
                    <div v-for="tool in turn.tools" class="flex flex-col px-3">
                        <FormatedToolCall :tool="tool" :turn="turn" class="cursor-pointer"
                            :class="index == (turn.tools.length - 1) ? 'mb-1' : 'mb-3'"
                            @click="toggleViewToolResult(tool.call.id)">
                        </FormatedToolCall>
                        <div v-if="tool.call.id in turn.state.confirmToolCalls" class="flex flex-row space-x-2">
                            <button class="btn danger text-sm"
                                @click="turn.state.confirmToolCalls[tool.call.id].resolve(false)">Deny</button>
                            <button class="btn success text-sm"
                                @click="turn.state.confirmToolCalls[tool.call.id].resolve(true)">Authorize</button>
                        </div>
                        <div class="toolcall overflow-y-auto slide-y" :class="turn.state.showToolResponses.includes(tool.call.id) ?
                            'slidedown' : 'slideup'">
                            <ToolCallDetails :tool="tool" class="mt-2 ml-3"></ToolCallDetails>
                        </div>
                    </div>
                </div>
                <div v-if="turn?.stats" class="px-3 my-2">
                    <HistoryTurnStatsBar :stats="turn.stats"></HistoryTurnStatsBar>
                </div>
            </div>
            <button class="btn flex flex-row items-center text-light hover:lighter pl-3"
                :disabled="isBusy"
                @click="$emit('restart', index + 1)">
                <RestartIcon width="24" height="24"></RestartIcon>
                <div>{{ index + 1 }}</div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UiHistoryTurn } from '@agent-smith/types';
import MarkdownRender from 'markstream-vue';
import { computed } from 'vue';
import PromptProcessingProgress from '../components/PromptProcessingProgress.vue';
import ThinkingContent from '../components/ThinkingContent.vue';
import { uistate } from '../state.js';
import FormatedToolCall from './FormatedToolCall.vue';
import HistoryTurnStatsBar from './HistoryTurnStatsBar.vue';
import RestartIcon from './icons/RestartIcon.vue';
import ToolCallDetails from './ToolCallDetails.vue';
import TurnTitle from './TurnTitle.vue';

const props = defineProps({
    turn: {
        type: Object as () => UiHistoryTurn,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    prevFrom: {
        type: String,
        default: ""
    },
    topLevelAgent: {
        type: String,
        required: true
    },
    isBusy: {
        type: Boolean,
        default: false
    },
    customHtmlTags: {
        type: Array as () => string[],
        default: () => []
    }
});

defineEmits(['restart']);

// Each turn's reactive props (state.confirmToolCalls, state.showToolResponses, stats, tools...)
// are now dependencies of this component instance only — mutating one turn re-renders
// just that turn, not the whole history list.
const canViewHistoryTurn = computed(() => {
    const t = props.turn;
    if (["user", props.topLevelAgent].includes(t.from)) {
        return true
    }
    if (uistate.value.historyViewMode == "plain") {
        return true
    }
    if (t.from != props.topLevelAgent) {
        return false
    }
    return true
});

function toggleViewToolResult(id: string) {
    const turn = props.turn;
    if (id in turn.state.confirmToolCalls) {
        return
    }
    if (turn.state.showToolResponses.includes(id)) {
        turn.state.showToolResponses = turn.state.showToolResponses.filter(r => r != id)
    } else {
        turn.state.showToolResponses.push(id)
    }
}
</script>
