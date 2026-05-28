<template>
  <div id="params" class="flex w-full flex-col 3xl:max-w-[28rem] p-5">
    <InferenceParamsForm :inference-params="inferParams"></InferenceParamsForm>
  </div>
</template>

<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import type { InferenceParams } from '@agent-smith/types';
import { ref, watchEffect } from 'vue';
import InferenceParamsForm from '../InferenceParamsForm.vue';

const props = defineProps({
  inferenceParams: {
    type: Object as () => InferenceParams,
    required: true
  }
});

const emit = defineEmits(["paramchange"]);

//const top_p = ref(0.1);
const inferParams = ref(props.inferenceParams);

watchEffect(() => {
  inferParams.value = props.inferenceParams;
})
</script>

<style scoped>
.p-inputnumber-input {
  max-width: 4rem !important;
}
</style>

<style lang="sass" scoped>
#params
  & > #pform > div
    @apply min-w-[8rem]  
  .p-inputtext
    &:not(.w-full)
      width: 4rem !important
  .p-inputnumber-button
    background-color: #e2e8f0 !important
    color: black !important
    border: #e2e8f0 !important
  .p-slider-range
    @apply light
  .p-slider-handle
    @apply border bord-primary
.dark
  #params
    .p-inputnumber-button
      background-color: #525252 !important
</style>