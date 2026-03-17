<script setup lang="ts">
const { site } = useAppConfig();
const { t } = useI18n();

const { data: announcements } = await useFetch("/api/announcements");
const { data: vulnerabilities } = await useFetch("/api/vulnerabilities");

const announcementColumns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "createdAt", header: "创建时间" },
];

const vulnerabilityColumns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "severity", header: "严重级别" },
];
</script>

<template>
  <UPage>
    <UPageBody>
      <UPageCTA
        :title="site.title"
        :description="site.description"
        orientation="horizontal"
        variant="naked"
      >
        <template #links>
          <UButton to="/console/vulnerabilities">提交漏洞</UButton>
          <UButton to="/about" variant="outline">关于我们</UButton>
        </template>
        <Logo class="w-12" />
      </UPageCTA>
      <UPageColumns class="lg:columns-2">
        <UPageCard title="最新公告" variant="naked">
          <template #actions>
            <ULink to="/" variant="text">查看更多</ULink>
          </template>

          <template #default>
            <UTable
              :data="announcements"
              :columns="announcementColumns"
              empty="暂无公告"
            >
              <template #title-cell="{ row }">
                <ULink class="mr-1" :to="`/announcements/${row.original.id}`">
                  {{ row.original.title }}
                </ULink>
                <UBadge
                  v-if="row.original.pinned"
                  color="primary"
                  variant="subtle"
                  >置顶</UBadge
                >
              </template>
              <template #createdAt-cell="{ row }">
                {{ new Date(row.original.createdAt).toLocaleString() }}
              </template>
            </UTable>
          </template>
        </UPageCard>
        <UPageCard title="最新漏洞" variant="naked">
          <template #actions>
            <ULink to="/vulnerabilities" variant="text">查看更多</ULink>
          </template>

          <template #default>
            <UTable
              :data="vulnerabilities"
              :columns="vulnerabilityColumns"
              empty="暂无漏洞"
            >
              <template #severity-cell="{ getValue }">
                <UBadge
                  :color="t(`vulnerability.severityColor.${getValue()}`) as any"
                  variant="subtle"
                >
                  {{ t(`vulnerability.severity.${getValue()}`) }}
                </UBadge>
              </template>
            </UTable>
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageBody>
  </UPage>
</template>
