import { db, schema } from "@nuxthub/db";
import { and, desc, eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 10);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  const pointsExpr = sql<number>`coalesce(sum(${schema.vulnerabilities.points}), 0)`.as("points");
  const countExpr = sql<number>`count(${schema.vulnerabilities.id})`.as("count");

  const points = (await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      points: pointsExpr,
    })
    .from(schema.users)
    .leftJoin(
      schema.vulnerabilities,
      and(
        eq(schema.vulnerabilities.authorId, schema.users.id),
        eq(schema.vulnerabilities.status, "approved"),
      ),
    )
    .groupBy(schema.users.id, schema.users.name)
    .orderBy(desc(pointsExpr))
    .limit(limit)
    .offset(offset)).map((item, index) => ({
      rank: offset + index + 1,
      id: item.id,
      name: item.name,
      points: Number(item.points),
    }));

  const vulnerabilityCount = (await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      count: countExpr,
    })
    .from(schema.users)
    .leftJoin(
      schema.vulnerabilities,
      and(
        eq(schema.vulnerabilities.authorId, schema.users.id),
        eq(schema.vulnerabilities.status, "approved"),
      ),
    )
    .groupBy(schema.users.id, schema.users.name)
    .orderBy(desc(countExpr))
    .limit(limit)
    .offset(offset)).map((item, index) => ({
      rank: offset + index + 1,
      id: item.id,
      name: item.name,
      count: Number(item.count),
    }));

  return { points, vulnerabilityCount };
});
