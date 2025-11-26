export const DATABASE_COLLECTIONS = {
  USERS: "users",
} as const;

export type DatabaseCollectionName =
  (typeof DATABASE_COLLECTIONS)[keyof typeof DATABASE_COLLECTIONS];
