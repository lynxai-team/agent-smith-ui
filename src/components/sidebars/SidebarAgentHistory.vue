<template>
    <div class="p-3 flex flex-col space-y-3">
        <AgentHistoryNode v-for="(turn, i) in mainAgent.history" :key="i" :turn="turn" />
    </div>
</template>
<script setup lang="ts">
import { mainAgent } from '../../state.js';
import AgentHistoryNode from './AgentHistoryNode.vue';
</script>
