import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import { updateSuperAdminPassword } from "./update-password";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a shutdown flag to track server state
let isShuttingDown = false;

// Add shutdown endpoint (secured with an environment variable)
app.post('/api/admin/shutdown', (req, res) => {
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  isShuttingDown = true;
  res.json({ message: 'Server shutdown initiated' });

  // Give time for existing connections to close
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

// Enhanced CORS middleware for production
app.use((req, res, next) => {
  if (isShuttingDown) {
    res.status(503).json({ message: 'Service is shutting down' });
    return;
  }

  const allowedOrigins = [
    'https://elevatefinancial.life',
    'https://www.elevatefinancial.life',
    process.env.CUSTOM_DOMAIN,
    process.env.REPLIT_DOMAIN,
    ...((process.env.ADDITIONAL_DOMAINS || '').split(',').filter(Boolean))
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // In development, be more permissive
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Update super admin password first
    await updateSuperAdminPassword();
    log("Successfully updated super admin password");

    // Set up authentication before routes
    await setupAuth(app);

    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const PORT = Number(process.env.PORT) || 5000;
    server.listen(PORT, () => {
      log(`Server running in ${app.get("env")} mode on port ${PORT}`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
})();