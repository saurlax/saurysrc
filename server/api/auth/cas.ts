import { db, schema } from "@nuxthub/db";

function extractCasValue(xml: string, tags: string[]) {
  for (const tag of tags) {
    const match = xml.match(new RegExp(`<cas:${tag}>([^<]+)</cas:${tag}>`));
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

export default defineEventHandler(async (event) => {
  const {
    public: { casBaseUrl, casServiceUrl },
  } = useRuntimeConfig(event);

  if (!casBaseUrl || !casServiceUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "CAS is not configured",
    });
  }

  const { ticket } = getQuery(event);
  const ticketValue = Array.isArray(ticket) ? ticket[0] : ticket;

  if (!ticketValue) {
    return sendRedirect(event, "/login");
  }

  const validateUrl = `${casBaseUrl}/serviceValidate?service=${casServiceUrl}&ticket=${encodeURIComponent(ticketValue)}`;
  const rawXml = await $fetch<string>(validateUrl);

  const casUser = extractCasValue(rawXml, ["user", "ID_NUMBER"]);
  const casName = extractCasValue(rawXml, ["USER_NAME", "name"]);

  if (!casUser) {
    return sendRedirect(event, "/login");
  }

  const email = `${casUser}@cas.local`;

  let user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user) {
    [user] = await db
      .insert(schema.users)
      .values({
        name: casName ?? casUser,
        email,
      })
      .returning();
  }

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create CAS user",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });

  return sendRedirect(event, "/");
});
