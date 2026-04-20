import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const existing = await db.query.vulnerabilities.findFirst({
    where: (vulnerabilities, { eq }) => eq(vulnerabilities.id, id),
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Vulnerability not found",
    });
  }

  const body = await readBody(event);
  const parsed = z
    .object({
      title: z.string().min(1, "标题不能为空").optional(),
      type: z.string().min(1, "类型不能为空").optional(),
      severity: z.enum(vulnerabilitySeverityEnum).optional(),
      unit: z.string().optional(),
      vendor: z.string().optional(),
      points: z.number().min(0).optional(),
      description: z.string().min(1, "描述不能为空").optional(),
      advisory: z.string().optional(),
      status: z.enum(vulnerabilityStatusEnum).optional(),
      isPublic: z.boolean().optional(),
    })
    .parse(body);

  const hasValidFields = Object.values(parsed).some((value) => value !== undefined);
  if (!hasValidFields) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid fields to update",
    });
  }

  const nextStatus = parsed.status ?? existing.status;
  const nextPoints = parsed.points ?? existing.points;
  const previousAwardedPoints = existing.status === "approved" ? existing.points : 0;
  const nextAwardedPoints = nextStatus === "approved" ? nextPoints : 0;
  const delta = nextAwardedPoints - previousAwardedPoints;

  return db.transaction(async (tx) => {
    const [vulnerability] = await tx
      .update(schema.vulnerabilities)
      .set({
        title: parsed.title ?? existing.title,
        type: parsed.type ?? existing.type,
        severity: parsed.severity ?? existing.severity,
        unit: parsed.unit ?? existing.unit,
        vendor: parsed.vendor ?? existing.vendor,
        points: parsed.points ?? existing.points,
        description: parsed.description ?? existing.description,
        advisory: parsed.advisory ?? existing.advisory,
        status: parsed.status ?? existing.status,
        isPublic: parsed.isPublic ?? existing.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(schema.vulnerabilities.id, id))
      .returning();

    if (delta !== 0) {
      await tx
        .update(schema.users)
        .set({
          pointsTotal: sql`${schema.users.pointsTotal} + ${delta}`,
          pointsBalance: sql`${schema.users.pointsBalance} + ${delta}`,
        })
        .where(eq(schema.users.id, existing.authorId));

      await tx.insert(schema.pointTransactions).values({
        userId: existing.authorId,
        points: delta,
        reason:
          delta > 0
            ? `漏洞积分发放：${existing.title}`
            : `漏洞积分回收：${existing.title}`,
      });
    }

    return vulnerability;
  });
});
