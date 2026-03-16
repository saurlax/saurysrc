export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/api/admin")) {
    const { user } = await requireUserSession(event);
    if (!["superadmin", "admin"].includes(user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }
  }
});
