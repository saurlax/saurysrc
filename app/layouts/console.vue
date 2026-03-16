<template>
  <NuxtLayout name="default">
    <UDashboardGroup>
      <UDashboardSidebar></UDashboardSidebar>
      <UDashboardPanel>
        <slot />
      </UDashboardPanel>
    </UDashboardGroup>
  </NuxtLayout>
</template>
