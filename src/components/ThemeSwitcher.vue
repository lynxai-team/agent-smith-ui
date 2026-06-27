<template>
    <select id="theme-select" v-model="selectedTheme" class="p-2 border border-light rounded" @change="onThemeSwitch()">
        <option v-for="theme in themes" :value="theme" :selected="theme == uistate.theme">
            {{ theme }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { setTheme, uistate } from '../state.js';
import { themes } from '../conf.js';
import { ref, toRaw } from 'vue';


const selectedTheme = ref(toRaw(uistate.value.theme));

function onThemeSwitch() {
    setTheme(selectedTheme.value);
}
</script>