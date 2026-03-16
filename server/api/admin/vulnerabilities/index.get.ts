import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db
    .select({
      id: schema.vulnerabilities.id,
      title: schema.vulnerabilities.title,
      type: schema.vulnerabilities.type,
      severity: schema.vulnerabilities.severity,
      status: schema.vulnerabilities.status,
      points: schema.vulnerabilities.points,
      createdAt: schema.vulnerabilities.createdAt,
    })
    .from(schema.vulnerabilities)
    .orderBy(desc(schema.vulnerabilities.createdAt))
    .limit(limit)
    .offset(offset);
});
