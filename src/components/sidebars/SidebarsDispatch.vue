<template>
    <div class="h-full">
        <div class="flex flex-col border bord-lighter h-full" v-if="!appSidebar">
            <div class="flex flex-row txt-light">
                <div class="p-2 border-r bord-lighter cursor-pointer"
                    :class="uistate.sidebar == 'agents' ? ['txt-semilight'] : ['border-b']"
                    @click="toggleSidebar('agents')">
                    <AgentIcon width="32" height="32"></AgentIcon>
                </div>
                <div class="p-2 border-r bord-lighter cursor-pointer"
                    :class="uistate.sidebar == 'tasks' ? ['txt-semilight'] : ['border-b']"
                    @click="toggleSidebar('tasks')">
                    <TaskIcon width="32" height="32"></TaskIcon>
                </div>
                <div class="p-2 border-r bord-lighter cursor-pointer"
                    :class="uistate.sidebar == 'workflows' ? ['txt-semilight'] : ['border-b']"
                    @click="toggleSidebar('workflows')">
                    <WorkflowIcon width="32" height="32"></WorkflowIcon>
                </div>
                <!-- div class="p-2 border-r cursor-pointer"
                :class="uistate.sidebar == 'tools' ? ['txt-semilight'] : ['border-b']" @click="toggleSidebar('tools')">
                <ToolsIcon width="32" height="32"></ToolsIcon>
            </div>
            <div class="p-2 cursor-pointer border-t-0"
                :class="uistate.sidebar == 'mcp' ? ['txt-semilight'] : ['border-b']" @click="toggleSidebar('mcp')">
                <McpIcon width="32" height="32"></McpIcon>
            </div -->
                <div class="flex-grow border-b bord-lighter"></div>
            </div>
            <div>
                <SidebarAgents v-if="uistate.sidebar == 'agents'"></SidebarAgents>
                <SidebarTasks v-else-if="uistate.sidebar == 'tasks'"></SidebarTasks>
                <SidebarWorkflows v-else-if="uistate.sidebar == 'workflows'"></SidebarWorkflows>
            </div>
        </div>
        <div v-else class="border border-t-0 bord-lighter h-full">
            <component :is="appSidebar"></component>
        </div>
    </div>
</template>

<script setup lang="ts">
import { appSidebar, resetCurrentFeature, uistate } from "@/state.js";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { SidebarType } from '../../interfaces.js';
import AgentIcon from '../../widgets/icons/AgentIcon.vue';
import TaskIcon from '../../widgets/icons/TaskIcon.vue';
import WorkflowIcon from '../../widgets/icons/WorkflowIcon.vue';
import SidebarAgents from './SidebarAgents.vue';
import SidebarTasks from './SidebarTasks.vue';
import SidebarWorkflows from './SidebarWorkflows.vue';

const router = useRouter();

function toggleSidebar(sb: SidebarType, r = true) {
    //console.log("Toggle sb", sb);
    resetCurrentFeature();
    if (sb == "tasks") {
        uistate.value.title = "Tasks";
        if (uistate.value.sidebar == "tasks") {
            return
        }
        uistate.value.sidebar = "tasks";
    } else if (sb == "agents") {
        uistate.value.title = "Agents";
        //console.log("UIST", uistate.value.title)
        if (uistate.value.sidebar == "agents") {
            return
        }
        uistate.value.sidebar = "agents";
    } else if (sb == "workflows") {
        uistate.value.title = "Workflows";
        if (uistate.value.sidebar == "workflows") {
            return
        }
        uistate.value.sidebar = "workflows";
    }
    if (r) {
        router.push("/")
    }
}

onMounted(() => toggleSidebar(uistate.value.sidebar, false))
</script>