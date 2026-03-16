<script setup lang="ts">
const { data: announcements } = await useFetch("/api/announcements");
const { data: vulnerabilities } = await useFetch("/api/vulnerabilities");

const announcementColumns = [{ accessorKey: "title", header: "标题" }];

const vulnerabilityColumns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "severity", header: "严重级别" },
];
</script>

<template>
  <UPageCard
    class="my-8"
    title="最新公告"
    description="展示最近发布的公告。"
    variant="naked"
  >
    <template #actions>
      <ULink to="/" variant="text">查看更多</ULink>
    </template>

    <template #default>
      <UTable
        :data="announcements"
        :columns="announcementColumns"
        empty="暂无公告"
      />
    </template>
  </UPageCard>

  <UPageCard
    title="最新漏洞"
    description="展示最新创建的漏洞列表。"
    variant="naked"
  >
    <template #actions>
      <ULink to="/vulnerabilities" variant="text">查看更多</ULink>
    </template>

    <template #default>
      <UTable
        :data="vulnerabilities"
        :columns="vulnerabilityColumns"
        empty="暂无漏洞"
      />
    </template>
  </UPageCard>
</template>
