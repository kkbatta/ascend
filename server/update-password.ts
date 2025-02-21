import { hashPassword } from "./auth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function updateSuperAdminPassword() {
  const hashedPassword = await hashPassword("WideOpenThrottle");

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(
      and(
        eq(users.username, "kk"),
        eq(users.role, "super_admin")
      )
    );
}