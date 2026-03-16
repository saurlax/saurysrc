<script setup lang="ts">
import { computed } from "vue";

const { data } = await useFetch("/api/admin/teams?limit=100");
const teams = computed(() => data.value ?? []);

const columns = [
  { accessorKey: "name", header: "团队" },
  { accessorKey: "points", header: "积分" },
];
</script>

<template>
  <UPageHeader title="团队管理" description="查看系统内团队" />
  <UPageBody>
    <UTable :data="teams" :columns="columns" empty="暂无团队" />
  </UPageBody>
</template>
