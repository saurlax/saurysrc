<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const { site } = useAppConfig();
const { user, fetch } = useUserSession();
const toast = useToast();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "邮箱",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "密码",
    required: true,
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required"),
});

function login(payload: FormSubmitEvent<z.output<typeof schema>>) {
  $fetch("/api/auth/login", {
    method: "POST",
    body: payload.data,
  })
    .then(async () => {
      await fetch();
    })
    .catch((err) => {
      toast.add({
        title: "登录失败",
        color: "error",
        description: err.data?.message || err.message,
      });
    });
}
</script>

<template>
  <UPage>
    <UPageBody>
      <UAuthForm
        class="max-w-md mx-auto"
        :title="`登录到 ${site.title}`"
        :fields="fields"
        :schema="schema"
        @submit="login"
      />
    </UPageBody>
  </UPage>
</template>
