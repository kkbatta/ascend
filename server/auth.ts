import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { User as SelectUser, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { log } from "./vite";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes(".")) {
    log(`Invalid stored password format: ${stored}`);
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    log(`Missing hash or salt in stored password: ${stored}`);
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export async function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        if (!user) {
          log(`User not found: ${username}`);
          return done(null, false, { message: "Invalid username or password" });
        }

        log(`Attempting login for user: ${username}`);
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          log(`Invalid password for user: ${username}`);
          return done(null, false, { message: "Invalid username or password" });
        }

        log(`Successful login for user: ${username}`);
        return done(null, user);
      } catch (err) {
        log(`Login error: ${err}`);
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  try {
    // Check if any admin users exist
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .execute();

    const existingSuperAdmin = await db
      .select()
      .from(users)
      .where(eq(users.role, "super_admin"))
      .execute();

    // Only create default admins if none exist
    if (existingAdmins.length === 0 && existingSuperAdmin.length === 0) {
      log("No existing admin users found. Creating default admin users...");

      const defaultAdmins = [
        { username: "spandana", role: "admin" },
        { username: "ramesh", role: "admin" },
        { username: "shiva", role: "admin" },
        { username: "crazyguy", role: "admin" },
        { username: "kk", role: "super_admin" },
      ];

      for (const admin of defaultAdmins) {
        try {
          const hashedPassword = await hashPassword("gobigorgohome");
          await db.insert(users).values({
            username: admin.username,
            password: hashedPassword,
            email: `${admin.username}@example.com`,
            fullName: admin.username.charAt(0).toUpperCase() + admin.username.slice(1),
            role: admin.role,
            dateOfBirth: new Date("1990-01-01"),
          });
          log(`Created admin user: ${admin.username}`);
        } catch (error: any) {
          log(`Error creating admin user ${admin.username}: ${error.message}`);
          // Continue with next admin if one fails
          continue;
        }
      }
    } else {
      log("Admin users already exist, skipping creation");
    }
  } catch (error: any) {
    log(`Error during admin user setup: ${error.message}`);
    // Don't throw error, allow server to continue starting
  }

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}