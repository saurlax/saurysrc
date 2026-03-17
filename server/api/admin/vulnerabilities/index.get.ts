import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db.query.vulnerabilities.findMany({
    orderBy: (vulnerabilities, { desc }) => [desc(vulnerabilities.createdAt)],
    limit,
    offset,
  });
});
