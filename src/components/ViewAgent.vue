<template>
    <div class="flex flex-col space-y-5 p-3">
        <div v-if="agent?.description" class="text-xl pt-3 pl-5">{{ agent.description }}</div>
        <div class="flex flex-row space-x-3">
            <div class="flex flex-col space-y-3 p-5 min-w-fit">
                <div class="flex flex-wrap gap-3">
                    <div v-if="tools.length > 0">
                        <div v-for="tool in tools" class="p-3 border border-lighter">
                            {{ tool.spec.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-y-auto max-h-min">
                <MarkdownRender v-if="agent?.template?.system" :content="agent.template.system" class="mdr" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { AgentSpec, ToolSpec } from '@agent-smith/types';
import { onBeforeMount, ref, toRaw } from 'vue';
import MarkdownRender, { CodeBlockNode, enableMermaid, setCustomComponents } from 'markstream-vue';
import { srv } from '../state.js';

const props = defineProps<{
    agent: AgentSpec
}>();

setCustomComponents({ code_block: CodeBlockNode });
enableMermaid();

const tools = ref<Array<{ spec: ToolSpec, type: string }>>([]);
const autoTools = ref<Array<string>>([]);
const mcp = ref<Record<string, any>>({});

async function init() {
    autoTools.value = [];
    tools.value = [];
    await srv.load(props.agent.name, true);
    //console.log("SPEC", srv.agentSpec.value);
    if (srv.agentSpec.value?.mcp) {
        mcp.value = srv.agentSpec.value.mcp
    } else {
        mcp.value = {}
    }
    const at = new Array<string>();
    if (srv.agentSpec.value?.tools) {
        srv.agentSpec.value.tools.forEach(t => {
            //console.log("T", t, t.endsWith("?"))
            if (!t.name.endsWith("?")) {
                at.push(t.name)
            }
        });
        props.agent.tools?.forEach(t => {
            tools.value.push({
                spec: toRaw(t),
                type: t.type,
            })
        })
    }
    autoTools.value = at;
    /*console.log("Tools", tools.value);
    console.log("Auto tools", autoTools.value);
    console.log("Mcp", mcp.value)*/
};

onBeforeMount(() => init())
</script>