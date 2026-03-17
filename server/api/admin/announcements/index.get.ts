import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db.query.announcements.findMany({
    columns: {
      id: true,
      title: true,
      content: true,
      pinned: true,
      createdAt: true,
    },
    orderBy: (announcements, { desc }) => [
      desc(announcements.pinned),
      desc(announcements.createdAt),
    ],
    limit,
    offset,
  });
});
