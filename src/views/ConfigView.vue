<template>
    <div class="container mx-auto flex flex-col space-y-5 p-3 h-full pb-24 w-main">
        <div class="flex flex-row">
            <div class="flex flex-row w-full justify-end">
                <div class="text-2xl flex-grow">Configuration</div>
                <div class="flex flex-row mr-3">
                    <button class="btn p-1 border bord-lighter" :class="view == 'file' ? 'txt-semilight' : 'txt-light'"
                        @click="view = 'file'">File</button>
                    <button class="btn p-1 border bord-lighter" :class="view == 'edit' ? ' txt-semilight' : 'txt-light'"
                        @click="view = 'edit'">Edit</button>
                </div>
            </div>
        </div>
        <template v-if="view == 'file'">
            <div class="p-3 bg-gray-100 border border-gray-200 rounded-md not-prose dark:bg-black dark:border-neutral-800"
                v-if="isReady">
                <code-editor :hljs="hljs" :code="code" lang="yaml" @edit="codeChange($event)">
                </code-editor>
            </div>
            <!-- button class="btn success w-max" @click="saveConfig()">Save config</button -->
        </template>
        <template v-else-if="conf">
            <view-conf :conf="conf" @reload="redirectReload()"></view-conf>
        </template>
    </div>
</template>

<script setup lang="ts">
import { api } from '../services/api.js';
import { CodeEditor } from "vuecodit";
import "vuecodit/style.css";
import hljs from 'highlight.js/lib/core';
import _yaml from 'highlight.js/lib/languages/yaml';
import "highlight.js/styles/stackoverflow-light.css";
import yaml from "yaml";
import { onBeforeMount, ref, toRaw } from "vue";
import type { ConfigFile } from "@agent-smith/types";
import ViewConf from '../components/ViewConf.vue';
import { conf } from '../state.js';

hljs.registerLanguage('yaml', _yaml);

const isReady = ref(false);
const code = ref("");
const view = ref<"edit" | "file">("edit");

async function saveConfig() {

}

const redirectReload = async () => {
    window.location.href = '/?redirect=config&plugins=1';
}

async function initConf() {
    const res = await api.get<ConfigFile>("/conf");
    conf.value = res.data;
    const doc = new yaml.Document(toRaw(res.data));
    code.value = doc.toString();
    isReady.value = true;
};

function codeChange(e) {
    // update the code
    code.value = e;
}

onBeforeMount(() => {
    initConf()
})
</script>