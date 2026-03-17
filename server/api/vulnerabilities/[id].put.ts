import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  title: z.string().min(1, "标题不能为空").optional(),
  type: z.string().min(1, "类型不能为空").optional(),
  severity: z.enum(vulnerabilitySeverityEnum, { message: "请选择严重性" }).optional(),
  unit: z.string().optional(),
  vendor: z.string().optional(),
  description: z.string().min(1, "描述不能为空").optional(),
  advisory: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  // Check if the vulnerability belongs to the user
  const existing = await db.query.vulnerabilities.findFirst({
    where: (vulnerabilities, { eq }) => eq(vulnerabilities.id, id),
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Vulnerability not found",
    });
  }

  if (existing.authorId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  if (existing.status !== "draft") {
    throw createError({
      statusCode: 400,
      statusMessage: "Only draft vulnerabilities can be edited",
    });
  }

  const body = await readBody(event);
  const parsed = bodySchema.parse(body);

  const updateData = {
    title: parsed.title,
    type: parsed.type,
    severity: parsed.severity,
    unit: parsed.unit,
    vendor: parsed.vendor,
    description: parsed.description,
    advisory: parsed.advisory,
    updatedAt: new Date(),
  };

  const [vulnerability] = await db
    .update(schema.vulnerabilities)
    .set(updateData)
    .where(eq(schema.vulnerabilities.id, id))
    .returning();

  return vulnerability;
});
