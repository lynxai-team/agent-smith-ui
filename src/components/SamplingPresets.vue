<template>
    <div>
        <Popover ref="mpopover" @hide="reset()">
            <div v-if="view == 'view'" class="flex flex-col space-y-2">
                <div v-for="mp in state.samplingPresets" class="flex flex-row">
                    <button class="btn" @click="deletePreset(mp.name)">
                        <DeleteIcon width="24" height="24" class="txt-danger opacity-20 hover:opacity-100"></DeleteIcon>
                    </button>
                    <button class="btn pl-0" @click="editPreset(mp.name)">{{ humanize(mp.name) }}</button>
                    <button class="btn pl-0 flex-grow flex flex-row justify-end" @click="editPreset(mp.name)">
                        <CopyIcon width="24" height="24" class="txt-semilight"></CopyIcon>
                    </button>
                </div>
                <button class="btn primary pt-2" @click="toggleView('create')">New sampling preset</button>
            </div>
            <div v-else class="flex flex-col space-y-3">
                <div class="text-xl">Sampling preset</div>
                <form @submit.prevent="addSamplingPreset" class="flex flex-col space-y-3">
                    <div class="flex flex-row space-x-5">
                        <div class="flex flex-col space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">Name</label>
                                <input v-model="form.name" type="text" class="input" placeholder="Preset name" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Backend</label>
                                <select v-model="form.backend" :required="true">
                                    <option v-for="b in Object.keys(state.backends)" :selected="b == form.backend"
                                        :value="b">
                                        {{ b }}
                                    </option>
                                </select>
                            </div>
                            <div class="flex flex-col space-y-3 pt-3 pl-3">
                                <div>
                                    <input type="checkbox" v-model="enableThinking">&nbsp;Enable thinking</input>
                                </div>
                                <div>
                                    <input type="checkbox" v-model="preserveThinking">&nbsp;Preserve
                                    thinking</input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">
                                <template v-if="selectedModel?.id">
                                    Model: <span class="font-bold">{{
                                        selectedModel.id }}</span> ctx: {{ humanizeNumber(selectedModel.ctx)
                                        }}
                                </template>
                                <template v-else>
                                    No model selected
                                </template>
                            </label>
                            <Listbox v-model="selectedModel" :options="modelsData" filter optionLabel="label"
                                class="w-56" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Inference params</label>
                        <InferenceParamsForm :inference-params="inferenceParams"></InferenceParamsForm>
                    </div>
                    <button type="submit" class="btn success pt-2" :disabled="!isValid">Save</button>
                    <button class="btn txt-warning" @click="reset()">Cancel</button>
                </form>
            </div>
        </Popover>
        <button class="btn flex flex-row space-x-2 items-center" @click="mpopover.toggle($event)">
            <ModelsPresetsIcon width="32" height="32" class=" txt-light"></ModelsPresetsIcon>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount, toRaw, onBeforeUnmount } from 'vue';
import Popover from 'primevue/popover';
import { state, uistate } from '../state.js';
import { api } from '../services/api.js';
import { humanize, humanizeNumber } from '../services/str.js';
import type { InferenceParams, ModelInfo, SamplingPreset } from '@agent-smith/types';
import ModelsPresetsIcon from '../widgets/icons/ModelsPresetsIcon.vue';
import InferenceParamsForm from './InferenceParamsForm.vue';
import Listbox from 'primevue/listbox';
import DeleteIcon from '../widgets/icons/DeleteIcon.vue';
import { confirmDanger, msg } from '../services/notify.js';
import CopyIcon from '../widgets/icons/CopyIcon.vue';

const mpopover = ref();
const view = ref<'view' | 'create'>('view');
const modelsData = ref<Array<Record<string, any>>>([]);
const selectedModel = ref<ModelInfo>({ id: "", status: "", ctx: 0, hasVision: false });
const enableThinking = ref(false);
const preserveThinking = ref(false);

const inferenceParams: InferenceParams = reactive({
    max_tokens: undefined,
    top_k: undefined,
    top_p: undefined,
    min_p: undefined,
    temperature: undefined,
    repeat_penalty: undefined,
    presence_penalty: undefined,
    frequency_penalty: undefined,
});

