import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit ?? 5);
  const page = Math.max(Number(query.page ?? 1), 1);
  const offset = (page - 1) * limit;

  const rows = await db.query.vulnerabilities.findMany({
    where: (vulnerabilities, { eq }) => eq(vulnerabilities.isPublic, true),
    orderBy: (vulnerabilities, { desc }) => [desc(vulnerabilities.createdAt)],
    limit,
    offset,
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
  });

  return rows.map((item) => ({
    ...item,
    authorName: item.author?.name,
  }));
});
