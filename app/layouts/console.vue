<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const { user } = useUserSession();

if (!user.value) {
  navigateTo("/login");
}

const navItems = computed(() => {
  const items: NavigationMenuItem[] = [
    { label: "数据看板", icon: "i-lucide-layout-dashboard", to: "/console" },
    { label: "个人信息", type: "label" },
    { label: "个人设置", icon: "i-lucide-settings", to: "/console/profile" },
    { label: "我的漏洞", icon: "i-lucide-bug", to: "/console/vulnerabilities" },
    { label: "我的团队", icon: "i-lucide-users", to: "/console/team" },
  ];
  if (["superadmin", "admin"].includes(user.value?.role ?? "")) {
    items.push(
      { label: "平台管理", type: "label" },
      {
        label: "公告管理",
        icon: "i-lucide-bell",
        to: "/console/admin/announcements",
      },
      {
        label: "漏洞管理",
        icon: "i-lucide-shield",
        to: "/console/admin/vulnerabilities",
      },
    );
  }
  if (user.value?.role === "superadmin") {
    items.push(
      { label: "系统管理", type: "label" },
      {
        label: "用户管理",
        icon: "i-lucide-users",
        to: "/console/admin/users",
      },
      {
        label: "系统设置",
        icon: "i-lucide-settings",
        to: "/console/admin/settings",
      },
    );
  }
  return items;
});
</script>

<template>
  <NuxtLayout name="default">
    <UPage>
      <template #left>
        <UPageAside>
          <UNavigationMenu :items="navItems" orientation="vertical" />
        </UPageAside>
      </template>
      <slot />
    </UPage>
  </NuxtLayout>
</template>