const form = ref({
    name: '',
    backend: uistate.value.backend,
});

async function addSamplingPreset() {
    console.log("Add pr")
    const cta: Record<string, any> = {};
    if (enableThinking.value) {
        cta.enable_thinking = true;
    }
    if (preserveThinking.value) {
        cta.preserve_thinking = true;
    }
    //console.log("Add pr 2");
    let m: string | undefined = undefined;
    if (selectedModel.value) {
        m = selectedModel.value.id != "" ? selectedModel.value.id : undefined;
    }
    const payload: SamplingPreset = {
        name: form.value.name,
        model: m,
        max_tokens: inferenceParams.max_tokens,
        top_k: inferenceParams.top_k,
        top_p: inferenceParams.top_p,
        min_p: inferenceParams.min_p,
        temperature: inferenceParams.temperature,
        repeat_penalty: inferenceParams.repeat_penalty,
        presence_penalty: inferenceParams.presence_penalty,
        frequency_penalty: inferenceParams.frequency_penalty,
        backend: form.value.backend,
        chat_template_kwargs: Object.keys(cta).length > 0 ? cta : undefined,
        props: undefined
    };
    //console.log("PL", payload);
    const res = await api.post("/models/preset/update", payload);
    if (!res.ok) {
        console.error("error creating model preset", res.status, res.text)
    }
    state.samplingPresets[payload.name] = payload;
    view.value = "view";
    mpopover.value.toggle()
}

const isValid = computed(() => Boolean(form.value.name && form.value.backend));

async function deletePreset(name: string) {
    confirmDanger(`Delete ${name} model preset?`, "The preset will be permanently deleted", async () => {
        const n = encodeURIComponent(name);
        const res = await api.del(`/models/preset/delete/${n}`);
        if (!res.ok) {
            msg.error("Error deleting preset", `${res.status} ${res.text}`)
        } else {
            msg.info("Preset deleted", "Done");
            delete state.samplingPresets[name];
        }
    })
}

function editPreset(name: string) {
    const preset = state.samplingPresets[name];
    form.value.name = preset.name;
    form.value.backend = preset.backend ?? uistate.value.backend;
    inferenceParams.max_tokens = preset.max_tokens;
    inferenceParams.top_k = preset.top_k;
    inferenceParams.top_p = preset.top_p;
    inferenceParams.min_p = preset.min_p;
    inferenceParams.temperature = preset.temperature;
    inferenceParams.repeat_penalty = preset.repeat_penalty;
    inferenceParams.presence_penalty = preset.presence_penalty;
    inferenceParams.frequency_penalty = preset.frequency_penalty;
    selectedModel.value = preset?.model ? state.models[preset.model] : { id: "", status: "", ctx: 0, hasVision: false };
    //console.log("P", preset)
    if (preset?.chat_template_kwargs) {
        if (preset.chat_template_kwargs?.enable_thinking) {
            enableThinking.value = true
        }
        if (preset.chat_template_kwargs?.preserve_thinking) {
            preserveThinking.value = true
        }
    }
    view.value = "create";
}

function reset() {
    form.value.name = "";
    form.value.backend = "";
    inferenceParams.max_tokens = undefined;
    inferenceParams.top_k = undefined;
    inferenceParams.top_p = undefined;
    inferenceParams.min_p = undefined;
    inferenceParams.temperature = undefined;
    inferenceParams.repeat_penalty = undefined;
    inferenceParams.presence_penalty = undefined;
    inferenceParams.frequency_penalty = undefined;
    view.value = "view";
}

function toggleView(v: 'view' | 'create') {
    view.value = v;
    if (v == 'view') {
        reset()
    }
}

onBeforeMount(() => {
    const md: Array<Record<string, any>> = [];
    for (const v of Object.values(state.models)) {
        const n = { ...v, label: `${v.id} - ${humanizeNumber(v.ctx)})` }
        md.push(toRaw(n))
    }
    modelsData.value = md;
    //console.log("Models data", modelsData.value)
});
</script>