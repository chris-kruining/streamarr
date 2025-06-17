import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { profile } from "bun:jsc";
import { Database } from "bun:sqlite";

export const auth = betterAuth({
  appName: "Streamarr",
  basePath: "/api/auth",
  database: new Database('auth.sqlite', { create: true }),
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
          clientId: "streamarr",
          clientSecret:
            "ZPuiW2gpVV6MGXIJFk5P3EeSW8V_ICgqduF.hJVCKkrnVmRqIQXRk0o~HSA8ZdCf8joA4m_F",
          discoveryUrl:
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
