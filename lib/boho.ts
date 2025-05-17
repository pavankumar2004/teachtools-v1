import { bohoAuth } from "bohoauth";

// Generate a fixed secret key if not provided in env
export const DEFAULT_SECRET = "directory-secret-key-please-change-in-production";

export const boho = bohoAuth({
  // Use ADMIN_PASSWORD or fallback to a default (for demo purposes only)
  password: process.env.ADMIN_PASSWORD || "password123",
  // Use BOHO_SECRET or fallback to the default secret
  secret: process.env.BOHO_SECRET || DEFAULT_SECRET,
  expiresIn: "1h",
  middleware: {
    loginPath: "/admin/login",
    protectedPaths: [
      "/admin",
      "/admin/basic",
      "/admin/manage",
      "/api/bookmarks"
    ],
    redirectPath: "/admin",
  },
});
