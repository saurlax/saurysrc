<script setup lang="ts">
import { computed } from "vue";

const { data } = await useFetch("/api/admin/vulnerabilities?limit=100");
const vulnerabilities = computed(() => data.value ?? []);

const columns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "severity", header: "严重性" },
  { accessorKey: "status", header: "状态" },
  { accessorKey: "points", header: "积分" },
  { accessorKey: "createdAt", header: "创建时间" },
];
</script>

<template>
  <UPageHeader title="漏洞管理" description="查看系统内漏洞" />
  <UPageBody>
    <UTable :data="vulnerabilities" :columns="columns" empty="暂无漏洞" />
  </UPageBody>
</template>
