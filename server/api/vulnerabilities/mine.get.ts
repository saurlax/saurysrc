import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const query = getQuery(event);
  const limit = Number(query.limit ?? 20);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  return db.query.vulnerabilities.findMany({
    where: (vulnerabilities, { eq }) => eq(vulnerabilities.authorId, user.id),
    orderBy: (vulnerabilities, { desc }) => [desc(vulnerabilities.createdAt)],
    limit,
    offset,
  });
});
