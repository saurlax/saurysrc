<script setup lang="ts">
const { data: announcements } = await useFetch("/api/announcements?limit=50");

const posts = computed(
  () =>
    announcements.value?.map((item) => ({
      title: item.title,
      description: item.content,
      date: item.createdAt,
      badge: item.pinned ? "置顶" : undefined,
    })) ?? [],
);
</script>

<template>
  <UPage>
    <UPageHeader title="公告" description="查看所有公告" />
    <UPageBody>
      <UBlogPosts v-if="posts.length" :posts="posts" />
      <UEmpty v-else description="暂无公告" variant="naked" />
    </UPageBody>
  </UPage>
</template>
