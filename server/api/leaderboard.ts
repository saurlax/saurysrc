import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 10);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  const users = (await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      pointsTotal: true,
    },
    orderBy: (users, { desc }) => [desc(users.pointsTotal)],
    limit,
    offset,
  })).map((item) => ({
    id: item.id,
    name: item.name,
    points: item.pointsTotal,
  }));

  const teams = (await db.query.teams.findMany({
    columns: {
      id: true,
      name: true,
      pointsTotal: true,
    },
    orderBy: (teams, { desc }) => [desc(teams.pointsTotal)],
    limit,
    offset,
  })).map((item) => ({
    id: item.id,
    name: item.name,
    points: item.pointsTotal,
  }));

  return { users, teams };
});
