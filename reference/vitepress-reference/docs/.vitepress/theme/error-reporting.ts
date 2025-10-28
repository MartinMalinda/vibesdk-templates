interface BaseErrorData {
  url: string;
  timestamp: string;
}

interface ErrorReport extends BaseErrorData {
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
  level: "error" | "warning" | "info";
  // Simplified categories for a static site
  category: "javascript" | "network" | "console" | "unknown";
}

type ConsoleMethod = "warn" | "error";
type ConsoleArgs = unknown[];

interface ErrorContext {
  message: string;
  stack?: string;
  source?: string;
  url?: string;
  level: "error" | "warning" | "info";
}

const CONSOLE_ERROR_PREFIX = "[CONSOLE ERROR]" as const;
const WARNING_PREFIX = "[WARNING]" as const;
const REPORTING_ENDPOINT = "/api/client-errors" as const;

// Shared categorization utility (minimalist)
const categorize = (message: string): ErrorReport["category"] => {
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("Failed to load")
  ) {
    return "network";
  }
  if (message.includes("[CONSOLE")) {
    return "console";
  }
  if (
    message.includes("TypeError") ||
    message.includes("ReferenceError") ||
    message.includes("SyntaxError") ||
    message.includes("Uncaught Error")
  ) {
    return "javascript";
  }
  return "unknown";
};

// Utility to format console arguments into a single string
const formatConsoleArgs = (args: unknown[]): string => {
  return args
    .map((arg) =>
      typeof arg === "string"
        ? arg
        : typeof arg === "object" && arg
          ? JSON.stringify(arg, null, 2)
          : String(arg),
    )
    .join(" ");
};

// --- Minimalist Deduplication System ---

class SimpleErrorDeduplicator {
  // signature (core message) -> timestamp of last report
  private reportedSignatures = new Map<string, number>();
  private readonly deduplicationWindow = 5000; // 5 seconds

  // Normalizes the message to group similar errors (e.g., stripping unique IDs)
  private generateSignature(message: string): string {
    return message
      .replace(/\[CONSOLE ERROR\]|\[WARNING\]/g, "")
      .replace(/^Uncaught Error:\s*/i, "")
      .replace(/^Error:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  shouldReport(message: string): boolean {
    const signature = this.generateSignature(message);
    const now = Date.now();
    const lastReported = this.reportedSignatures.get(signature);

    if (lastReported && now - lastReported < this.deduplicationWindow) {
      return false; // Duplicate within window
    }

    this.reportedSignatures.set(signature, now);
    return true;
  }
}

const simpleDeduplicator = new SimpleErrorDeduplicator();

// --- Main Error Reporter Class ---

class ErrorReporter {
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;
  private readonly maxQueueSize = 10;
  private originalConsoleWarn: typeof console.warn | null = null;
  private originalConsoleError: typeof console.error | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window === "undefined") return;

    try {
      this.setupConsoleInterceptors();
      this.setupGlobalErrorHandler();
      this.setupUnhandledRejectionHandler();

      this.isInitialized = true;
    } catch (err) {
      console.error("[ErrorReporter] Failed to initialize:", err);
    }
  }

  // --- Global Event Handlers ---

