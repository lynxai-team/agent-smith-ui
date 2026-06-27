<template>
    <div class="flex flex-col space-y-3 pb-5 max-w-2xl items-center">
        <InferenceParamsForm :inference-params="inferenceParams" :auto="true"></InferenceParamsForm>
        <div class="flex flex-row space-x-3 justify-center">
            <div>
                <input type="checkbox" v-model="enableThinking" class="ring-0">&nbsp;Enable thinking</input>
            </div>
            <div>
                <input type="checkbox" v-model="preserveThinking" class="ring-0">&nbsp;Preserve thinking</input>
            </div>
        </div>
        <div class="w-full flex justify-center">
            <div class="flex flex-col space-y-2 mt-3">
                <sw-switch v-model:value="switchPropagateModel" class="switch-success text-sm">
                    <span class="ml-2">Use this model and backend for all subagents</span>
                </sw-switch>
                <sw-switch v-model:value="switchPropagateIp" class="switch-success text-sm">
                    <span class="ml-2">Use this inference params for all subagents</span>
                </sw-switch>
                <div class="flex flex-row space-x-2 pt-2 items-center">
                    <div class="text-semilight">Backend:</div>&nbsp;
                    <div>
                        <select v-model="backend" :required="true" class="ring-0 px-3 py-2 border bord-lighter"
                            @change="onSelectBackend()">
                            <option v-for="b in Object.keys(state.backends)" :selected="uistate.backend == b"
                                :value="b">
                                {{ b }}
                            </option>
                        </select>
                    </div>

                </div>
                <div class="flex flex-wrap gap-2">
                    <div class="text-semilight">Model:</div>
                    <div v-if="model.length > 0">
                        {{ model }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center" v-if="showModelPicker">
            <Listbox v-if="enableBackendModels" :options="Object.values(state.models[backend])" filter optionLabel="id"
                @update:modelValue="$event?.id ? model = $event.id : model = ''; showModelPicker = false"
                class="w-56" />
            <input v-else type="text" v-model="model" />
        </div>
        <div class="flex flex-wrap gap-2 justify-around">
            <button class="btn soft" @click="showModelPicker = !showModelPicker">Pick a model</button>
            <button v-if="loadedModel" class="btn soft" @click="pickLoadedModel()">Pick loaded model: {{ loadedModel.id
                }}
                {{ humanizeNumber(loadedModel.ctx) }}</button>
            <button v-for="preset in state.samplingPresets" class="btn soft" @click="applySamplingPreset(preset)">{{
                preset.name }}</button>
        </div>
        <div class="w-full flex flex-row justify-center pt-3 space-x-2">
            <button class="btn text-primary font-semibold hover:primary py-1 text-sm" :disabled="!isValid"
                @click="useAgentSettings()">Use agent settings</button>
            <button class="btn success py-1 text-sm" :disabled="!isValid" @click="saveAgentsSettings()">Save agent
                settings</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { AgentSettings, AgentSpec, InferenceParams, ModelInfo, SamplingPreset } from '@agent-smith/types';
import { srv, state, uistate } from '../state.js';
import { computed, onBeforeMount, reactive, ref, toRaw, watch } from 'vue';
import InferenceParamsForm from './InferenceParamsForm.vue';
import { humanizeNumber } from '../services/str.js';
import SwSwitch from "@snowind/switch";
import Listbox from 'primevue/listbox';
import { msg } from '../services/notify.js';
import { api } from '../services/api.js';

const props = defineProps<{
    agentSpec: AgentSpec;
}>();

const emit = defineEmits(["end"]);

const loadedModel = ref<ModelInfo | null>(null);
const switchPropagateModel = ref(false);
const switchPropagateIp = ref(false);
const enableThinking = ref(false);
const preserveThinking = ref(false);
const model = ref<string>("");
const backend = ref<string>(uistate.value.backend);
const enableBackendModels = ref(state.backends[backend.value]?.type !== 'openai');
const showModelPicker = ref(false);

const inferenceParams: InferenceParams = reactive({
    max_tokens: undefined,
    top_k: undefined,
    top_p: undefined,
    min_p: undefined,
    temperature: undefined,
    repeat_penalty: undefined,
    presence_penalty: undefined,
    frequency_penalty: undefined,
    chat_template_kwargs: undefined,
});

function useAgentSettings() {
    if (!model.value) {
        throw new Error("no model")
    }
    let bk: string;
    if (backend?.value) {
        bk = backend.value
    } else {
        if (!uistate?.value?.backend) {
            msg.warn("Select a backend", "You must select a backend")
            return
        }
        bk = uistate.value.backend
    }
    const data: {
        params: InferenceParams,
        model: string,
        backend: string,
        propagateModel: boolean,
        propagateInferParams: boolean;
    } = {
        model: model.value,
        backend: bk,
        params: toRaw(inferenceParams),
        propagateModel: switchPropagateModel.value,
        propagateInferParams: switchPropagateIp.value,
    }
    emit("end", data)
}

async function saveAgentsSettings() {
    let bk: string;
    if (backend?.value) {
        bk = backend.value
    } else {
        if (!uistate?.value?.backend) {
            msg.warn("Select a backend", "You must select a backend")
            return
        }
        bk = uistate.value.backend
    }
    if (!inferenceParams?.chat_template_kwargs) {
        inferenceParams.chat_template_kwargs = {}
    }
    inferenceParams.chat_template_kwargs.enable_thinking = enableThinking.value;
    inferenceParams.chat_template_kwargs.preserve_thinking = preserveThinking.value;
    const st: AgentSettings = {
        model: model.value,
        backend: bk,
        ...inferenceParams,
        props: {
            propagateModel: switchPropagateModel.value,
            propagateInferParams: switchPropagateIp.value,
        }
    };
    const payload = { name: props.agentSpec.name, settings: st };
    const res = await api.post("/agentsettings/update", payload);
    if (!res.ok) {
        msg.error("Error saving agent settings", `${res.status} ${res.text}`)
        return
    }
    useAgentSettings()
}

function applySamplingPreset(preset: SamplingPreset) {
    //console.log("Apply preset", preset);
    const ips = Object.keys(toRaw(inferenceParams));
    for (const ip of ips) {
        inferenceParams[ip] = preset[ip] ?? undefined;
    }
    if (preset?.chat_template_kwargs) {
        if (preset.chat_template_kwargs?.enable_thinking) {
            enableThinking.value = preset.chat_template_kwargs.enable_thinking;
        }
        if (preset.chat_template_kwargs?.preserve_thinking) {
            preserveThinking.value = preset.chat_template_kwargs.preserve_thinking
        }
    } else {
        enableThinking.value = false
        preserveThinking.value = false
    }
    if (preset?.backend) {
        backend.value = preset.backend;
    }
    if (preset?.model) {
        model.value = preset.model;
    }
}

function pickLoadedModel() {
    if (loadedModel.value) {
        model.value = loadedModel.value.id
    } else {
        console.error("pick model: no loaded model ")
    }
}

function getLoadedModel(backend: string) {
    loadedModel.value = null;
    if (backend in state.models) {
        for (const m of Object.values(state.models[backend])) {
            if (m?.status == "loaded") {
                loadedModel.value = m
                break;
            }
        }
    }
}

const isValid = computed(() => {
    return model.value.length > 0
})

async function init() {
    state.agentsSettings = await srv.loadAgentSettings();
    //console.log("AS", state.agentsSettings[props.agentSpec.name]);
    if (Object.keys(state.agentsSettings).includes(props.agentSpec.name)) {
        const agentSettings = state.agentsSettings[props.agentSpec.name];
        //console.log("AS", agentSettings);
        for (const [k, v] of Object.entries(agentSettings)) {
            //console.log("S", k, v)
            if (k == "model") {
                model.value = v
            } else if (k == "backend") {
                backend.value = v;
                enableBackendModels.value = state.backends[backend.value]?.type !== 'openai';
            }
            else if (k == "chat_template_kwargs") {
                if (v?.enable_thinking) {
                    enableThinking.value = v.enable_thinking;
                }
                if (v?.preserve_thinking) {
                    preserveThinking.value = v.preserve_thinking;
                }
            } else if (k == "props") {
                const pv = toRaw(v);
                if ("propagateModel" in pv) {
                    switchPropagateModel.value = pv["propagateModel"]
                }
                if ("propagateInferParams" in pv) {
                    switchPropagateIp.value = pv["propagateInferParams"]
                }
            }
            else {
                inferenceParams[k] = v
            }
        }
    } else {
        if (props.agentSpec.inferParams) {
            for (const [k, v] of Object.entries(props.agentSpec.inferParams)) {
                inferenceParams[k] = v
            }
        }
    };
    if (model.value.length == 0) {
        model.value = props.agentSpec.model
    }
    if (!backend.value) {
        if (props.agentSpec?.backend) {
            backend.value = props.agentSpec.backend
        } else if (uistate.value.backend.length > 0) {
            backend.value = uistate.value.backend
        }
    }
    try {
        if (enableBackendModels.value) {
            getLoadedModel(backend.value);
        }
    } catch (e) {
        console.warn(e)
    }
}

function onSelectBackend() {
    enableBackendModels.value = state.backends[backend.value]?.type !== 'openai';
    if (enableBackendModels) {
        srv.loadModels(backend.value).then(() => getLoadedModel(backend.value));
    }
}

onBeforeMount(() => init());
</script>
