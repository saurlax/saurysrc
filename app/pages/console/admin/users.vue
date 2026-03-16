<script setup lang="ts">
import { computed } from "vue";

const { data } = await useFetch("/api/admin/users?limit=100");
const users = computed(() => data.value ?? []);

const columns = [
  { accessorKey: "name", header: "用户名" },
  { accessorKey: "email", header: "邮箱" },
  { accessorKey: "role", header: "角色" },
  { accessorKey: "points", header: "积分" },
];
</script>

<template>
  <UPageHeader title="用户管理" description="查看系统内用户" />
  <UPageBody>
    <UTable :data="users" :columns="columns" empty="暂无用户" />
  </UPageBody>
</template>
