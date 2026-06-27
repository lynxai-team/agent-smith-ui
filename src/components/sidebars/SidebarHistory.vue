<template>
    <div class="flex flex-col p-1 overflow-y-auto" :class="uistate.inferenceSidebar == 'mini' ? 'items-center' : ''">
        <div v-for="(turn, i) in state.uihistory" class="flex flex-row space-x-2 text-semilight text-sm items-center"
            @click="emit('moveto-turn', i)">
            <button v-if="turn?.user" class="btn hover:lighter hover:border-light flex flex-row space-x-2">
                <div>{{ i }}</div>
                <UserIcon width="24" height="24"></UserIcon>
                <div v-if="uistate.inferenceSidebar == 'full'" class="truncate">{{ turn?.user.slice(0, 20) }}</div>
            </button>
            <button v-else-if="turn?.think"
                class="btn hover:lighter hover:border-light text-light flex flex-row space-x-2">
                <div>{{ i }}</div>
                <AgentIcon width="24" height="24"></AgentIcon>
                <div v-if="uistate.inferenceSidebar == 'full'">
                    {{ turn.from }} {{
                        turn?.stats?.nTotalTokens }}
                </div>
            </button>
            <button v-else-if="turn?.assistant" class="btn hover:lighter hover:border-light flex flex-row space-x-2">
                <div>{{ i }}</div>
                <AgentIcon width="24" height="24"></AgentIcon>
                <div v-if="uistate.inferenceSidebar == 'full'">
                    {{ turn.from }} {{
                        turn?.stats?.nTotalTokens }}</div>
            </button>
            <button v-else-if="turn?.tools" class="btn hover:lighter hover:border-light flex flex-row space-x-2">
                <div>{{ i }}</div>
                <ToolsIcon width="24" height="24"></ToolsIcon>
                <div v-if="uistate.inferenceSidebar == 'full'">
                    {{ turn.from }} {{
                        turn?.tools.map(t => t.call.name)}}</div>
            </button>
        </div>
        <!-- pre>{{ state.uihistory }}</pre -->
    </div>
</template>
<script setup lang="ts">
import { state } from '../../state.js';
import AgentIcon from '../../widgets/icons/AgentIcon.vue';
import UserIcon from '../../widgets/icons/UserIcon.vue';
import ToolsIcon from '../../widgets/icons/ToolsIcon.vue';
import { uistate } from '../../state.js';

const emit = defineEmits(["moveto-turn"]);
</script>