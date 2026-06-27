<template>
    <div class="flex flex-col space-y-3">
        <div class="text-xl">Folders</div>
        <div v-if="conf?.features">
            <div v-for="feat in conf.features" class="flex flex-col space-y-3">
                {{ feat }}
            </div>
        </div>
        <div v-if="!addFolders">
            <button class="btn light w-max" @click="addFolders = true">Add folder</button>
        </div>
        <div v-else class="flex flex-col space-y-3">
            <div>Add a folder</div>
            <IftaLabel>
                <InputText id="username" v-model="folder" variant="filled" class="w-full max-w-xl" />
                <label for="username">Folder path</label>
            </IftaLabel>
            <div v-if="folder.length > 0">
                <button class="btn success" @click="addFolder()">Add folder</button>
            </div>
        </div>
        <div class="text-xl">Plugins</div>
        <div v-if="conf?.plugins">
            <div v-for="plugin in conf.plugins">
                {{ plugin }} <span class="text-semilight">installed</span>
            </div>
        </div>
        <div class="pt-3" v-if="!addPlugins">
            <button class="btn light w-max" @click="addPlugins = true">Add plugins</button>
        </div>
        <div v-else class="flex flex-col space-y-3">
            <div class="flex flex-row space-y-3" v-for="plugin in availablePlugins" :key="plugin.name">
                <div v-if="!conf.plugins?.includes(plugin.name)" class="flex flex-row space-x-2 items-center">
                    <Checkbox v-model="selectedPlugins" :inputId="plugin.name" name="category" :value="plugin.name" />
                    <label :for="plugin.name">
                        {{ plugin.name }}:
                        <span class="text-semilight">{{ plugin.description }}</span> </label>
                </div>
            </div>
            <div class="pt-3 flex flex-row space-x-2">
                <button class="btn success w-max" @click="installPlugins()" :disabled="isInstalling">Install</button>
                <button class="btn text-warning w-max" @click="addPlugins = false">Cancel</button>
            </div>
            <div v-if="isInstalling">Installing plugins ...</div>
        </div>
        <div v-if="conf?.apps" class="flex flex-col space-y-3">
            <div class="text-xl">Apps</div>
            <div v-for="app in conf.apps">{{ app }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import { IftaLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import type { ConfigFile } from '@agent-smith/types';
import { onBeforeMount, ref } from 'vue';
import { api } from '../services/api.js';
import { msg } from '../services/notify.js';
import { availablePlugins } from '../conf.js';

const emit = defineEmits(["reload"]);

const props = defineProps({
    conf: {
        type: Object as () => ConfigFile,
        required: true
    },
    plugins: {
        type: Boolean,
    }
});

const isInstalling = ref(false);
const addPlugins = ref(true);
const addFolders = ref(false);
const selectedPlugins = ref<Array<string>>([]);
const folder = ref("");

async function installPlugins() {
    if (selectedPlugins.value.length == 0) {
        msg.warn("Select a plugin", "Select a plugin to install")
        return
    }
    isInstalling.value = true;
    const res = await api.post("/plugins/install", selectedPlugins.value);
    if (res.ok) {
        selectedPlugins.value = [];
        emit('reload');
        addPlugins.value = false;
    } else {
        throw new Error(`can not install plugins ${res.status} ${res.text}`)
    }
}

async function addFolder() {
    const res = await api.post("/folders/add", [folder.value]);
    if (res.ok) {
        folder.value = "";
        emit('reload');
        addFolders.value = false;
    } else {
        throw new Error(`can not add folder ${res.status} ${res.text}`)
    }
}

onBeforeMount(() => {
    if (props?.plugins) {
        if (props.plugins.toString() == "1") {
            addPlugins.value = true
        }
        selectedPlugins.value = availablePlugins.map(p => p.name)
    }
})
</script>