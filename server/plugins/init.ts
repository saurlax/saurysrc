import { db, schema } from "@nuxthub/db";

export default defineNitroPlugin(async () => {
  const users = await db.select().from(schema.users).limit(1);
  if (users.length === 0) {
    await db.insert(schema.users).values({
      name: "superadmin",
      email: "superadmin@example.com",
      password: await hashPassword("superadmin"),
      role: "superadmin",
    });
  }
});
