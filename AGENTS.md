This project is built with nuxt@4 + @nuxt/hub + @nuxt/ui + @nuxtjs/i18n + nuxt-auth-utils, please refer to Context7 for their documentation.

- Most of the files should NOT be imported, they are auto-imported by nuxt, you can directly use them in your code.
- The backend API should be as simple as possible. Do not arbitrarily customize the Type. If there is no need, do not perform too much validation. Please use Zod to validate the request body.
- Database operations use the Drizzle ORM provided by NuxtHub. The database schema is defined in `server/db/schema.ts`.
- The backend directly returns the result returned by the database. For example, `return db.select().from(users).where(eq(users.id, userId))`.
- Authentication should use `await getUserSession(event)` and `await requireUserSession(event)` from nuxt-auth-utils.
- For error messages in Toast, add `e.data.message || e.message` in the description to display the specific error information.
