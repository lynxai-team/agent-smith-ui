<template>
  <div class="flex flex-col mb-8 space-y-3">

  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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