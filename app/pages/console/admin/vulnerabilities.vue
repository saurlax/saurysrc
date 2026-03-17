<script setup lang="ts">
const { data: vulnerabilities, refresh } = await useFetch(
  "/api/admin/vulnerabilities?limit=100",
);

const toast = useToast();
const { t } = useI18n();

const columns = [
  { accessorKey: "title", header: "标题" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "severity", header: "严重性" },
  { accessorKey: "isPublic", header: "是否公开" },
  { accessorKey: "status", header: "状态" },
  { accessorKey: "points", header: "积分" },
  { accessorKey: "createdAt", header: "创建时间" },
  { accessorKey: "actions", header: "操作" },
];

const reviewDrawer = ref(false);
const reviewingId = ref<number | null>(null);
const state = reactive({
  title: "",
  type: "",
  severity: "low" as (typeof vulnerabilitySeverityEnum)[number],
  unit: "",
  vendor: "",
  points: 0,
  description: "",
  advisory: "",
  status: "draft" as (typeof vulnerabilityStatusEnum)[number],
  isPublic: false,
});

const severityOptions = computed(() =>
  vulnerabilitySeverityEnum.map((value) => ({
    label: t(`vulnerability.severity.${value}`),
    value,
  })),
);

const statusOptions = [
  { label: t("vulnerability.status.approved"), value: "approved" },
  { label: t("vulnerability.status.pending"), value: "pending" },
  { label: t("vulnerability.status.rejected"), value: "rejected" },
  { label: t("vulnerability.status.duplicate"), value: "duplicate" },
  { label: t("vulnerability.status.draft"), value: "draft" },
];

function openReviewDrawer(item: any) {
  reviewingId.value = item.id;
  Object.assign(state, {
    title: item.title,
    type: item.type,
    severity: item.severity,
    unit: item.unit || "",
    vendor: item.vendor || "",
    points: item.points || 0,
    description: item.description,
    advisory: item.advisory || "",
    status: item.status,
    isPublic: item.isPublic ?? false,
  });
  reviewDrawer.value = true;
}

function submitReview() {
  $fetch(`/api/admin/vulnerabilities/${reviewingId.value}`, {
    method: "PUT",
    body: state,
  })
    .then(async () => {
      await refresh();
      toast.add({
        title: "审核成功",
        description: "漏洞状态已更新",
        color: "primary",
      });
      reviewDrawer.value = false;
    })
    .catch((error: any) => {
      toast.add({
        title: "审核失败",
        description: error.data?.message || error.message || "未知错误",
        color: "error",
      });
    });
}

function closeReviewDrawer() {
  reviewDrawer.value = false;
}
</script>

<template>
  <UPageHeader title="漏洞管理" description="查看系统内漏洞" />
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
      <template #status-cell="{ getValue }">
        <UBadge
          :color="t(`vulnerability.statusColor.${getValue()}`) as any"
          variant="subtle"
        >
          {{ t(`vulnerability.status.${getValue()}`) }}
        </UBadge>
      </template>
      <template #isPublic-cell="{ getValue }">
        {{ getValue() ? "是" : "否" }}
      </template>
      <template #createdAt-cell="{ row }">
        {{ new Date(row.original.createdAt).toLocaleString() }}
      </template>
      <template #actions-cell="{ row }">
        <UButton
          size="xs"
          icon="i-lucide-edit"
          variant="ghost"
          @click="openReviewDrawer(row.original)"
        />
      </template>
    </UTable>
  </UPageBody>

  <UDrawer
    v-model:open="reviewDrawer"
    class="w-md"
    direction="right"
    title="编辑漏洞"
    :handle="false"
    :handle-only="true"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="标题">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="类型">
          <UInput v-model="state.type" class="w-full" />
        </UFormField>

        <UFormField label="严重性">
          <USelect v-model="state.severity" :items="severityOptions" class="w-full" />
        </UFormField>

        <UFormField label="单位">
          <UInput v-model="state.unit" class="w-full" />
        </UFormField>

        <UFormField label="厂商">
          <UInput v-model="state.vendor" class="w-full" />
        </UFormField>

        <UFormField label="积分">
          <UInput v-model.number="state.points" type="number" class="w-full" />
        </UFormField>

        <UFormField label="描述">
          <UTextarea v-model="state.description" class="w-full" :rows="4" />
        </UFormField>

        <UFormField label="建议">
          <UTextarea v-model="state.advisory" class="w-full" :rows="3" />
        </UFormField>

        <UFormField label="状态" required>
          <USelect v-model="state.status" :items="statusOptions" class="w-full" />
        </UFormField>

        <UFormField label="是否公开">
          <UCheckbox v-model="state.isPublic" />
        </UFormField>

        <div class="flex justify-end gap-2 mt-4">
          <UButton type="button" variant="ghost" @click="closeReviewDrawer">
            取消
          </UButton>
          <UButton @click="submitReview">提交审核</UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
