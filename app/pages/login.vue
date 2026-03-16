<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const { site } = useAppConfig();
const { fetch } = useUserSession();
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
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

function login(payload: FormSubmitEvent<z.output<typeof schema>>) {
  $fetch("/api/auth/login", {
    method: "POST",
    body: payload.data,
  })
    .then(() => {
      fetch();
      navigateTo("/");
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
  <UAuthForm
    class="max-w-md mx-auto mt-8"
    :title="`登录到 ${site.title}`"
    :fields="fields"
    :schema="schema"
    @submit="login"
  />
</template>
