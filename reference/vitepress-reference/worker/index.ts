// Making changes to this file is **STRICTLY** forbidden. Please add your routes in `userRoutes.ts` file.

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// --- START: CLIENT ERROR REPORTING INTERFACE ---
export interface ClientErrorReport {
  message: string;
  url: string;
  timestamp: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  errorBoundaryProps?: Record<string, unknown>;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
  level: "error" | "warning" | "info";
  category: "react" | "javascript" | "network" | "user" | "unknown";
}
// --- END: CLIENT ERROR REPORTING INTERFACE ---

const app = new Hono();

app.use("*", logger());

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/api/health", (c) =>
  c.json({
    success: true,
    data: { status: "healthy", timestamp: new Date().toISOString() },
  }),
);

// --- START: CLIENT ERROR REPORTING ENDPOINT ---
app.post("/api/client-errors", async (c) => {
  try {
    const e = await c.req.json<ClientErrorReport>();

    // Log the error to the server console (visible to Agent/Developer)
    console.error(
      `[CLIENT ERROR - ${e.level.toUpperCase()}]`,
      JSON.stringify(
        {
          timestamp: e.timestamp || new Date().toISOString(),
          level: e.level,
          category: e.category,
          message: e.message,
          url: e.url,
          stack: e.stack,
          componentStack: e.componentStack,
          errorBoundary: e.errorBoundary,
        },
        null,
        2,
      ),
    );
    return c.json({ success: true });
  } catch (error) {
    console.error(
      "[CLIENT ERROR HANDLER] Failed to process incoming report:",
      error,
    );
    return c.json({ success: false, error: "Failed to process" }, 500);
  }
});
app.onError((err, c) => {
  console.error(`[ERROR] ${err}`);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

console.log(`Server is running`);

export default { fetch: app.fetch };
