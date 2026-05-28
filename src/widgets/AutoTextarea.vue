<template>
  <div class="w-full overflow-y-visible h-min">
    <Textarea v-if="auto" v-model="_data" rows="1" autoResize @focusout="ch()" class="focus:ring-0 border bord-lighter"
      fluid />
    <Textarea v-else v-model="_data" rows="8" @focusout="ch()" class="focus:ring-0 border bord-light" fluid />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Textarea from 'primevue/textarea';
import { watchDebounced } from '@vueuse/core';
import { onKeyStroke } from '@vueuse/core';
import "../assets/index.css";

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
  maxlines: {
    type: Number,
    default: 8,
  }
});

const emit = defineEmits(["update", "run"]);

const _data = ref(props.data);

function ch() {
  emit("update", _data.value);
}

onKeyStroke(
  e => e.key === 'Enter' && e.ctrlKey,
  (e) => emit("run")
)

const auto = computed(() => {
  const nlines = _data.value.split("\n").length;
  return (nlines <= props.maxlines) ? true : false
});

const rows = computed(() => {
  const nlines = _data.value.split("\n").length;
  if (nlines > props.maxlines) {
    return props.maxlines
  }
  return nlines == 0 ? 1 : nlines
});

watchDebounced(
  _data,
  () => { ch() },
  { debounce: 200, maxWait: 1000 },
)

watch(
  () => props.data,
  (_d) => {
    _data.value = _d
  }
)
</script>