<template>
    <div class="container mx-auto flex flex-col space-y-5 p-3 h-full pb-24 w-main">
        <div class="flex flex-row mr-3">
            <button class="btn p-1 border border-lighter"
                :class="view == 'settings' ? ['txt-semilight', 'border-b-0'] : 'txt-light'"
                @click="view = 'settings'">Settings</button>
            <button class="btn p-1 border border-lighter"
                :class="view == 'file' ? ['txt-semilight', 'border-b-0'] : 'txt-light'" @click="view = 'file'">Config
                file</button>
            <button class="btn p-1 border border-lighter"
                :class="view == 'edit' ? ['txt-semilight', 'border-b-0'] : 'txt-light'" @click="view = 'edit'">Edit
                config</button>
            <div class="border-b border-lighter grow"></div>
        </div>
        <template v-if="view == 'file'">
            <div class="flex flex-row w-full">
                <div class="text-2xl grow">Configuration</div>
            </div>
            <div class="p-3 bg-gray-100 border border-gray-200 rounded-md not-prose dark:bg-black dark:border-neutral-800"
                v-if="isReady">
                <code-editor :hljs="hljs" :code="code" lang="yaml" @edit="codeChange($event)">
                </code-editor>
            </div>
            <!-- button class="btn success w-max" @click="saveConfig()">Save config</button -->
        </template>
        <template v-else-if="view == 'settings'">
            <div class="w-full">
                <edit-settings></edit-settings>
            </div>
        </template>
        <template v-else-if="view == 'edit' && conf">
            <div class="flex flex-row w-full">
                <div class="text-2xl grow">Configuration</div>
            </div>
            <view-conf :conf="conf" @reload="redirectReload()" :plugins="addPlugins"></view-conf>
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
import { useRouter } from 'vue-router';
import EditSettings from '../components/EditSettings.vue';

hljs.registerLanguage('yaml', _yaml);
const router = useRouter();

const isReady = ref(false);
const code = ref("");
const view = ref<"edit" | "file" | "settings">("settings");
const addPlugins = ref(false);

async function saveConfig() {

}

const redirectReload = async () => {
    window.location.href = '/?workspace=1';
}

async function initConf() {
    const res = await api.get<ConfigFile>("/conf");
    conf.value = res.data;
    const doc = new yaml.Document(toRaw(res.data));
    code.value = doc.toString();
    isReady.value = true;
};

async function redirOpts() {
    const q = router.currentRoute.value.query;
    if (q?.plugins) {
        if (q.plugins.toString() == "1") {
            addPlugins.value = true
        }
        view.value = "edit"
    } else if (q?.settings) {
        if (q.settings.toString() == "1") {
            view.value = "settings"
        }
    }
}

function codeChange(e) {
    // update the code
    code.value = e;
}

onBeforeMount(() => {
    redirOpts();
    initConf()
})
</script>