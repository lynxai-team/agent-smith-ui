<template>
    <div class="flex flex-col space-y-5">
        <div>
            TC===============
            <MarkdownRender custom-id="tool_call" :content="node.content" :max-live-nodes="0" :batch-rendering="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import MarkdownRender from 'markstream-vue'

const props = defineProps({
    node: {
        type: Object,
        required: true,
    },
});
</script>