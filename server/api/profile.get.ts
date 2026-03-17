import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const profile = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      pointsTotal: true,
      pointsBalance: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return profile;
});
