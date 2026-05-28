<template>
    <div class="flex flex-row space-x-2 items-center max-w-full">
        <ToolsIcon width="24" height="24" class="min-w-12 opacity-50" :class="toolIconCls(turn, tool)"
            v-if="tool?.response && tool.type != 'agent'">
        </ToolsIcon>
        <ExecuteIcon v-else width="24" height="24" class="min-w-12 opacity-50 font-semibold"
            :class="tool.type == 'agent' ? 'txt-success' : 'txt-warning'"></ExecuteIcon>
        <div class="w-max">{{ tool.from }}</div>
        <div>=></div>
        <div class="font-semibold txt-success">{{ tool.call.name }}</div>
        <div class="txt-semilight">{{ tool.type }}</div>
        <div>
            <div class="flex flex-col space-y-3 ml-5 flex-shrink">
                <div v-for="(k, v) in tool.call.arguments" class="flex flex-row space-x-2">
                    <div class="txt-semilight">
                        <ArgumentIcon width="24" height="24"></ArgumentIcon>
                    </div>
                    <div>{{ v }}:</div>
                    <div class="txt-semilight">{{ k.slice(0, 68) }}{{ k.length > 67 ? '(...)' : '' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ToolTurn, UiHistoryTurn } from '@agent-smith/types';
import ToolsIcon from './icons/ToolsIcon.vue';
import ArgumentIcon from './icons/ArgumentIcon.vue';
import ExecuteIcon from './icons/ExecuteIcon.vue';

defineProps({
    tool: {
        type: Object as () => ToolTurn,
        required: true
    },
    turn: {
        type: Object as () => UiHistoryTurn,
        required: true
    }
});

function toolIconCls(turn: UiHistoryTurn, tool: ToolTurn): string {
    if (tool.call.id in turn.state.confirmToolCalls) {
        return 'txt-warning'
    }
    if (tool?.response) {
        if (tool.response == "tool execution denied" ||
            tool.response.toString().startsWith("[Error]")
        ) {
            return 'txt-danger'
        }
        return 'txt-success'
    } else {
        if (tool?.type == "agent") {
            return 'txt-success'
        }
        return 'txt-warning'
    }
}
</script>