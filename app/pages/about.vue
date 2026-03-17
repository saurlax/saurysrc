<script setup lang="ts">
const { site } = useAppConfig();
</script>

<template>
  <UPage>
    <UPageHeader title="关于我们" />
    <UPageBody>
      <MDC :value="site.description" />
    </UPageBody>
  </UPage>
</template>
