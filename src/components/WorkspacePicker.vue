<template>
    <div>
        <Popover ref="wspopover">
            <div v-if="view == 'view'" class="flex flex-col space-y-3">
                <button v-for="workspace in state.workspaces" class="btn flex flex-row space-x-2"
                    @click="updateDefaultWorkspace(workspace)">
                    <div>{{ humanize(workspace.name) }}</div>
                    <div v-if="workspace.name == state.currentWorkspace.name">
                        🟢
                    </div>
                </button>
                <button class="btn primary" @click="view = 'create'">New workspace</button>
            </div>
            <div v-else class="flex flex-col space-y-3">
                <div class="text-xl">New workspace</div>
                <form @submit.prevent="addWorkspace" class="flex flex-col space-y-3">
                    <div>
                        <label class="block text-sm font-medium mb-1">Name</label>
                        <input v-model="form.name" type="text" class="input" placeholder="Workspace name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Path</label>
                        <input v-model="form.path" type="text" class="input" placeholder="/workspace/path" />
                    </div>
                    <button type="submit" class="btn success pt-2" :disabled="!isValid">Create</button>
                    <button class="btn txt-warning" @click="view = 'view'">Cancel</button>
                </form>
            </div>
        </Popover>
        <button class="btn" @click="wspopover.toggle($event)">
            <template v-if="state.currentWorkspace.name == ''">
                <WorkspaceIcon width="32" height="32" class=" txt-light"></WorkspaceIcon>
            </template>
            <div v-else class="flex flex-row space-x-2 items-center">
                <div>
                    <FolderIcon width="32" height="32" class=" txt-light"></FolderIcon>
                </div>
                <div class=" txt-light"></div>{{ humanize(state.currentWorkspace.name) }}
            </div>
        </button>
    </div>
</template>
<script setup lang="ts">
import Popover from 'primevue/popover';
import { ref, computed } from 'vue';
import { state } from '../state.js';
import WorkspaceIcon from '../widgets/icons/WorkspaceIcon.vue';
import { api } from '../services/api.js';
import type { Workspace } from '@agent-smith/types';
import FolderIcon from '../widgets/icons/FolderIcon.vue';
import { humanize } from '../services/str.js';

const wspopover = ref();
const view = ref<'view' | 'create'>('view');

const form = ref({ name: '', path: '' });

async function updateDefaultWorkspace(ws: Workspace) {
    const res = await api.post("/workspace/update", ws);
    if (!res.ok) {
        console.error("error updating default workspace", res.status, res.text)
    }
    state.currentWorkspace = ws;
    wspopover.value.hide()
}

async function addWorkspace() {
    //console.log('Create workspace:', form.value);
    let isDefault = Object.keys(state.workspaces).length == 0 ? true : false;
    const payload: Workspace = {
        name: form.value.name,
        path: form.value.path,
        props: {},
    };
    const res = await api.post("/workspace", payload);
    if (!res.ok) {
        console.error("error creating workspace", res.status, res.text)
    }
    state.workspaces[payload.name] = payload;
    if (isDefault) {
        state.currentWorkspace = payload;
    }
    view.value = "view";
}

const isValid = computed(() => Boolean(form.value.name && form.value.path));
</script>