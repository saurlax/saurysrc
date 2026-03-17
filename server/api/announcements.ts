import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  return db.query.announcements.findMany({
    orderBy: (announcements, { desc }) => [
      desc(announcements.pinned),
      desc(announcements.createdAt),
    ],
  });
});
