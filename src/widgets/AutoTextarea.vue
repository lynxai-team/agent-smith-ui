<template>
  <div class="w-full overflow-y-visible h-min">
    <template v-if="isReady">
      <div v-show="showSkills">
        <Listbox :options="skills" filter optionLabel="name" @update:modelValue="selectSkill($event)" class="w-56" />
      </div>
    </template>
    <Textarea v-if="auto" v-model="_data" rows="1" autoResize @focusout="ch()" class="focus:ring-0 border bord-lighter"
      fluid />
    <Textarea v-else v-model="_data" rows="8" @focusout="ch()" class="focus:ring-0 border bord-light" fluid />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import Textarea from 'primevue/textarea';
import { watchDebounced } from '@vueuse/core';
import Listbox from 'primevue/listbox';
import { onKeyStroke } from '@vueuse/core';
import "../assets/index.css";
import { api } from '../services/api.js';

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

const showSkills = ref(false);
const skills = ref<Array<Record<string, any>>>([]);
const _data = ref(props.data);
const isReady = ref(false);

function selectSkill(event: any) {
  console.log("EVT", event);
  _data.value = _data.value + event.name;
  showSkills.value = false
}

function ch() {
  if (_data.value.endsWith("%")) {
    showSkills.value = true
  }
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

/*const rows = computed(() => {
  const nlines = _data.value.split("\n").length;
  if (nlines > props.maxlines) {
    return props.maxlines
  }
  return nlines == 0 ? 1 : nlines
});*/

async function init() {
  const res = await api.get<Array<Record<string, any>>>("/skills");
  const sorted = [...Object.values(res.data)].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  skills.value = sorted;
  isReady.value = true
}

onBeforeMount(() => init())

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
);
</script>