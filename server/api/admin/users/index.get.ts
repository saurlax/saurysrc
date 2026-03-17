import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  const rows = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      pointsTotal: true,
    },
    orderBy: (users, { desc }) => [desc(users.pointsTotal)],
    limit,
    offset,
  });

  return rows.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
    points: item.pointsTotal,
  }));
});
