<template>
    <div class="flex flex-col space-y-2 ml-3">
        <div class="font-bold text-xl flex flex-row space-x-3 items-center ">
            <UserIcon v-if="name == 'user'" width="24" height="24" class="txt-primary opacity-65"></UserIcon>
            <AgentIcon v-else width="24" height="24" class="txt-primary opacity-55"></AgentIcon>
            <!--UserSpeakingIcon v-else width="26" height="26" class="txt-primary opacity-65"></UserSpeakingIcon -->
            <div class="txt-semilight">{{ name == 'user' ? 'User' : humanize(name) }}</div>
        </div>
        <hr class="txt-light h-1 opacity-65" />
    </div>
</template>

<script setup lang="ts">
import UserIcon from './icons/UserIcon.vue';
import AgentIcon from './icons/AgentIcon.vue';
import { humanize } from '../services/str.js';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
</script>