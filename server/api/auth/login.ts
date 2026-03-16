import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  
  const { email, password } = bodySchema.parse(body);

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (!user || !(await verifyPassword(password, user.password))) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  return await setUserSession(event, {
    id: user.id,
    name: user.name,
    role: user.role,
  });
});
