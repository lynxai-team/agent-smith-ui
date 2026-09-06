<template>
    <div :class="(uistate.inferenceSidebar == 'full') || auto ? 'w-[18rem]' : 'w-min'">
        <div class="flex flex-wrap gap-3 justify-center">
            <div class="flex flex-col w-min">
                <label for="temp" class="text-semilight">Temp</label>
                <div>
                    <SwInputNumber :modelValue="inferParams.temperature ?? null" inputId="temp" :min="0" :max="2"
                        :step="0.1" showButtons buttonLayout="vertical" size="small" style="width: 3rem"
                        @update:modelValue="setParam('temperature', $event)" />
                </div>
            </div>
            <div class="flex flex-col">
                <label for="topK" class="text-semilight">TopK</label>
                <SwInputNumber :modelValue="inferParams.top_k ?? null" inputId="topK" :min="0" :max="100" showButtons
                    buttonLayout="vertical" size="small" style="width: 3rem"
                    @update:modelValue="setParam('top_k', $event)" />
            </div>
            <div class="flex flex-col">
                <label for="topP" class="text-semilight"> Top p</label>
                <SwInputNumber :modelValue="inferParams.top_p ?? null" inputId="topP" :min="0" :max="1" :step="0.01"
                    showButtons fluid buttonLayout="vertical" size="small" style="width: 3rem"
                    @update:modelValue="setParam('top_p', $event)" />
            </div>
            <div class="flex flex-col">
                <label for="minP" class="text-semilight">MinP</label>
                <SwInputNumber :modelValue="inferParams.min_p ?? null" inputId="minP" :min="0" :max="1" :step="0.01"
                    showButtons fluid buttonLayout="vertical" size="small" style="width: 3rem"
                    @update:modelValue="setParam('min_p', $event)" />
            </div>
            <div class="flex flex-col">
                <label for="repeatPenalty" class="text-semilight">Repeat</label>
                <SwInputNumber :modelValue="inferParams.repeat_penalty ?? null" inputId="repeatPenalty" :min="0"
                    :max="2" :step="0.1" buttonLayout="vertical" size="small" style="width: 3rem" showButtons
                    @update:modelValue="setParam('repeat_penalty', $event)" />
            </div>
            <div class="flex flex-col">
                <label for="presencePenalty" class="text-semilight">Pres</label>
                <SwInputNumber :modelValue="inferParams.presence_penalty ?? null" inputId="presencePenalty" :min="0"
                    :max="2" :step="0.1" buttonLayout="vertical" size="small" style="width: 3rem" showButtons
                    @update:modelValue="setParam('presence_penalty', $event)" />
            </div>
            <div class="flex flex-col">
                <label for="frequencyPenalty" class="text-semilight">Freq</label>
                <SwInputNumber :modelValue="inferParams.frequency_penalty ?? null" inputId="frequencyPenalty"
                    :min="0" :max="2" :step="0.1" buttonLayout="vertical" size="small" style="width: 3rem" showButtons
                    @update:modelValue="setParam('frequency_penalty', $event)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InferenceParams } from '@agent-smith/types';
import { computed, ref, watch } from 'vue';
import SwInputNumber from './vibe/inputnumber/SwInputNumber.vue';
import { inferOptions, uistate } from '../state.js';

const props = defineProps<{
    inferenceParams?: InferenceParams,
    auto?: boolean,
}>();
const emit = defineEmits(["paramchange"]);

type ParamKey = 'temperature' | 'top_k' | 'top_p' | 'min_p' |
    'repeat_penalty' | 'presence_penalty' | 'frequency_penalty';

// Fields edit the shared params object in place (either the prop or the global state).
const inferParams = ref<InferenceParams>(props?.inferenceParams ?? inferOptions.params);

// Track the effective source so external resets (e.g. new conversation) refresh the form.
watch(computed(() => props.inferenceParams ?? inferOptions.params), (source) => {
    inferParams.value = source;
}, { immediate: true });

// Write a field, removing the key when empty so inferParams only carries set params.
function setParam(key: ParamKey, value: number | null) {
    const p = inferParams.value;
    if (value == null) delete p[key];
    else p[key] = value;
    emit('paramchange', { ...p });
}
</script>
