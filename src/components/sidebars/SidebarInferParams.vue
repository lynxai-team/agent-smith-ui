<template>
  <div id="params" class="3xl:max-w-[28rem] p-5 w-fit">
    <InferenceParamsForm></InferenceParamsForm>
  </div>
</template>

<script setup lang="ts">
import InferenceParamsForm from '../InferenceParamsForm.vue';
</script>

<style lang="css" scoped>
@reference "../../styles/global.css";

#params > #pform > div {
    @apply min-w-32;
}
#params .p-slider-range {
    @apply light;
}
#params .p-slider-handle {
    @apply border border-prim;
}
</style>