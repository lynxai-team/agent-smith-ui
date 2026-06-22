<template>
    <div class="flex flex-col space-y-2 p-3 3xl:max-w-[28rem]">
        <div v-for="(turn, i) in state.uihistory" class="flex flex-row space-x-2">
            <div>{{ i }}</div>
            <div v-if="turn?.user" class="flex flex-row space-x-2">
                <UserIcon width="24" height="24"></UserIcon>
                <div>{{ turn?.stats?.nTotalTokens }}</div>
            </div>
            <div v-else-if="turn?.think" class="txt-semilight flex flex-row space-x-2">
                <AgentIcon width="24" height="24"></AgentIcon>
                <div>
                    {{ turn.from }} {{
                        turn?.stats?.nTotalTokens }}
                </div>
            </div>
            <div v-else-if="turn?.assistant" class="flex flex-row space-x-2">
                <AgentIcon width="24" height="24"></AgentIcon>
                <div>
                    {{ turn.from }} {{
                        turn?.stats?.nTotalTokens }}</div>
            </div>
            <div v-else-if="turn?.tools" class="flex flex-row space-x-2">
                <ToolsIcon width="24" height="24"></ToolsIcon>
                <div>
                    {{ turn.from }} {{
                        turn?.tools.map(t => t.call.name)}}</div>
            </div>
        </div>
        <pre>{{ state.uihistory }}</pre>
    </div>
</template>
<script setup lang="ts">
import { state } from '../../state.js';
import AgentIcon from '../../widgets/icons/AgentIcon.vue';
import UserIcon from '../../widgets/icons/UserIcon.vue';
import ToolsIcon from '../../widgets/icons/ToolsIcon.vue';
</script>