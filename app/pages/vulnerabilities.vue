<script setup lang="ts">
const { t } = useI18n();

const { data: vulnerabilities } = await useFetch(
  "/api/vulnerabilities?limit=50",
);

const columns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "unit", header: "单位" },
  { accessorKey: "authorName", header: "作者" },
  { accessorKey: "severity", header: "严重级别" },
];
</script>

<template>
  <UPage>
    <UPageHeader title="漏洞" description="查看所有漏洞" />
    <UPageBody>
      <UTable :data="vulnerabilities" :columns="columns" empty="暂无漏洞">
        <template #severity-cell="{ getValue }">
          <UBadge
            :color="t(`vulnerability.severityColor.${getValue()}`) as any"
            variant="subtle"
          >
            {{ t(`vulnerability.severity.${getValue()}`) }}
          </UBadge>
        </template>
      </UTable>
    </UPageBody>
  </UPage>
</template>
