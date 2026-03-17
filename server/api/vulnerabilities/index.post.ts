import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { vulnerabilitySeverityEnum } from "../../../shared/types/db";

const bodySchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  type: z.string().min(1, "类型不能为空"),
  severity: z.enum(vulnerabilitySeverityEnum, { message: "请选择严重性" }),
  unit: z.string().optional(),
  vendor: z.string().optional(),
  description: z.string().min(1, "描述不能为空"),
  advisory: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readBody(event);
  const parsed = bodySchema.parse(body);

  const insertData: any = {
    title: parsed.title,
    type: parsed.type,
    severity: parsed.severity,
    unit: parsed.unit,
    vendor: parsed.vendor,
    description: parsed.description,
    advisory: parsed.advisory,
    authorId: user.id,
    points: 0,
    isPublic: false,
  };

  const [vulnerability] = await db
    .insert(schema.vulnerabilities)
    .values(insertData)
    .returning();

  return vulnerability;
});
