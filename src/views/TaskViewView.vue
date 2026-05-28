<template>
    <div class="container mx-auto flex flex-col space-y-5 p-3 h-full pb-24 w-main">
        <div class="flex flex-row txt-light w-full">
            <div class="p-2 border-r border-t border-l bord-lighter cursor-pointer rounded-l-md"
                :class="tab == 'file' ? ['txt-semilight'] : ['border-b']" @click="toggleTab('file')">File</div>
            <div class="p-2 border-r border-t bord-lighter cursor-pointer rounded-r-md"
                :class="tab == 'tools' ? ['txt-semilight'] : ['border-b']" @click="toggleTab('tools')">Tools</div>
            <div class="border-b bord-lighter flex-grow"></div>
        </div>
        <template v-if="tab == 'file'">
            <div class="p-3 bg-gray-100 border border-gray-200 rounded-md 
        not-prose dark:bg-black dark:border-neutral-800 max-w-[97%]" v-if="code.length > 0">
                <code-editor :hljs="hljs" :code="code" lang="yaml" @edit="codeChange($event)">
                </code-editor>
            </div>
            <div class="flex flex-row space-x-3">
                <!-- button class="btn w-max" :class="hasCodeChanged ? 'success' : 'bord-lighter txt-light'" @click="save()"
                :disabled="!hasCodeChanged">Save</button -->
                <button class="btn w-max secondary hover:primary"
                    @click="uistate.taskView = 'run'; router.push(runLink)">Run</button>
            </div>
        </template>
        <template v-else>
            <task-tools :tools-def="toolsDef" :mcp="mcp" :auto-tools="autoTools"></task-tools>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ToolDefSpec } from '@agent-smith/types';
import hljs from 'highlight.js/lib/core';
import _yaml from 'highlight.js/lib/languages/yaml';
import "highlight.js/styles/stackoverflow-light.css";
import { computed, onBeforeMount, ref, watch } from 'vue';
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
const toolsDef = ref<Array<{ def: ToolDefSpec, type: string }>>([]);
const mcp = ref<Record<string, any>>({});
const autoTools = ref<Array<string>>([]);

async function init() {
    setCurrentFeature(props.name, props.isAgent ? "agent" : "task");
    autoTools.value = [];
    toolsDef.value = [];
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
    if (srv.agentSpec.value?.toolsList) {
        srv.agentSpec.value.toolsList.forEach(t => {
            //console.log("T", t, t.endsWith("?"))
            if (!t.endsWith("?")) {
                at.push(t)
            }
        });
        const t = await srv.getTools(srv.agentSpec.value.toolsList);
        //console.log("T", t);
        toolsDef.value = (t)
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