<script setup lang="ts">
const { data } = await useFetch("/api/leaderboard");

const points = computed(() => data.value?.points ?? []);
const vulnerabilityCount = computed(() => data.value?.vulnerabilityCount ?? []);

const tabs = computed(() => [
  { label: "积分榜", value: "points", slot: "points" },
  { label: "漏洞榜", value: "vulnerabilityCount", slot: "vulnerabilityCount" },
]);

const pointsColumns = [
  { accessorKey: "rank", header: "名次" },
  { accessorKey: "name", header: "用户名" },
  { accessorKey: "points", header: "积分" },
];

const vulnerabilityCountColumns = [
  { accessorKey: "rank", header: "名次" },
  { accessorKey: "name", header: "用户名" },
  { accessorKey: "count", header: "漏洞数量" },
];
</script>

<template>
  <UPage>
    <UPageHeader title="排行榜" description="查看积分排名和漏洞数量排名" />
    <UPageBody>
      <UTabs :items="tabs" default-value="points" variant="link">
        <template #points>
          <UTable :data="points" :columns="pointsColumns" empty="暂无数据" />
        </template>

        <template #vulnerabilityCount>
          <UTable
            :data="vulnerabilityCount"
            :columns="vulnerabilityCountColumns"
            empty="暂无数据"
          />
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
