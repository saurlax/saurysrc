import { db, schema } from "@nuxthub/db";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db
    .select({
      id: schema.announcements.id,
      title: schema.announcements.title,
      pinned: schema.announcements.pinned,
      createdAt: schema.announcements.createdAt,
    })
    .from(schema.announcements)
    .orderBy(desc(schema.announcements.pinned), desc(schema.announcements.createdAt))
    .limit(limit)
    .offset(offset);
});
