<script setup lang="ts">
import { z } from "zod";

const { data, refresh } = await useFetch("/api/vulnerabilities/mine?limit=100");
const vulnerabilities = computed(() => data.value ?? []);

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

const openDrawer = ref(false);

const editingId = ref<number | null>(null);

const schema = z.object({
  title: z.string().min(1, "标题不能为空"),
  type: z.string().min(1, "类型不能为空"),
  severity: z.enum(vulnerabilitySeverityEnum, {
    message: "请选择严重性",
  }),
  unit: z.string().optional(),
  vendor: z.string().optional(),
  description: z.string().min(1, "描述不能为空"),
  advisory: z.string().optional(),
});

type VulnerabilityForm = z.output<typeof schema>;
const state = reactive<VulnerabilityForm>({
  title: "",
  type: "",
  severity: "low",
  unit: "",
  vendor: "",
  description: "",
  advisory: "",
});

const toast = useToast();

function openNewDrawer() {
  editingId.value = null;
  Object.assign(state, {
    title: "",
    type: "",
    severity: "low",
    unit: "",
    vendor: "",
    description: "",
    advisory: "",
  });
  openDrawer.value = true;
}

function openEditDrawer(item: any) {
  editingId.value = item.id;
  Object.assign(state, {
    title: item.title,
    type: item.type,
    severity: item.severity,
    unit: item.unit || "",
    vendor: item.vendor || "",
    description: item.description,
    advisory: item.advisory || "",
  });
  openDrawer.value = true;
}

function submit() {
  const url = editingId.value
    ? `/api/vulnerabilities/${editingId.value}`
    : "/api/vulnerabilities";
  const method = editingId.value ? "PUT" : "POST";

  $fetch(url, {
    method,
    body: state,
  })
    .then(async () => {
      await refresh();
      toast.add({
        title: editingId.value ? "编辑成功" : "提交成功",
        description: editingId.value ? "漏洞已更新" : "漏洞已提交审核",
        color: "primary",
      });
      openDrawer.value = false;
    })
    .catch((error: any) => {
      toast.add({
        title: editingId.value ? "编辑失败" : "提交失败",
        description: error.data?.message || error.message || "未知错误",
        color: "error",
      });
    });
}

function closeDrawer() {
  openDrawer.value = false;
}

const severityOptions = computed(() =>
  vulnerabilitySeverityEnum.map((value) => ({
    label: t(`vulnerability.severity.${value}`),
    value,
  })),
);
</script>

<template>
  <UPage>
    <UPageHeader title="我的漏洞">
      <template #links>
        <UButton color="neutral" variant="outline" @click="openNewDrawer"
          >新建漏洞</UButton
        >
      </template>
    </UPageHeader>
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
            v-if="row.original.status === 'draft'"
            size="xs"
            icon="i-lucide-edit"
            variant="ghost"
            @click="openEditDrawer(row.original)"
          />
        </template>
      </UTable>
    </UPageBody>

    <UDrawer
      v-model:open="openDrawer"
      class="w-md"
      direction="right"
      :title="editingId ? '编辑漏洞' : '新建漏洞'"
      :handle="false"
      :handle-only="true"
    >
      <template #body>
        <UForm
          class="flex flex-col gap-2"
          :schema="schema"
          :state="state"
          @submit="submit"
        >
          <UFormField name="title" label="标题" required>
            <UInput
              v-model="state.title"
              class="w-full"
              placeholder="漏洞标题"
            />
          </UFormField>

          <UFormField name="type" label="类型" required>
            <UInput
              v-model="state.type"
              class="w-full"
              placeholder="漏洞类型"
            />
          </UFormField>

          <UFormField name="severity" label="严重性" required>
            <USelect
              v-model="state.severity"
              :items="severityOptions"
              class="w-full"
            />
          </UFormField>

          <UFormField name="unit" label="单位">
            <UInput
              v-model="state.unit"
              class="w-full"
              placeholder="受影响单位"
            />
          </UFormField>

          <UFormField name="vendor" label="厂商">
            <UInput
              v-model="state.vendor"
              class="w-full"
              placeholder="厂商名称"
            />
          </UFormField>

          <UFormField name="description" label="描述" required>
            <UTextarea
              v-model="state.description"
              class="w-full"
              placeholder="详细描述漏洞"
              :rows="4"
            />
          </UFormField>

          <UFormField name="advisory" label="建议">
            <UTextarea
              v-model="state.advisory"
              class="w-full"
              placeholder="修复建议"
              :rows="3"
            />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton type="button" variant="ghost" @click="closeDrawer"
              >取消</UButton
            >
            <UButton type="submit">{{ editingId ? "保存" : "提交" }}</UButton>
          </div>
        </UForm>
      </template>
    </UDrawer>
  </UPage>
</template>
