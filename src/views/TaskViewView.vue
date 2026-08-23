<template>
    <div class="container mx-auto flex flex-col space-y-5 p-3 h-full pb-24 w-main overflow-y-auto">
        <div class="flex flex-row text-light w-full">
            <div class="p-2 border-r border-t border-l border-lighter cursor-pointer rounded-l-md"
                :class="tab == 'file' ? ['text-semilight'] : ['border-b']" @click="toggleTab('file')">File</div>
            <div class="p-2 border-r border-t border-lighter cursor-pointer rounded-r-md"
                :class="tab == 'tools' ? ['text-semilight'] : ['border-b']" @click="toggleTab('tools')">Tools</div>
            <div class="border-b border-lighter grow"></div>
        </div>
        <template v-if="tab == 'file'">
            <div class="p-3 bg-gray-100 border border-gray-200 rounded-md 
        not-prose dark:bg-black dark:border-neutral-800 max-w-[97%]" v-if="code.length > 0">
                <code-editor :hljs="hljs" :code="code" lang="yaml" @edit="codeChange($event)">
                </code-editor>
            </div>
            <div class="flex flex-row space-x-3">
                <!-- button class="btn w-max" :class="hasCodeChanged ? 'success' : 'border-lighter text-light'" @click="save()"
                :disabled="!hasCodeChanged">Save</button -->
                <button class="btn w-max sec hover:prim"
                    @click="uistate.taskView = 'run'; router.push(runLink)">Run</button>
            </div>
        </template>
        <template v-else>
            <task-tools :tools="tools" :mcp="mcp" :auto-tools="autoTools"></task-tools>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ToolDefSpec, ToolSpec } from '@agent-smith/types';
import hljs from 'highlight.js/lib/core';
import _yaml from 'highlight.js/lib/languages/yaml';
import "highlight.js/styles/stackoverflow-light.css";
import { computed, onBeforeMount, ref, toRaw, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CodeEditor } from "vuecodit";
import "vuecodit/style.css";
import yaml from "yaml";
import TaskTools from '../components/TaskTools.vue';
import { srv, state, uistate, setCurrentFeature } from '../state.js';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    isAgent: {
        type: Boolean,
        default: false,
    }
});

hljs.registerLanguage('yaml', _yaml);

type Tab = "file" | "tools";

const router = useRouter();
const tab = ref<Tab>("file");
const code = ref("");
const initialCode = ref("");
const runLink = `/${props.isAgent ? 'agent' : 'task'}/${props.name}`;
const tools = ref<Array<{ spec: ToolSpec, type: string }>>([]);
const mcp = ref<Record<string, any>>({});
const autoTools = ref<Array<string>>([]);

async function init() {
    setCurrentFeature(props.name, props.isAgent ? "agent" : "task");
    autoTools.value = [];
    tools.value = [];
    await srv.load(props.name, props.isAgent);
    if (srv.agentSpec.value?.mcp) {
        mcp.value = srv.agentSpec.value.mcp
    } else {
        mcp.value = {}
    }
    const doc = new yaml.Document(srv.agentSpec.value);
    const txt = doc.toString();
    initialCode.value = txt;
    code.value = txt;
    const at = new Array<string>();
    if (srv.agentSpec.value?.tools) {
        srv.agentSpec.value.tools.forEach(t => {
            //console.log("T", t, t.endsWith("?"))
            if (!t.name.endsWith("?")) {
                at.push(t.name)
            }
            tools.value.push({
                spec: toRaw(t),
                type: t.type,
            })
        });
    }
    autoTools.value = at;
};

async function save() {

}

function toggleTab(t: Tab) {
    tab.value = t;
}

function codeChange(e) {
    // update the code
    code.value = e;
}

const hasCodeChanged = computed(() => code.value != initialCode.value)

onBeforeMount(() => init());

watch(props, () => {
    if (props.name != srv.agentSpec.value?.name) {
        init();
    };
});
</script>