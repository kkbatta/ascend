import { hashPassword } from "./auth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { log } from "./vite";

export async function updateSuperAdminPassword() {
  try {
    // First check if super admin exists and get current password
    const [currentUser] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.username, "kk"),
          eq(users.role, "super_admin")
        )
      );

    log(`Current super admin password: ${currentUser?.password}`);

    const hashedPassword = await hashPassword("WideOpenThrottle");
    log(`New hashed password generated: ${hashedPassword}`);

    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(users.username, "kk"),
          eq(users.role, "super_admin")
        )
      )
      .returning();

    log(`Password update result: ${JSON.stringify(result)}`);
  } catch (error) {
    log(`Error updating super admin password: ${error}`);
    throw error;
  }
}