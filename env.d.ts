declare global {
  interface CloudflareEnv {
    DB: D1Database;
    ADMIN_SESSION_SECRET?: string;
  }
}

export {};
