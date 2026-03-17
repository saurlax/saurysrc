import { z } from "zod";
import { db, schema } from "@nuxthub/db";

const bodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = bodySchema.parse(body);

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user || !user.password || !(await verifyPassword(user.password, password))) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  return await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
});
