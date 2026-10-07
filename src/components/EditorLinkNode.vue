<template>
    <div class="flex flex-row space-x-2 text-light items-center pl-5">
        <div class="px-2 py-0 rounded-lg info text-sm flex items-center">Link</div>
        <div class="mb-1">
            <a :href="link">{{ node?.content }}</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { state } from "../state.js";

const props = defineProps<{
    node?: {
        type: 'editor'
        raw?: string,
        content?: string
        loading?: boolean
    }
    customId?: string
    isDark?: boolean
}>()

const link = "vscode://file" + props.node?.content?.replaceAll("/workspace", state.currentWorkspace.path);
</script>