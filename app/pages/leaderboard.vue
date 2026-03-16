<script setup lang="ts">
const { data } = await useFetch("/api/leaderboard");

const users = computed(() => data.value?.users ?? []);
const teams = computed(() => data.value?.teams ?? []);

const tabs = computed(() => [
  { label: "用户榜", value: "users", slot: "users" },
  { label: "团队榜", value: "teams", slot: "teams" },
]);

const userColumns = [
  { accessorKey: "rank", header: "名次" },
  { accessorKey: "name", header: "用户名" },
  { accessorKey: "points", header: "积分" },
];

const teamColumns = [
  { accessorKey: "rank", header: "名次" },
  { accessorKey: "name", header: "团队" },
  { accessorKey: "points", header: "积分" },
];
</script>

<template>
  <UPage>
    <UPageHeader title="排行榜" description="查看当前用户与团队的积分排名" />
    <UPageBody>
      <UTabs :items="tabs" default-value="users" variant="link">
        <template #users>
          <UTable :data="users" :columns="userColumns" empty="暂无数据" />
        </template>

        <template #teams>
          <UTable :data="teams" :columns="teamColumns" empty="暂无数据" />
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