  private setupGlobalErrorHandler() {
    const originalHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMessage =
        typeof message === "string" ? message : "Unknown error";

      const context: ErrorContext = {
        message: errorMessage,
        stack: error?.stack,
        source: source || undefined,
        level: "error",
        url: window.location.href,
      };

      if (!this.filterAndDeduplicate(context)) {
        if (originalHandler) {
          return originalHandler(message, source, lineno, colno, error);
        }
        return true;
      }

      const payload = this.createErrorPayload({
        message: errorMessage,
        stack: error?.stack,
        source: source || undefined,
        lineno: lineno || undefined,
        colno: colno || undefined,
        error: error,
      });

      this.report(payload);

      if (originalHandler) {
        return originalHandler(message, source, lineno, colno, error);
      }
      return true; // Prevent default browser error handling
    };
  }

  private setupUnhandledRejectionHandler() {
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      const errorMessage = error?.message || "Unhandled Promise Rejection";

      const context: ErrorContext = {
        message: errorMessage,
        stack: error?.stack,
        level: "error",
        url: window.location.href,
      };

      if (!this.filterAndDeduplicate(context)) return;

      const payload = this.createErrorPayload({
        message: errorMessage,
        stack: error?.stack,
        error: error,
      });

      this.report(payload);
    });
  }

  // --- Console Interception ---

  private createConsoleInterceptor(
    method: ConsoleMethod,
    original: (...args: unknown[]) => void,
    prefix: string,
  ) {
    return (...args: ConsoleArgs) => {
      // 1. Call original first
      original.apply(console, args);

      try {
        // 2. Report if necessary
        const message = formatConsoleArgs(args);
        const stack = new Error().stack;
        const level = method === "warn" ? "warning" : "error";

        const context: ErrorContext = {
          message: `${prefix} ${message}`,
          stack,
          level,
          url: window.location.href,
        };

        if (!this.filterAndDeduplicate(context)) return;

        const payload = this.createErrorPayload({
          message: context.message,
          stack,
          level,
        });

        this.report(payload);
      } catch {
        // Fail silently
      }
    };
  }

  private setupConsoleInterceptors() {
    this.originalConsoleWarn = console.warn;
    this.originalConsoleError = console.error;

    // Intercept console.error
    console.error = this.createConsoleInterceptor(
      "error",
      this.originalConsoleError!,
      CONSOLE_ERROR_PREFIX,
    );

    // Intercept console.warn
    console.warn = this.createConsoleInterceptor(
      "warn",
      this.originalConsoleWarn!,
      WARNING_PREFIX,
    );
  }

  // --- Reporting Core ---

  private createBaseErrorData(): BaseErrorData {
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
  }

  private createErrorPayload(
    data: Partial<ErrorReport> & { message: string },
  ): ErrorReport {
    const baseData = this.createBaseErrorData();
    return {
      ...baseData,
      level: (data.level ?? "error") as "error" | "warning" | "info",
      category: categorize(data.message),
      ...data,
    };
  }

  private filterAndDeduplicate(context: ErrorContext): boolean {
    // 1. Skip our own debug messages
    if (context.message.includes("[ErrorReporter]")) {
      return false;
    }

    // 2. Apply deduplication
    return simpleDeduplicator.shouldReport(context.message);
  }

  public report(error: ErrorReport): void {
    if (!this.isInitialized || typeof window === "undefined") {
      return;
    }

    try {
      this.errorQueue.push(error);

      // Limit queue size
      if (this.errorQueue.length > this.maxQueueSize) {
        this.errorQueue.shift(); // Remove oldest error
      }

      // Process queue
      this.processQueue();
    } catch (err) {
      // Swallow reporting errors in client
    }
  }

  private async processQueue() {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;
    const errorsToReport = [...this.errorQueue];
    this.errorQueue = [];

    try {
      for (const error of errorsToReport) {
        await this.sendError(error);
      }
    } catch (err) {
      // If reporting fails, add errors back to queue
      console.error("[ErrorReporter] Failed to report errors:", err);
      this.errorQueue.unshift(...errorsToReport);
    } finally {
      this.isReporting = false;
    }
  }

  private async sendError(error: ErrorReport) {
    try {
      const response = await fetch(REPORTING_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to report error: ${response.status} ${response.statusText}`,
        );
      }

      // Remove the noisy console log
    } catch (err) {
      console.error("[ErrorReporter] Failed to send error:", err);
      throw err;
    }
  }

  // Cleanup method for proper disposal
  public dispose(): void {
    if (this.originalConsoleWarn) {
      console.warn = this.originalConsoleWarn;
    }
    if (this.originalConsoleError) {
      console.error = this.originalConsoleError;
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
export const errorReporter = new ErrorReporter();

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    errorReporter.dispose();
  });
}
