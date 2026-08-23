<template>
  <div id="params" class="3xl:max-w-[28rem] p-5 w-fit">
    <InferenceParamsForm></InferenceParamsForm>
  </div>
</template>

<script setup lang="ts">
import InferenceParamsForm from '../InferenceParamsForm.vue';
</script>

<style scoped>
.p-inputnumber-input {
  max-width: 4rem !important;
}
</style>

<style lang="css" scoped>
@reference "../../styles/global.css";

#params > #pform > div {
    @apply min-w-32;
}
#params .p-inputtext:not(.w-full) {
    width: 4rem !important;
}
#params .p-inputnumber-button {
    background-color: #e2e8f0 !important;
    color: black !important;
    border: #e2e8f0 !important;
}
#params .p-slider-range {
    @apply light;
}
#params .p-slider-handle {
    @apply border border-prim;
}
.dark #params .p-inputnumber-button {
    background-color: #525252 !important;
}
</style>