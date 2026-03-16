<script setup lang="ts">
import { computed } from "vue";

const { data } = await useFetch("/api/admin/announcements?limit=100");
const announcements = computed(() => data.value ?? []);

const columns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "pinned", header: "置顶" },
  { accessorKey: "createdAt", header: "创建时间" },
];
</script>

<template>
  <UPageHeader title="公告管理" />
  <UPageBody>
    <UTable :data="announcements" :columns="columns" empty="暂无公告" />
  </UPageBody>
</template>
