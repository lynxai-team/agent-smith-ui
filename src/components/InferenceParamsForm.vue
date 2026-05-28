<template>
    <div>
        <div class="flex flex-wrap gap-3 justify-center">
            <div class="flex flex-col w-min">
                <label for="temp" class="txt-semilight">Temp</label>
                <div>
                    <InputNumber v-model="inferParams.temperature" inputId="temp" :min="0" :max="2" :step="0.1"
                        showButtons buttonLayout="vertical" size="small" style="width: 3rem"
                        @value-change="$emit('paramchange', inferParams)" />
                </div>
            </div>
            <div class="flex flex-col">
                <label for="topK" class="txt-semilight">TopK</label>
                <InputNumber v-model="inferParams.top_k" inputId="topK" :min="0" :max="100" showButtons
                    buttonLayout="vertical" size="small" style="width: 3rem" />
            </div>
            <div class="flex flex-col">
                <label for="topP" class="txt-semilight"> Top p</label>
                <InputNumber v-model="inferParams.top_p" inputId="topP" :min="0" :max="1" :step="0.01" showButtons fluid
                    buttonLayout="vertical" size="small" style="width: 3rem" />
            </div>
            <div class="flex flex-col">
                <label for="minP" class="txt-semilight">MinP</label>
                <InputNumber v-model="inferParams.min_p" inputId="minP" :min="0" :max="1" :step="0.01" showButtons fluid
                    buttonLayout="vertical" size="small" style="width: 3rem" />
            </div>
            <div class="flex flex-col">
                <label for="repeatPenalty" class="txt-semilight">Repeat</label>
                <InputNumber v-model="inferParams.repeat_penalty" inputId="repeatPenalty" :min="0" :max="2" :step="0.1"
                    buttonLayout="vertical" size="small" style="width: 3rem" showButtons />
            </div>
            <div class="flex flex-col">
                <label for="repeatPenalty" class="txt-semilight">Pres</label>
                <InputNumber v-model="inferParams.presence_penalty" inputId="presencePenalty" :min="0" :max="2"
                    :step="0.1" buttonLayout="vertical" size="small" style="width: 3rem" showButtons />
            </div>
            <div class="flex flex-col">
                <label for="repeatPenalty" class="txt-semilight">Freq</label>
                <InputNumber v-model="inferParams.frequency_penalty" inputId="frequencyPenalty" :min="0" :max="2"
                    :step="0.1" buttonLayout="vertical" size="small" style="width: 3rem" showButtons />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import type { InferenceParams } from '@agent-smith/types';
import { watchEffect, ref } from 'vue';

const props = defineProps<{
    inferenceParams: InferenceParams
}>();
const emit = defineEmits(["paramchange"]);

//const top_p = ref(0.1);
const inferParams = ref<InferenceParams>(props.inferenceParams);

watchEffect(() => {
    inferParams.value = props.inferenceParams;
})
</script>

<style scoped>
.p-inputnumber-input {
    max-width: 4rem !important;
}
</style>