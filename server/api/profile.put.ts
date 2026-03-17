import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.email("邮箱格式不正确"),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readBody(event);
  const { name, email } = bodySchema.parse(body);

  // 检查邮箱是否已被其他用户使用
  const existing = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      id: true,
    },
  });

  if (existing && existing.id !== user.id) {
    throw createError({ statusCode: 400, statusMessage: "邮箱已被使用" });
  }

  await db
    .update(schema.users)
    .set({
      name,
      email,
      updatedAt: new Date(),
    })
    .where(eq(schema.users.id, user.id));

  return { success: true };
});
