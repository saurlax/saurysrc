<script setup lang="ts">
const { user, clear: logout } = useUserSession();

const { site } = useAppConfig();

const navItems = computed(() => [
  { label: "公告", to: "/announcements" },
  { label: "漏洞", to: "/vulnerabilities" },
  { label: "排行榜", to: "/leaderboard" },
  { label: "控制台", to: "/console" },
]);

const userMenuItems = computed(() => {
  return user.value
    ? [
        { label: "个人中心", to: "/profile" },
        { label: "退出登录", onClick: logout },
      ]
    : [{ label: "登录/注册", to: "/login" }];
});
</script>

<template>
  <UHeader :title="site.title" :description="site.description">
    <UNavigationMenu class="hidden md:block" :items="navItems" />
    <template #right>
      <UDropdownMenu :items="userMenuItems">
        <UButton
          :label="user?.name || '访客'"
          icon="i-lucide-user"
          variant="ghost"
        />
      </UDropdownMenu>
    </template>
    <template #body>
      <UNavigationMenu orientation="vertical" :items="navItems" />
    </template>
  </UHeader>

  <UMain>
    <UContainer>
      <slot />
    </UContainer>
  </UMain>

  <UFooter>
    <template #left>
      <div class="text-sm text-muted">
        © {{ new Date().getFullYear() }} {{ site.title }}.
      </div>
    </template>
    <template #right>
      <UNavigationMenu variant="link" :items="navItems" />
    </template>
  </UFooter>
</template>
