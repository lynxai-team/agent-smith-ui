<template>
  <div></div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const file = "/home/ggg/dev/js/agentenv/agent-smith-plugins/agents/dist/skills/use-lat/SKILL.md";
const line = 6;
const column = 7;

const vscodeUrl =
  `vscode://file${encodeURI(file)}:${line}:${column}`;

onBeforeMount(() => {
  const q = router.currentRoute.value.query;
  let url = ""
  if (q?.redirect) {
    url = q.redirect.toString();
    if (q?.plugins) {
      if (q.plugins.toString() == "1") {
        url = url + "?plugins=1"
      }
    }
    router.push(url)
  }
})
</script>