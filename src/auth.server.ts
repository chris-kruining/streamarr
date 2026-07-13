import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(join(process.cwd(), "package.json"));

export const auth = betterAuth({
  appName: "Streamarr",
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ??
    process.env.AUTH_SECRET ??
    "streamarr-local-development-secret-change-me",
  database: createDatabase(),
  logger: {
    level: "debug",
    log(level, message, ...args) {
      console.log(level, message, {args});
    },
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        nullable: true,
      },
      username: {
        type: "string",
        nullable: true,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "authelia",
          clientId: process.env.AUTHELIA_CLIENT_ID ?? "streamarr",
          clientSecret: process.env.AUTHELIA_CLIENT_SECRET ?? "",
          discoveryUrl:
            process.env.AUTHELIA_DISCOVERY_URL ??
            "https://auth.kruining.eu/.well-known/openid-configuration",
          scopes: [
            "offline_access",
            "openid",
            "email",
            "picture",
            "profile",
            "groups",
          ],
          accessType: "offline",
          pkce: true,
          mapProfileToUser: ({ id, name, email, image, preferred_username, emailVerified }) => 
            ({ id, name, email, emailVerified, image, username: preferred_username }),
        },
      ],
    }),
  ],
});

function createDatabase() {
  const path = process.env.AUTH_DB_PATH ?? "auth.sqlite";

  if (process.versions.bun !== undefined) {
    const { Database } = require("bun:sqlite") as typeof import("bun:sqlite");

    return new Database(path, { create: true });
  }

  const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");

  return new DatabaseSync(path);
}
