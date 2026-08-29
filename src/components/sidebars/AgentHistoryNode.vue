<template>
    <div class="flex flex-col">
        <div>{{ turn.from }} [{{ turn.type }}] t{{ turn.agentTurn }}</div>
        <div v-if="turn.think" class="ml-3">{{ turn.think }}</div>
        <div v-if="turn.assistant" class="ml-3">{{ turn.assistant }}</div>
        <div v-for="t in turn.tools ?? []" :key="t.call.id" class="ml-3 flex flex-col">
            <div>{{ t.call.name }}<span v-if="t.response === null"> (pending)</span></div>
            <AgentHistoryNode v-for="st in t.subHistory ?? []" :key="st.agentTurn" :turn="st" class="ml-3" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AgentUiHistoryTurn } from "../../interfaces.js";

defineOptions({ name: "AgentHistoryNode" });

defineProps<{ turn: AgentUiHistoryTurn }>();
</script>
