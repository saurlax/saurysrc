import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const announcement = await db.query.announcements.findFirst({
    where: (announcements, { eq }) => eq(announcements.id, id),
    columns: {
      id: true,
      title: true,
      content: true,
      pinned: true,
      createdAt: true,
      authorId: true,
    },
  });

  if (!announcement) {
    throw createError({ statusCode: 404, statusMessage: "Announcement not found" });
  }

  return announcement;
});
