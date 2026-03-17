import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/** Set the database name only when there are multiple words in the field,
 * such as `createdAt: timestamp("created_at")`,
 * but not for single-word fields like `id: serial()` */

export const userRole = pgEnum("user_role", ["superadmin", "admin", "user"]);

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  role: userRole().notNull().default("user"),
  pointsTotal: integer("points_total").notNull().default(0),
  pointsBalance: integer("points_balance").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMemberRole = pgEnum("team_member_role", [
  "owner",
  "admin",
  "member",
]);

export const vulnerabilitySeverity = pgEnum("vulnerability_severity", [
  "low",
  "medium",
  "high",
]);

export const vulnerabilityStatus = pgEnum("vulnerability_status", [
  "draft",
  "pending",
  "approved",
  "duplicate",
  "rejected",
]);

export const announcements = pgTable(
  "announcements",
  {
    id: serial().primaryKey(),
    title: text().notNull(),
    content: text().notNull(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    teamId: integer("team_id").references(() => teams.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    pinned: boolean("pinned").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("announcements_author_id_idx").on(table.authorId),
    index("announcements_team_id_idx").on(table.teamId),
    index("announcements_pinned_idx").on(table.pinned),
  ],
);

export const teams = pgTable("teams", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  description: text(),
  pointsTotal: integer("points_total").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial().primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    role: teamMemberRole().notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    unique("team_members_team_id_user_id_unique").on(
      table.teamId,
      table.userId,
    ),
    index("team_members_user_id_idx").on(table.userId),
    index("team_members_team_id_idx").on(table.teamId),
  ],
);

export const pointTransactions = pgTable(
  "point_transactions",
  {
    id: serial().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    points: integer("points").notNull(),
    reason: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("point_transactions_user_id_idx").on(table.userId)],
);

export const vulnerabilities = pgTable(
  "vulnerabilities",
  {
    id: serial().primaryKey(),
    title: text().notNull(),
    type: text().notNull(),
    severity: vulnerabilitySeverity().notNull(),
    unit: text(),
    vendor: text(),
    points: integer("points").notNull().default(0),
    description: text().notNull(),
    status: vulnerabilityStatus().notNull().default("draft"),
    isPublic: boolean("is_public").notNull().default(false),
    advisory: text(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("vulnerabilities_vendor_idx").on(table.vendor),
    index("vulnerabilities_severity_idx").on(table.severity),
    index("vulnerabilities_status_idx").on(table.status),
    index("vulnerabilities_type_idx").on(table.type),
    index("vulnerabilities_unit_idx").on(table.unit),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  announcements: many(announcements),
  teamMembers: many(teamMembers),
  pointTransactions: many(pointTransactions),
  vulnerabilities: many(vulnerabilities),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [announcements.teamId],
    references: [teams.id],
  }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  announcements: many(announcements),
  teamMembers: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const pointTransactionsRelations = relations(
  pointTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [pointTransactions.userId],
      references: [users.id],
    }),
  }),
);

export const vulnerabilitiesRelations = relations(vulnerabilities, ({ one }) => ({
  author: one(users, {
    fields: [vulnerabilities.authorId],
    references: [users.id],
  }),
}));
