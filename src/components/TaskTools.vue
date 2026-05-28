<template>
    <div>
        <template v-if="toolsDef.length > 0">
            <div class="text-xl">Tools</div>
            <div v-for="tool in toolsDef" class="flex flex-col space-y-3 mx-3">
                <div class="flex flex-row space-x-3 items-center btn hover:lighter w-fit"
                    @click="openTool(tool.def, tool.type)">
                    <div class="text-lg font-semibold">{{ tool.def.name }}</div>
                    <div class="txt-semilight">{{ tool.type }}</div>
                    <div v-if="autoTools.includes(tool.def.name)" class="btn success text-sm py-0 px-2 cursor-default">
                        Auto</div>
                    <div v-else class="btn danger text-sm py-0 px-2 cursor-default">Confirm</div>
                </div>
                <div>{{ tool.def.description }}</div>
                <div v-for="(arg, name) in tool.def.arguments" class="ml-8 flex flex-col">
                    <div class="flex flex-row space-x-2">
                        <div class="font-semibold">{{ name }}:</div>
                        <div>{{ arg.description }}</div>
                        <div v-if="arg?.required" class="flex flex-row space-x-2 items-center">
                            <div class="warning h-3 w-3 rounded-full opacity-55"></div>
                            <div class="txt-semilight">required</div>
                        </div>
                        <div v-else class="flex flex-row space-x-2 items-center">
                            <div class="success h-3 w-3 rounded-full opacity-55"></div>
                            <div class="txt-semilight">optional</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-if="Object.keys(mcp).length > 0" class="mx-3 flex flex-col space-y-3">
            <div class="text-xl">Mcp</div>
            <div v-for="(v, k) in mcp" class="flex flex-col space-y-3">
                <div class="text-lg font-semibold">{{ k }}</div>
                <div v-for="tool in v.tools" class="flex flex-col mx-3">
                    <div class="flex flex-row space-x-3 items-center btn hover:lighter w-fit">
                        <div>{{ tool }}</div>
                        <div v-if="!tool.endsWith('?')" class="btn success text-sm py-0 px-2 cursor-default">
                            Auto</div>
                        <div v-else class="btn danger text-sm py-0 px-2 cursor-default">Confirm</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ToolDefSpec } from '@agent-smith/types';
import { useRouter } from 'vue-router';

const props = defineProps<{
    toolsDef: Array<{ def: ToolDefSpec, type: string }>,
    mcp: Record<string, any>,
    autoTools: Array<string>,
}>();

const router = useRouter();

function openTool(tool: ToolDefSpec, type: string) {
    if (type !== "action") {
        //console.warn("")
        router.push(`/${type}/view/${tool.name}`)
    }
}
</script>