import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function updateSuperAdminPassword() {
  await db.update(users)
    .set({ password: "123456789" })
    .where(
      and(
        eq(users.username, "kk"),
        eq(users.role, "super_admin")
      )
    );
}